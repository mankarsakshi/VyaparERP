const { getDB } = require('../database/db');

// Check if debit note number already exists for user in financial year
const checkDebitNoteExists = async (debitNoteNumber, userId, financialYearId) => {
    const db = getDB();
    let query = 'SELECT id FROM purchase_returns WHERE user_id = ? AND debit_note_number = ?';
    const params = [userId, debitNoteNumber];

    if (financialYearId) {
        query += ' AND financial_year_id = ?';
        params.push(financialYearId);
    }

    const [rows] = await db.query(query, params);
    return rows.length > 0;
};

// Generate next Debit Note Number (DN-YYYY-XXXX)
const getNextDebitNoteNumber = async (userId, financialYearId = null) => {
    const db = getDB();
    let query = 'SELECT debit_note_number FROM purchase_returns WHERE user_id = ?';
    const params = [userId];

    if (financialYearId) {
        query += ' AND financial_year_id = ?';
        params.push(financialYearId);
    }

    const [rows] = await db.query(query, params);
    const year = new Date().getFullYear();
    const prefix = `DN-${year}-`;
    let maxSeq = 0;

    for (const r of rows) {
        if (r.debit_note_number && r.debit_note_number.startsWith(prefix)) {
            const numPart = parseInt(r.debit_note_number.substring(prefix.length), 10);
            if (!isNaN(numPart) && numPart > maxSeq) {
                maxSeq = numPart;
            }
        }
    }

    const formattedNum = String(maxSeq + 1).padStart(4, '0');
    return `DN-${year}-${formattedNum}`;
};

// Create Purchase Return / Debit Note with Items (using Transaction)
const createPurchaseReturn = async (returnData, items = []) => {
    const db = getDB();
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Resolve or auto-link supplier_id
        let supplierId = returnData.supplier_id ? Number(returnData.supplier_id) : null;
        if (!supplierId && returnData.supplier_name) {
            try {
                const [supRows] = await connection.query(
                    `SELECT id FROM suppliers WHERE LOWER(TRIM(supplier_name)) = LOWER(TRIM(?)) AND user_id = ? LIMIT 1`,
                    [returnData.supplier_name, returnData.user_id]
                );
                if (supRows.length > 0) {
                    supplierId = supRows[0].id;
                } else {
                    const [newSup] = await connection.query(
                        `INSERT INTO suppliers (user_id, supplier_name, phone, gstin, state, status) VALUES (?, ?, ?, ?, ?, 'active')`,
                        [
                            returnData.user_id,
                            returnData.supplier_name.trim(),
                            returnData.supplier_phone || '',
                            returnData.supplier_gstin || '',
                            returnData.supplier_state || 'Maharashtra'
                        ]
                    );
                    supplierId = newSup.insertId;
                }
            } catch (supErr) {
                console.warn('Supplier auto-resolution notice:', supErr.message);
            }
        }

        const [returnResult] = await connection.query(
            `INSERT INTO purchase_returns (
                user_id,
                financial_year_id,
                supplier_id,
                supplier_name,
                debit_note_number,
                original_invoice_number,
                return_date,
                return_reason,
                refund_status,
                subtotal,
                total_discounts,
                total_taxable,
                total_gst,
                grand_total,
                notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                returnData.user_id,
                returnData.financial_year_id || null,
                supplierId,
                returnData.supplier_name || null,
                returnData.debit_note_number,
                returnData.original_invoice_number || '',
                returnData.return_date,
                returnData.return_reason,
                returnData.refund_status || 'Refund Pending',
                returnData.subtotal || 0,
                returnData.total_discounts || 0,
                returnData.total_taxable || 0,
                returnData.total_gst || 0,
                returnData.grand_total || 0,
                returnData.notes || null
            ]
        );

        const returnId = returnResult.insertId;

        // 2. Insert items and adjust inventory (debit note returns goods to supplier -> stock decreases)
        if (items && items.length > 0) {
            for (const item of items) {
                const productName = item.product_name || item.productName || 'General Item';
                const productId = item.product_id ? Number(item.product_id) : null;
                const batchNo = item.batch_no || item.batchNo || null;
                const hsnCode = item.hsn_code || item.hsnCode || '';
                const qty = Number(item.quantity || 1);
                const rate = Number(item.rate !== undefined ? item.rate : (item.purchase_price || 0));
                const disc = Number(item.discount || 0);
                const gstRate = Number(item.gst_rate !== undefined ? item.gst_rate : (item.tax_rate !== undefined ? item.tax_rate : 18));

                const raw = qty * rate;
                const discVal = (raw * disc) / 100;
                const taxable = Math.max(0, raw - discVal);
                const gstVal = (taxable * gstRate) / 100;
                const itemTotal = taxable + gstVal;

                await connection.query(
                    `INSERT INTO purchase_return_items (
                        purchase_return_id,
                        product_id,
                        product_name,
                        batch_no,
                        hsn_code,
                        quantity,
                        rate,
                        discount,
                        gst_rate,
                        taxable_amount,
                        gst_amount,
                        total_amount
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        returnId,
                        productId,
                        productName,
                        batchNo,
                        hsnCode,
                        qty,
                        rate,
                        disc,
                        gstRate,
                        taxable,
                        gstVal,
                        itemTotal
                    ]
                );

                // Stock reduction for purchase return (sending inventory back to supplier)
                if (productId && qty > 0) {
                    try {
                        const [prodRows] = await connection.query(
                            `SELECT opening_stock FROM products WHERE id = ? FOR UPDATE`,
                            [productId]
                        );
                        if (prodRows.length > 0) {
                            const stockBefore = Number(prodRows[0].opening_stock || 0);
                            const stockAfter = Math.max(0, stockBefore - qty);

                            await connection.query(
                                `UPDATE products SET opening_stock = ? WHERE id = ?`,
                                [stockAfter, productId]
                            );

                            if (batchNo) {
                                try {
                                    await connection.query(
                                        `UPDATE product_batches SET quantity = GREATEST(0, quantity - ?) WHERE LOWER(TRIM(batch_no)) = LOWER(TRIM(?)) AND product_id = ? AND business_id = ?`,
                                        [qty, batchNo, productId, returnData.user_id]
                                    );
                                } catch (bErr) {
                                    console.warn('Batch quantity update notice:', bErr.message);
                                }
                            }

                            // Log inventory audit transaction
                            try {
                                await connection.query(
                                    `INSERT INTO inventory_transactions (
                                        user_id,
                                        financial_year_id,
                                        product_id,
                                        transaction_type,
                                        reference_type,
                                        reference_id,
                                        quantity,
                                        stock_before,
                                        stock_after,
                                        notes
                                    ) VALUES (?, ?, ?, 'STOCK_OUT', 'PURCHASE_RETURN', ?, ?, ?, ?, ?)`,
                                    [
                                        returnData.user_id,
                                        returnData.financial_year_id || null,
                                        productId,
                                        returnId,
                                        -qty,
                                        stockBefore,
                                        stockAfter,
                                        `Debit Note ${returnData.debit_note_number} created - Return to Supplier (-${qty})`
                                    ]
                                );
                            } catch (invErr) {
                                console.warn('Inventory log notice:', invErr.message);
                            }
                        }
                    } catch (stockErr) {
                        console.warn('Stock update notice:', stockErr.message);
                    }
                }
            }
        }

        await connection.commit();
        return returnId;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// Get All Purchase Returns for a user
const getPurchaseReturns = async (userId, financialYearId = null) => {
    const db = getDB();
    let query = `
        SELECT 
            pr.*,
            s.supplier_name AS linked_supplier_name,
            s.phone AS supplier_phone,
            s.state AS supplier_state,
            s.gstin AS supplier_gstin
        FROM purchase_returns pr
        LEFT JOIN suppliers s ON pr.supplier_id = s.id
        WHERE pr.user_id = ?
    `;
    const params = [userId];

    if (financialYearId) {
        query += ' AND pr.financial_year_id = ?';
        params.push(financialYearId);
    }

    query += ' ORDER BY pr.return_date DESC, pr.id DESC';

    const [returns] = await db.query(query, params);

    if (returns.length === 0) {
        return [];
    }

    const returnIds = returns.map(r => r.id);

    // Fetch items for all returns in one query
    const [items] = await db.query(
        `SELECT * FROM purchase_return_items WHERE purchase_return_id IN (?) ORDER BY id ASC`,
        [returnIds]
    );

    const itemsMap = {};
    items.forEach(item => {
        if (!itemsMap[item.purchase_return_id]) {
            itemsMap[item.purchase_return_id] = [];
        }
        itemsMap[item.purchase_return_id].push({
            id: item.id,
            product_id: item.product_id,
            productName: item.product_name,
            product_name: item.product_name,
            batch_no: item.batch_no || '',
            hsnCode: item.hsn_code,
            hsn_code: item.hsn_code,
            quantity: Number(item.quantity),
            rate: Number(item.rate),
            discount: Number(item.discount),
            gstRate: Number(item.gst_rate),
            gst_rate: Number(item.gst_rate),
            taxable_amount: Number(item.taxable_amount),
            gst_amount: Number(item.gst_amount),
            total_amount: Number(item.total_amount)
        });
    });

    return returns.map(r => ({
        id: r.id,
        debitNoteNumber: r.debit_note_number,
        debit_note_number: r.debit_note_number,
        originalInvoiceNumber: r.original_invoice_number || '',
        original_invoice_number: r.original_invoice_number || '',
        supplier_id: r.supplier_id,
        supplierName: r.supplier_name || r.linked_supplier_name || 'N/A',
        supplier_name: r.supplier_name || r.linked_supplier_name || 'N/A',
        supplier_phone: r.supplier_phone || '',
        supplier_state: r.supplier_state || 'Maharashtra',
        gstin: r.supplier_gstin || '',
        returnDate: r.return_date,
        return_date: r.return_date,
        returnReason: r.return_reason,
        return_reason: r.return_reason,
        refundStatus: r.refund_status,
        refund_status: r.refund_status,
        subtotal: Number(r.subtotal),
        totalDiscounts: Number(r.total_discounts),
        totalTaxable: Number(r.total_taxable),
        totalGst: Number(r.total_gst),
        grandTotal: Number(r.grand_total),
        grand_total: Number(r.grand_total),
        notes: r.notes || '',
        created_at: r.created_at,
        updated_at: r.updated_at,
        items: itemsMap[r.id] || []
    }));
};

// Get Purchase Return by ID
const getPurchaseReturnById = async (id, userId) => {
    const db = getDB();
    const [rows] = await db.query(
        `SELECT pr.*, s.supplier_name AS linked_supplier_name, s.phone AS supplier_phone, s.state AS supplier_state, s.gstin AS supplier_gstin
         FROM purchase_returns pr
         LEFT JOIN suppliers s ON pr.supplier_id = s.id
         WHERE (pr.id = ? OR pr.debit_note_number = ?) AND pr.user_id = ?`,
        [id, id, userId]
    );

    if (rows.length === 0) return null;

    const r = rows[0];

    const [items] = await db.query(
        `SELECT * FROM purchase_return_items WHERE purchase_return_id = ? ORDER BY id ASC`,
        [r.id]
    );

    const formattedItems = items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        productName: item.product_name,
        product_name: item.product_name,
        batch_no: item.batch_no || '',
        hsnCode: item.hsn_code,
        hsn_code: item.hsn_code,
        quantity: Number(item.quantity),
        rate: Number(item.rate),
        discount: Number(item.discount),
        gstRate: Number(item.gst_rate),
        gst_rate: Number(item.gst_rate),
        taxable_amount: Number(item.taxable_amount),
        gst_amount: Number(item.gst_amount),
        total_amount: Number(item.total_amount)
    }));

    return {
        id: r.id,
        debitNoteNumber: r.debit_note_number,
        debit_note_number: r.debit_note_number,
        originalInvoiceNumber: r.original_invoice_number || '',
        original_invoice_number: r.original_invoice_number || '',
        supplier_id: r.supplier_id,
        supplierName: r.supplier_name || r.linked_supplier_name || 'N/A',
        supplier_name: r.supplier_name || r.linked_supplier_name || 'N/A',
        supplier_phone: r.supplier_phone || '',
        supplier_state: r.supplier_state || 'Maharashtra',
        gstin: r.supplier_gstin || '',
        returnDate: r.return_date,
        return_date: r.return_date,
        returnReason: r.return_reason,
        return_reason: r.return_reason,
        refundStatus: r.refund_status,
        refund_status: r.refund_status,
        subtotal: Number(r.subtotal),
        totalDiscounts: Number(r.total_discounts),
        totalTaxable: Number(r.total_taxable),
        totalGst: Number(r.total_gst),
        grandTotal: Number(r.grand_total),
        grand_total: Number(r.grand_total),
        notes: r.notes || '',
        created_at: r.created_at,
        updated_at: r.updated_at,
        items: formattedItems
    };
};

// Update Purchase Return (using Transaction)
const updatePurchaseReturn = async (id, userId, returnData, items = []) => {
    const db = getDB();
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [existing] = await connection.query(
            'SELECT id FROM purchase_returns WHERE (id = ? OR debit_note_number = ?) AND user_id = ? FOR UPDATE',
            [id, id, userId]
        );

        if (existing.length === 0) {
            throw new Error('Purchase Return record not found');
        }

        const realId = existing[0].id;

        await connection.query(
            `UPDATE purchase_returns SET
                supplier_id = ?,
                supplier_name = ?,
                debit_note_number = ?,
                original_invoice_number = ?,
                return_date = ?,
                return_reason = ?,
                refund_status = ?,
                subtotal = ?,
                total_discounts = ?,
                total_taxable = ?,
                total_gst = ?,
                grand_total = ?,
                notes = ?
            WHERE id = ? AND user_id = ?`,
            [
                returnData.supplier_id || null,
                returnData.supplier_name || null,
                returnData.debit_note_number,
                returnData.original_invoice_number || '',
                returnData.return_date,
                returnData.return_reason,
                returnData.refund_status,
                returnData.subtotal || 0,
                returnData.total_discounts || 0,
                returnData.total_taxable || 0,
                returnData.total_gst || 0,
                returnData.grand_total || 0,
                returnData.notes || null,
                realId,
                userId
            ]
        );

        // Delete existing items and re-insert
        await connection.query(
            'DELETE FROM purchase_return_items WHERE purchase_return_id = ?',
            [realId]
        );

        if (items && items.length > 0) {
            for (const item of items) {
                const productName = item.product_name || item.productName || 'General Item';
                const productId = item.product_id ? Number(item.product_id) : null;
                const batchNo = item.batch_no || item.batchNo || null;
                const hsnCode = item.hsn_code || item.hsnCode || '';
                const qty = Number(item.quantity || 1);
                const rate = Number(item.rate !== undefined ? item.rate : (item.purchase_price || 0));
                const disc = Number(item.discount || 0);
                const gstRate = Number(item.gst_rate !== undefined ? item.gst_rate : (item.tax_rate !== undefined ? item.tax_rate : 18));

                const raw = qty * rate;
                const discVal = (raw * disc) / 100;
                const taxable = Math.max(0, raw - discVal);
                const gstVal = (taxable * gstRate) / 100;
                const itemTotal = taxable + gstVal;

                await connection.query(
                    `INSERT INTO purchase_return_items (
                        purchase_return_id,
                        product_id,
                        product_name,
                        batch_no,
                        hsn_code,
                        quantity,
                        rate,
                        discount,
                        gst_rate,
                        taxable_amount,
                        gst_amount,
                        total_amount
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        realId,
                        productId,
                        productName,
                        batchNo,
                        hsnCode,
                        qty,
                        rate,
                        disc,
                        gstRate,
                        taxable,
                        gstVal,
                        itemTotal
                    ]
                );
            }
        }

        await connection.commit();
        return true;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// Delete Purchase Return / Debit Note (reverses inventory stock adjustments)
const deletePurchaseReturn = async (identifier, userId, extraDebitNoteNo = null) => {
    const db = getDB();
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const numVal = Number(identifier);
        const isNumeric = !isNaN(numVal) && String(identifier).trim() !== '' && !String(identifier).includes('-') && numVal > 0 && numVal <= 2147483647;

        let returnRows = [];
        if (isNumeric) {
            const [rows] = await connection.query(
                `SELECT id, debit_note_number, financial_year_id FROM purchase_returns WHERE (id = ? OR debit_note_number = ?) AND user_id = ?`,
                [numVal, String(identifier), userId]
            );
            returnRows = rows;
        }

        if (returnRows.length === 0) {
            const searchNo = extraDebitNoteNo || String(identifier);
            const [rows] = await connection.query(
                `SELECT id, debit_note_number, financial_year_id FROM purchase_returns WHERE debit_note_number = ? AND user_id = ?`,
                [searchNo, userId]
            );
            returnRows = rows;
        }

        // Fallback without user_id if needed
        if (returnRows.length === 0) {
            if (isNumeric) {
                const [rows] = await connection.query(
                    `SELECT id, debit_note_number, financial_year_id FROM purchase_returns WHERE (id = ? OR debit_note_number = ?)`,
                    [numVal, String(identifier)]
                );
                returnRows = rows;
            }
            if (returnRows.length === 0) {
                const searchNo = extraDebitNoteNo || String(identifier);
                const [rows] = await connection.query(
                    `SELECT id, debit_note_number, financial_year_id FROM purchase_returns WHERE debit_note_number = ?`,
                    [searchNo]
                );
                returnRows = rows;
            }
        }

        if (returnRows.length === 0) {
            await connection.rollback();
            return false;
        }

        const realId = returnRows[0].id;
        const dnNo = returnRows[0].debit_note_number || `DN-${realId}`;
        const fyId = returnRows[0].financial_year_id || null;

        // Restore inventory stock (reversing the return to supplier adds stock back into system)
        try {
            const [items] = await connection.query(
                `SELECT product_id, quantity, batch_no FROM purchase_return_items WHERE purchase_return_id = ?`,
                [realId]
            );

            for (const item of items) {
                if (item.product_id) {
                    const qty = Number(item.quantity || 0);
                    if (qty > 0) {
                        try {
                            const [prodRows] = await connection.query(
                                `SELECT opening_stock FROM products WHERE id = ? FOR UPDATE`,
                                [item.product_id]
                            );
                            if (prodRows.length > 0) {
                                const stockBefore = Number(prodRows[0].opening_stock || 0);
                                const stockAfter = stockBefore + qty;

                                await connection.query(
                                    `UPDATE products SET opening_stock = ? WHERE id = ?`,
                                    [stockAfter, item.product_id]
                                );

                                if (item.batch_no) {
                                    try {
                                        await connection.query(
                                            `UPDATE product_batches SET quantity = quantity + ? WHERE LOWER(TRIM(batch_no)) = LOWER(TRIM(?)) AND product_id = ? AND business_id = ?`,
                                            [qty, item.batch_no, item.product_id, userId]
                                        );
                                    } catch (bErr) {
                                        console.warn('Batch stock restore notice:', bErr.message);
                                    }
                                }

                                try {
                                    await connection.query(
                                        `INSERT INTO inventory_transactions (
                                            user_id,
                                            financial_year_id,
                                            product_id,
                                            transaction_type,
                                            reference_type,
                                            reference_id,
                                            quantity,
                                            stock_before,
                                            stock_after,
                                            notes
                                        ) VALUES (?, ?, ?, 'STOCK_IN', 'PURCHASE_RETURN_DELETION', ?, ?, ?, ?, ?)`,
                                        [
                                            userId,
                                            fyId,
                                            item.product_id,
                                            realId,
                                            qty,
                                            stockBefore,
                                            stockAfter,
                                            `Debit Note ${dnNo} deleted - Stock Restored (+${qty})`
                                        ]
                                    );
                                } catch (invErr) {
                                    console.warn('Inventory log notice on delete:', invErr.message);
                                }
                            }
                        } catch (prodErr) {
                            console.warn('Stock update notice on delete:', prodErr.message);
                        }
                    }
                }
            }
        } catch (itemErr) {
            console.warn('Item fetch notice on delete:', itemErr.message);
        }

        await connection.query('DELETE FROM purchase_return_items WHERE purchase_return_id = ?', [realId]);
        await connection.query('DELETE FROM purchase_returns WHERE id = ?', [realId]);

        await connection.commit();
        return true;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    checkDebitNoteExists,
    getNextDebitNoteNumber,
    createPurchaseReturn,
    getPurchaseReturns,
    getPurchaseReturnById,
    updatePurchaseReturn,
    deletePurchaseReturn
};
