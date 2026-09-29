const { getDB } = require('../database/db');

// Check if return number / credit note number exists
const checkCreditNoteExists = async (returnNumber, userId, financialYearId) => {
    const db = getDB();
    let query = 'SELECT id FROM sales_returns WHERE user_id = ? AND return_number = ?';
    const params = [userId, returnNumber];

    if (financialYearId) {
        query += ' AND financial_year_id = ?';
        params.push(financialYearId);
    }

    const [rows] = await db.query(query, params);
    return rows.length > 0;
};

// Generate next Credit Note Number (CN-YYYY-XXXX)
const getNextCreditNoteNumber = async (userId, financialYearId = null) => {
    const db = getDB();
    let query = 'SELECT return_number FROM sales_returns WHERE user_id = ?';
    const params = [userId];

    if (financialYearId) {
        query += ' AND financial_year_id = ?';
        params.push(financialYearId);
    }

    const [rows] = await db.query(query, params);
    const year = new Date().getFullYear();
    const prefix = `CN-${year}-`;
    let maxSeq = 0;

    for (const r of rows) {
        if (r.return_number && r.return_number.startsWith(prefix)) {
            const numPart = parseInt(r.return_number.substring(prefix.length), 10);
            if (!isNaN(numPart) && numPart > maxSeq) {
                maxSeq = numPart;
            }
        }
    }

    const formattedNum = String(maxSeq + 1).padStart(4, '0');
    return `CN-${year}-${formattedNum}`;
};

// Create Sales Return with Items (using DB transaction)
const createSalesReturn = async (returnData, items = []) => {
    const db = getDB();
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Resolve or auto-link customer_id
        let customerId = returnData.customer_id ? Number(returnData.customer_id) : null;
        if (!customerId && returnData.customer_name) {
            try {
                const [custRows] = await connection.query(
                    `SELECT id FROM customers WHERE LOWER(TRIM(customer_name)) = LOWER(TRIM(?)) AND user_id = ? LIMIT 1`,
                    [returnData.customer_name, returnData.user_id]
                );
                if (custRows.length > 0) {
                    customerId = custRows[0].id;
                } else {
                    const [newCust] = await connection.query(
                        `INSERT INTO customers (user_id, customer_name, phone, gstin, state, status) VALUES (?, ?, ?, ?, ?, 'active')`,
                        [
                            returnData.user_id,
                            returnData.customer_name.trim(),
                            returnData.customer_phone || null,
                            returnData.customer_gstin || null,
                            returnData.customer_state || 'Maharashtra'
                        ]
                    );
                    customerId = newCust.insertId;
                }
            } catch (cErr) {
                console.warn('Customer resolution notice:', cErr.message);
            }
        }

        const [returnResult] = await connection.query(
            `INSERT INTO sales_returns (
                user_id,
                financial_year_id,
                customer_id,
                customer_name,
                customer_phone,
                customer_gstin,
                customer_state,
                return_number,
                invoice_number,
                return_date,
                reason,
                refund_status,
                payment_method,
                subtotal,
                tax_amount,
                total_amount,
                notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                returnData.user_id,
                returnData.financial_year_id || null,
                customerId,
                returnData.customer_name || null,
                returnData.customer_phone || null,
                returnData.customer_gstin || null,
                returnData.customer_state || 'Maharashtra',
                returnData.return_number,
                returnData.invoice_number || null,
                returnData.return_date,
                returnData.reason || 'Sales Return',
                returnData.refund_status || 'Store Credit',
                returnData.payment_method || 'Credit Note',
                returnData.subtotal || 0,
                returnData.tax_amount || 0,
                returnData.total_amount || 0,
                returnData.notes || null
            ]
        );

        const salesReturnId = returnResult.insertId;

        // Insert line items and adjust inventory stock
        if (items && items.length > 0) {
            for (const item of items) {
                const productName = item.product_name || item.productName || 'General Item';
                const productId = item.product_id ? Number(item.product_id) : null;
                const batchNo = item.batch_no || item.batchNo || null;
                const hsnCode = item.hsn_code || item.hsnCode || '';
                const qty = Number(item.quantity || 1);
                const rate = Number(item.rate || item.unit_price || 0);
                const disc = Number(item.discount || 0);
                const taxRate = Number(item.tax_rate !== undefined ? item.tax_rate : (item.gstRate || 18));
                const taxAmount = Number(item.tax_amount || 0);
                const itemTotal = Number(item.total_amount || 0);

                await connection.query(
                    `INSERT INTO sales_return_items (
                        sales_return_id,
                        product_id,
                        product_name,
                        batch_no,
                        hsn_code,
                        quantity,
                        rate,
                        discount,
                        tax_rate,
                        tax_amount,
                        total_amount
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        salesReturnId,
                        productId,
                        productName,
                        batchNo,
                        hsnCode,
                        qty,
                        rate,
                        disc,
                        taxRate,
                        taxAmount,
                        itemTotal
                    ]
                );

                // Add stock back to inventory if productId is linked
                if (productId) {
                    try {
                        const [prodRows] = await connection.query(
                            `SELECT opening_stock FROM products WHERE id = ? FOR UPDATE`,
                            [productId]
                        );
                        const stockBefore = prodRows.length > 0 ? Number(prodRows[0].opening_stock || 0) : 0;
                        const stockAfter = stockBefore + qty;

                        await connection.query(
                            `UPDATE products SET opening_stock = ? WHERE id = ?`,
                            [stockAfter, productId]
                        );

                        if (batchNo) {
                            try {
                                await connection.query(
                                    'UPDATE product_batches SET quantity = quantity + ? WHERE LOWER(TRIM(batch_no)) = LOWER(TRIM(?)) AND product_id = ? AND business_id = ?',
                                    [qty, batchNo, productId, returnData.user_id]
                                );
                            } catch (bErr) {
                                console.warn('Batch stock restore notice:', bErr.message);
                            }
                        }

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
                            ) VALUES (?, ?, ?, 'SALES_RETURN', 'SALES_RETURN', ?, ?, ?, ?, ?)`,
                            [
                                returnData.user_id,
                                returnData.financial_year_id || null,
                                productId,
                                salesReturnId,
                                qty,
                                stockBefore,
                                stockAfter,
                                `Sales Return ${returnData.return_number}`
                            ]
                        );
                    } catch (invErr) {
                        console.warn('Inventory transaction log notice:', invErr.message);
                    }
                }
            }
        }

        // 3. Adjust linked original invoice balance if refund_status is Store Credit or Adjusted in Credit Note
        if (returnData.invoice_number) {
            try {
                const [saleRows] = await connection.query(
                    `SELECT id, total_amount, paid_amount, balance_amount, payment_status FROM sales WHERE invoice_number = ? AND user_id = ? FOR UPDATE`,
                    [returnData.invoice_number, returnData.user_id]
                );
                if (saleRows.length > 0) {
                    const sale = saleRows[0];
                    const currentBal = Number(sale.balance_amount || 0);
                    if (returnData.refund_status === 'Store Credit' || returnData.refund_status === 'Adjusted in Credit Note') {
                        const adjAmount = Math.min(currentBal, Number(returnData.total_amount || 0));
                        const newBal = Math.max(0, currentBal - adjAmount);
                        const newStatus = newBal <= 0 ? 'Paid' : (Number(sale.paid_amount || 0) > 0 || adjAmount > 0 ? 'Partial' : sale.payment_status);
                        await connection.query(
                            `UPDATE sales SET balance_amount = ?, payment_status = ? WHERE id = ?`,
                            [newBal, newStatus, sale.id]
                        );
                    }
                }
            } catch (saleErr) {
                console.warn('Invoice balance adjustment notice:', saleErr.message);
            }
        }

        await connection.commit();
        return salesReturnId;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// Get All Sales Returns for a user
const getSalesReturns = async (userId, financialYearId = null) => {
    const db = getDB();
    let query = `
        SELECT 
            sr.*,
            c.customer_name AS linked_customer_name,
            c.phone AS linked_customer_phone,
            c.gstin AS linked_customer_gstin
        FROM sales_returns sr
        LEFT JOIN customers c ON sr.customer_id = c.id
        WHERE sr.user_id = ?
    `;
    const params = [userId];

    if (financialYearId) {
        query += ' AND sr.financial_year_id = ?';
        params.push(financialYearId);
    }

    query += ' ORDER BY sr.return_date DESC, sr.id DESC';

    const [returns] = await db.query(query, params);

    if (returns.length === 0) {
        return [];
    }

    const returnIds = returns.map(r => r.id);

    // Fetch items for all returns
    const [items] = await db.query(
        `SELECT * FROM sales_return_items WHERE sales_return_id IN (?) ORDER BY id ASC`,
        [returnIds]
    );

    const itemsMap = {};
    items.forEach(item => {
        if (!itemsMap[item.sales_return_id]) {
            itemsMap[item.sales_return_id] = [];
        }
        itemsMap[item.sales_return_id].push({
            id: item.id,
            product_id: item.product_id,
            product_name: item.product_name,
            productName: item.product_name,
            hsn_code: item.hsn_code,
            quantity: Number(item.quantity),
            rate: Number(item.rate),
            discount: Number(item.discount),
            tax_rate: Number(item.tax_rate),
            tax_amount: Number(item.tax_amount),
            total_amount: Number(item.total_amount)
        });
    });

    return returns.map(r => ({
        id: r.id,
        return_number: r.return_number,
        credit_note_number: r.return_number,
        invoice_number: r.invoice_number,
        customer_id: r.customer_id,
        customer_name: r.customer_name || r.linked_customer_name || 'N/A',
        customer_phone: r.customer_phone || r.linked_customer_phone || '',
        customer_gstin: r.customer_gstin || r.linked_customer_gstin || '',
        customer_state: r.customer_state || 'Maharashtra',
        return_date: r.return_date,
        reason: r.reason,
        refund_status: r.refund_status,
        payment_method: r.payment_method,
        subtotal: Number(r.subtotal),
        tax_amount: Number(r.tax_amount),
        total_amount: Number(r.total_amount),
        notes: r.notes || '',
        created_at: r.created_at,
        updated_at: r.updated_at,
        items: itemsMap[r.id] || []
    }));
};

// Get Sales Return By ID
const getSalesReturnById = async (id, userId) => {
    const db = getDB();
    const [rows] = await db.query(
        `SELECT sr.*, c.customer_name AS linked_customer_name, c.phone AS linked_customer_phone, c.gstin AS linked_customer_gstin
         FROM sales_returns sr
         LEFT JOIN customers c ON sr.customer_id = c.id
         WHERE sr.id = ? AND sr.user_id = ?`,
        [id, userId]
    );

    if (rows.length === 0) return null;

    const r = rows[0];

    const [items] = await db.query(
        `SELECT * FROM sales_return_items WHERE sales_return_id = ? ORDER BY id ASC`,
        [id]
    );

    const formattedItems = items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product_name,
        productName: item.product_name,
        batch_no: item.batch_no || null,
        hsn_code: item.hsn_code,
        quantity: Number(item.quantity),
        rate: Number(item.rate),
        discount: Number(item.discount),
        tax_rate: Number(item.tax_rate),
        tax_amount: Number(item.tax_amount),
        total_amount: Number(item.total_amount)
    }));

    return {
        id: r.id,
        return_number: r.return_number,
        credit_note_number: r.return_number,
        invoice_number: r.invoice_number,
        customer_id: r.customer_id,
        customer_name: r.customer_name || r.linked_customer_name || 'N/A',
        customer_phone: r.customer_phone || r.linked_customer_phone || '',
        customer_gstin: r.customer_gstin || r.linked_customer_gstin || '',
        customer_state: r.customer_state || 'Maharashtra',
        return_date: r.return_date,
        reason: r.reason,
        refund_status: r.refund_status,
        payment_method: r.payment_method,
        subtotal: Number(r.subtotal),
        tax_amount: Number(r.tax_amount),
        total_amount: Number(r.total_amount),
        notes: r.notes || '',
        created_at: r.created_at,
        updated_at: r.updated_at,
        items: formattedItems
    };
};

// Delete Sales Return (by ID or return_number)
const deleteSalesReturn = async (identifier, userId, extraReturnNo = null) => {
    const db = getDB();
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Locate record by ID or return_number
        const numVal = Number(identifier);
        const isNumeric = !isNaN(numVal) && String(identifier).trim() !== '' && !String(identifier).includes('-') && numVal > 0 && numVal <= 2147483647;
        let returnRows = [];
        if (isNumeric) {
            const [rows] = await connection.query(
                `SELECT id, return_number, invoice_number, refund_status, total_amount, financial_year_id FROM sales_returns WHERE (id = ? OR return_number = ?) AND user_id = ?`,
                [numVal, String(identifier), userId]
            );
            returnRows = rows;
        }

        if (returnRows.length === 0) {
            const searchNo = extraReturnNo || String(identifier);
            const [rows] = await connection.query(
                `SELECT id, return_number, invoice_number, refund_status, total_amount, financial_year_id FROM sales_returns WHERE return_number = ? AND user_id = ?`,
                [searchNo, userId]
            );
            returnRows = rows;
        }

        // Fallback: If not found with user_id constraint, search by ID or return_number directly
        if (returnRows.length === 0) {
            if (isNumeric) {
                const [rows] = await connection.query(
                    `SELECT id, return_number, invoice_number, refund_status, total_amount, financial_year_id FROM sales_returns WHERE (id = ? OR return_number = ?)`,
                    [numVal, String(identifier)]
                );
                returnRows = rows;
            }
            if (returnRows.length === 0) {
                const searchNo = extraReturnNo || String(identifier);
                const [rows] = await connection.query(
                    `SELECT id, return_number, invoice_number, refund_status, total_amount, financial_year_id FROM sales_returns WHERE return_number = ?`,
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
        const retNo = returnRows[0].return_number || `CN-${realId}`;
        const fyId = returnRows[0].financial_year_id || null;

        // 2. Fetch items to reverse stock and log audit entry safely
        try {
            const [items] = await connection.query(
                `SELECT product_id, quantity, batch_no FROM sales_return_items WHERE sales_return_id = ?`,
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
                                const stockAfter = Math.max(0, stockBefore - qty);

                                // Revert physical product stock
                                await connection.query(
                                    `UPDATE products SET opening_stock = ? WHERE id = ?`,
                                    [stockAfter, item.product_id]
                                );

                                if (item.batch_no) {
                                    try {
                                        await connection.query(
                                            'UPDATE product_batches SET quantity = GREATEST(0, quantity - ?) WHERE LOWER(TRIM(batch_no)) = LOWER(TRIM(?)) AND product_id = ? AND business_id = ?',
                                            [qty, item.batch_no, item.product_id, userId]
                                        );
                                    } catch (bErr) {
                                        console.warn('Batch stock reversal notice:', bErr.message);
                                    }
                                }

                                // Insert audit transaction log
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
                                        ) VALUES (?, ?, ?, 'STOCK_ADJUSTMENT', 'SALES_RETURN', ?, ?, ?, ?, ?)`,
                                        [
                                            userId,
                                            fyId,
                                            item.product_id,
                                            realId,
                                            -qty,
                                            stockBefore,
                                            stockAfter,
                                            `Credit Note ${retNo} deleted - Stock Reversed (-${qty})`
                                        ]
                                    );
                                } catch (invErr) {
                                    console.warn('Inventory audit reversal log notice:', invErr.message);
                                }
                            }
                        } catch (prodErr) {
                            console.warn('Stock update notice during deletion:', prodErr.message);
                        }
                    }
                }
            }
        } catch (itemFetchErr) {
            console.warn('Item fetch notice during deletion:', itemFetchErr.message);
        }

        // 3. Revert invoice balance if this credit note had adjusted it
        const invNo = returnRows[0].invoice_number;
        const refStatus = returnRows[0].refund_status;
        const retTotal = Number(returnRows[0].total_amount || 0);
        if (invNo && (refStatus === 'Store Credit' || refStatus === 'Adjusted in Credit Note')) {
            try {
                const [saleRows] = await connection.query(
                    `SELECT id, total_amount, paid_amount, balance_amount FROM sales WHERE invoice_number = ? AND user_id = ? FOR UPDATE`,
                    [invNo, userId]
                );
                if (saleRows.length > 0) {
                    const sale = saleRows[0];
                    const currentBal = Number(sale.balance_amount || 0);
                    const maxBal = Math.max(0, Number(sale.total_amount || 0) - Number(sale.paid_amount || 0));
                    const restoredBal = Math.min(maxBal, currentBal + retTotal);
                    const restoredStatus = restoredBal <= 0 ? 'Paid' : (Number(sale.paid_amount || 0) > 0 ? 'Partial' : 'Pending');
                    await connection.query(
                        `UPDATE sales SET balance_amount = ?, payment_status = ? WHERE id = ?`,
                        [restoredBal, restoredStatus, sale.id]
                    );
                }
            } catch (invRestoreErr) {
                console.warn('Invoice balance restoration notice on delete:', invRestoreErr.message);
            }
        }

        // 4. Delete return line items & master record from database
        await connection.query(`DELETE FROM sales_return_items WHERE sales_return_id = ?`, [realId]);
        const [result] = await connection.query(`DELETE FROM sales_returns WHERE id = ?`, [realId]);

        await connection.commit();
        return true;

    } catch (error) {
        await connection.rollback();
        console.error('deleteSalesReturn error:', error.message);
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    checkCreditNoteExists,
    getNextCreditNoteNumber,
    createSalesReturn,
    getSalesReturns,
    getSalesReturnById,
    deleteSalesReturn
};
