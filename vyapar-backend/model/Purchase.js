const { getDB } = require('../database/db');
const Product = require('./Product');

//POST
const ensureSupplier = async (connection, supplierId, userId) => {
    const [suppliers] = await connection.query(
        'SELECT id FROM suppliers WHERE id = ? AND user_id = ?',
        [supplierId, userId]
    );
    if (suppliers.length > 0) {
        return suppliers[0].id;
    }
    const [userSuppliers] = await connection.query(
        'SELECT id FROM suppliers WHERE user_id = ? LIMIT 1',
        [userId]
    );
    if (userSuppliers.length > 0) {
        return userSuppliers[0].id;
    }
    const [result] = await connection.query(
        'INSERT INTO suppliers (user_id, supplier_name, address, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, 'Default Supplier', 'N/A', 'N/A', 'N/A', '000000']
    );
    return result.insertId;
};

const ensureProduct = async (connection, itemOrId, userId) => {
    if (itemOrId && typeof itemOrId === 'object') {
        return await Product.resolveOrCreateProduct(connection, itemOrId, userId);
    }
    return await Product.resolveOrCreateProduct(connection, { product_id: itemOrId }, userId);
};

// Create a new purchase invoice with items and update stock (using Transaction)
const createPurchase = async (purchaseData, items = []) => {
    const db = getDB();
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const validSupplierId = await ensureSupplier(
            connection,
            purchaseData.supplier_id,
            purchaseData.user_id
        );

        if (purchaseData.purchase_order_id) {
            const [poRows] = await connection.query(
                'SELECT id, status FROM purchase_orders WHERE id = ? AND user_id = ? FOR UPDATE',
                [purchaseData.purchase_order_id, purchaseData.user_id]
            );

            if (poRows.length === 0) {
                throw new Error('Linked purchase order not found');
            }

            const poStatus = (poRows[0].status || '').trim();

            if (poStatus === 'Received') {
                throw new Error('Purchase order has already been received');
            }

            if (poStatus === 'Cancelled') {
                throw new Error('Purchase order has been cancelled and cannot be converted to a purchase');
            }

            await connection.query(
                'UPDATE purchase_orders SET status = ? WHERE id = ? AND user_id = ?',
                ['Received', purchaseData.purchase_order_id, purchaseData.user_id]
            );
        }

        // 1. Insert into purchases table
        const purchaseSql = `
            INSERT INTO purchases (
                user_id,
                supplier_id,
                purchase_order_id,
                invoice_number,
                purchase_date,
                subtotal,
                discount,
                tax_amount,
                total_amount,
                payment_status,
                payment_method,
                notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const purchaseValues = [
            purchaseData.user_id,
            validSupplierId,
            purchaseData.purchase_order_id || null,
            purchaseData.invoice_number,
            purchaseData.purchase_date,
            purchaseData.subtotal || 0.00,
            purchaseData.discount || 0.00,
            purchaseData.tax_amount || 0.00,
            purchaseData.total_amount || 0.00,
            purchaseData.payment_status || 'Pending',
            purchaseData.payment_method || 'Credit',
            purchaseData.notes || null
        ];

        const [purchaseResult] = await connection.query(purchaseSql, purchaseValues);
        const purchaseId = purchaseResult.insertId;

        // 2. Insert items & update product stock
        if (Array.isArray(items) && items.length > 0) {
            const itemSql = `
                INSERT INTO purchase_items (
                    purchase_id,
                    product_id,
                    quantity,
                    purchase_price,
                    discount,
                    tax_rate,
                    tax_amount,
                    total_amount
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const updateStockSql = `
                UPDATE products
                SET current_stock = current_stock + ?,
                    purchase_price = CASE WHEN purchase_price = 0 THEN ? ELSE purchase_price END
                WHERE id = ? AND business_id = ?
            `;

            for (const item of items) {
                const validProductId = await ensureProduct(
                    connection,
                    item,
                    purchaseData.user_id
                );

                const itemQty = Number(item.quantity || item.qty || 0);
                const itemPrice = Number(item.purchase_price ?? item.rate ?? 0);

                const itemValues = [
                    purchaseId,
                    validProductId,
                    itemQty,
                    itemPrice,
                    Number(item.discount || 0),
                    Number(item.tax_rate || item.gst_percent || 0),
                    Number(item.tax_amount || 0),
                    Number(item.total_amount || 0)
                ];

                await connection.query(itemSql, itemValues);

                // Increment product stock
                await connection.query(updateStockSql, [
                    itemQty,
                    itemPrice,
                    validProductId,
                    purchaseData.user_id
                ]);
            }
        }

        await connection.commit();
        connection.release();

        return purchaseId;
    } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
    }
};


// Check if invoice number exists for user
const checkInvoiceExists = async (invoiceNumber, userId) => {
    const db = getDB();
    const [rows] = await db.query(
        'SELECT id FROM purchases WHERE invoice_number = ? AND user_id = ?',
        [invoiceNumber, userId]
    );
    return rows.length > 0;
};

//GET
const getPurchases = async (userId) => {
    const db = getDB();
    const [rows] = await db.query(
        `
        SELECT
            p.id,
            p.user_id,
            p.supplier_id,
            p.purchase_order_id,
            po.purchase_order_no,
            s.supplier_name,
            s.phone AS supplier_phone,
            s.email AS supplier_email,
            s.gstin AS supplier_gstin,
            s.address AS supplier_address,
            p.invoice_number,
            p.purchase_date,
            p.subtotal,
            p.discount,
            p.tax_amount,
            p.total_amount,
            p.payment_status,
            p.payment_method,
            p.notes,
            p.created_at,
            p.updated_at,

            pi.id AS item_id,
            pi.purchase_id,
            pi.product_id,
            pr.product_name,
            pr.sku AS product_sku,
            pr.unit AS product_unit,
            pr.hsn_code AS product_hsn_code,
            pi.quantity,
            pi.purchase_price,
            pi.discount AS item_discount,
            pi.tax_rate,
            pi.tax_amount AS item_tax_amount,
            pi.total_amount AS item_total_amount,
            pi.created_at AS item_created_at

        FROM purchases p
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        LEFT JOIN purchase_orders po ON p.purchase_order_id = po.id
        LEFT JOIN purchase_items pi ON p.id = pi.purchase_id
        LEFT JOIN products pr ON pi.product_id = pr.id
        WHERE p.user_id = ?
        ORDER BY p.id DESC, pi.id ASC
        `,
        [userId]
    );

    const purchases = {};

    rows.forEach(row => {
        if (!purchases[row.id]) {
            purchases[row.id] = {
                id: row.id,
                user_id: row.user_id,
                supplier_id: row.supplier_id,
                purchase_order_id: row.purchase_order_id || null,
                purchase_order_no: row.purchase_order_no || null,
                supplier_name: row.supplier_name || null,
                supplier_phone: row.supplier_phone || null,
                supplier_email: row.supplier_email || null,
                supplier_gstin: row.supplier_gstin || null,
                supplier_address: row.supplier_address || null,
                invoice_number: row.invoice_number,
                purchase_date: row.purchase_date,
                subtotal: Number(row.subtotal) || 0,
                discount: Number(row.discount) || 0,
                tax_amount: Number(row.tax_amount) || 0,
                total_amount: Number(row.total_amount) || 0,
                payment_status: row.payment_status,
                payment_method: row.payment_method,
                notes: row.notes,
                created_at: row.created_at,
                updated_at: row.updated_at,
                items: []
            };
        }

        if (row.item_id) {
            purchases[row.id].items.push({
                id: row.item_id,
                product_id: row.product_id,
                product_name: row.product_name || null,
                product_sku: row.product_sku || null,
                product_unit: row.product_unit || null,
                product_hsn_code: row.product_hsn_code || null,
                quantity: Number(row.quantity) || 0,
                purchase_price: Number(row.purchase_price) || 0,
                discount: Number(row.item_discount) || 0,
                tax_rate: Number(row.tax_rate) || 0,
                tax_amount: Number(row.item_tax_amount) || 0,
                total_amount: Number(row.item_total_amount) || 0
            });
        }
    });

    return Object.values(purchases);
};

const deletePurchase = async (purchaseId, userId) => {
    const db = getDB();
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Check if purchase exists and belongs to user
        const [purchases] = await connection.query(
            'SELECT id FROM purchases WHERE id = ? AND user_id = ?',
            [purchaseId, userId]
        );

        if (purchases.length === 0) {
            await connection.rollback();
            connection.release();
            return { affectedRows: 0 };
        }

        // 2. Fetch purchase items to revert product stock
        const [items] = await connection.query(
            'SELECT product_id, quantity FROM purchase_items WHERE purchase_id = ?',
            [purchaseId]
        );

        // 3. Decrement product stock for each item
        for (const item of items) {
            await connection.query(
                `UPDATE products
                 SET current_stock = GREATEST(0, current_stock - ?)
                 WHERE id = ? AND business_id = ?`,
                [item.quantity || 0, item.product_id, userId]
            );
        }

        // 4. Delete purchase (purchase_items deleted via foreign key ON DELETE CASCADE)
        const [result] = await connection.query(
            'DELETE FROM purchases WHERE id = ? AND user_id = ?',
            [purchaseId, userId]
        );

        await connection.commit();
        connection.release();

        return result;
    } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
    }
};

const updatePurchase = async (purchaseId, userId, purchaseData, items) => {
    const db = getDB();
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Update purchase master
        const [purchaseResult] = await connection.query(
            `UPDATE purchases
             SET supplier_id = ?,
                 purchase_order_id = ?,
                 invoice_number = ?,
                 purchase_date = ?,
                 subtotal = ?,
                 discount = ?,
                 tax_amount = ?,
                 total_amount = ?,
                 payment_status = ?,
                 payment_method = ?,
                 notes = ?
             WHERE id = ? AND user_id = ?`,
            [
                purchaseData.supplier_id,
                purchaseData.purchase_order_id || null,
                purchaseData.invoice_number,
                purchaseData.purchase_date,
                purchaseData.subtotal,
                purchaseData.discount,
                purchaseData.tax_amount,
                purchaseData.total_amount,
                purchaseData.payment_status,
                purchaseData.payment_method,
                purchaseData.notes,
                purchaseId,
                userId
            ]
        );

        if (purchaseResult.affectedRows === 0) {
            throw new Error('Purchase not found');
        }

        // 2. Fetch old purchase items to revert product stock
        const [oldItems] = await connection.query(
            'SELECT product_id, quantity FROM purchase_items WHERE purchase_id = ?',
            [purchaseId]
        );
        for (const oldItem of oldItems) {
            await connection.query(
                `UPDATE products
                 SET current_stock = GREATEST(0, current_stock - ?)
                 WHERE id = ? AND business_id = ?`,
                [oldItem.quantity || 0, oldItem.product_id, userId]
            );
        }

        // 3. Delete old items
        await connection.query(
            `DELETE FROM purchase_items
             WHERE purchase_id = ?`,
            [purchaseId]
        );

        // 4. Insert updated items & update product stock
        for (const item of items) {
            const validProductId = await ensureProduct(
                connection,
                item,
                userId
            );

            const itemQty = Number(item.quantity || item.qty || 0);
            const itemPrice = Number(item.purchase_price ?? item.rate ?? 0);

            await connection.query(
                `INSERT INTO purchase_items
                (
                    purchase_id,
                    product_id,
                    quantity,
                    purchase_price,
                    tax_rate,
                    tax_amount,
                    total_amount
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    purchaseId,
                    validProductId,
                    itemQty,
                    itemPrice,
                    Number(item.tax_rate || item.gst_percent || 0),
                    Number(item.tax_amount || 0),
                    Number(item.total_amount || 0)
                ]
            );

            await connection.query(
                `UPDATE products
                 SET current_stock = current_stock + ?
                 WHERE id = ? AND business_id = ?`,
                [itemQty, validProductId, userId]
            );
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

const getPurchaseById = async (purchaseId, userId) => {
    const db = getDB();
    const [rows] = await db.query(
        `
        SELECT
            p.id,
            p.user_id,
            p.supplier_id,
            p.purchase_order_id,
            po.purchase_order_no,
            s.supplier_name,
            s.phone AS supplier_phone,
            s.email AS supplier_email,
            s.gstin AS supplier_gstin,
            s.address AS supplier_address,
            p.invoice_number,
            p.purchase_date,
            p.subtotal,
            p.discount,
            p.tax_amount,
            p.total_amount,
            p.payment_status,
            p.payment_method,
            p.notes,
            p.created_at,
            p.updated_at,

            pi.id AS item_id,
            pi.purchase_id,
            pi.product_id,
            pr.product_name,
            pr.sku AS product_sku,
            pr.unit AS product_unit,
            pr.hsn_code AS product_hsn_code,
            pi.quantity,
            pi.purchase_price,
            pi.discount AS item_discount,
            pi.tax_rate,
            pi.tax_amount AS item_tax_amount,
            pi.total_amount AS item_total_amount,
            pi.created_at AS item_created_at

        FROM purchases p
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        LEFT JOIN purchase_orders po ON p.purchase_order_id = po.id
        LEFT JOIN purchase_items pi ON p.id = pi.purchase_id
        LEFT JOIN products pr ON pi.product_id = pr.id
        WHERE p.id = ? AND p.user_id = ?
        ORDER BY pi.id ASC
        `,
        [purchaseId, userId]
    );

    if (rows.length === 0) {
        return null;
    }

    const purchase = {
        id: rows[0].id,
        user_id: rows[0].user_id,
        supplier_id: rows[0].supplier_id,
        purchase_order_id: rows[0].purchase_order_id || null,
        purchase_order_no: rows[0].purchase_order_no || null,
        supplier_name: rows[0].supplier_name || null,
        supplier_phone: rows[0].supplier_phone || null,
        supplier_email: rows[0].supplier_email || null,
        supplier_gstin: rows[0].supplier_gstin || null,
        supplier_address: rows[0].supplier_address || null,
        invoice_number: rows[0].invoice_number,
        purchase_date: rows[0].purchase_date,
        subtotal: Number(rows[0].subtotal) || 0,
        discount: Number(rows[0].discount) || 0,
        tax_amount: Number(rows[0].tax_amount) || 0,
        total_amount: Number(rows[0].total_amount) || 0,
        payment_status: rows[0].payment_status,
        payment_method: rows[0].payment_method,
        notes: rows[0].notes,
        created_at: rows[0].created_at,
        updated_at: rows[0].updated_at,
        items: []
    };

    rows.forEach(row => {
        if (row.item_id) {
            purchase.items.push({
                id: row.item_id,
                product_id: row.product_id,
                product_name: row.product_name || null,
                product_sku: row.product_sku || null,
                product_unit: row.product_unit || null,
                product_hsn_code: row.product_hsn_code || null,
                quantity: Number(row.quantity) || 0,
                purchase_price: Number(row.purchase_price) || 0,
                discount: Number(row.item_discount) || 0,
                tax_rate: Number(row.tax_rate) || 0,
                tax_amount: Number(row.item_tax_amount) || 0,
                total_amount: Number(row.item_total_amount) || 0
            });
        }
    });

    return purchase;
};



module.exports = {
    createPurchase,
    checkInvoiceExists,
    getPurchases,
    getPurchaseById,
    deletePurchase,
    updatePurchase,
};

