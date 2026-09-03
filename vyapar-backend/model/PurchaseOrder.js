const { getDB } = require('../database/db');
const Product = require('./Product');

// GET PURCHASE ORDER SEQUENCE
exports.getSequence = async (connection, userId) => {
    const [rows] = await connection.query(
        `SELECT last_number
         FROM purchase_order_sequences
         WHERE user_id = ?
         FOR UPDATE`,
        [userId]
    );
    return rows;
};

// CREATE PURCHASE ORDER SEQUENCE
exports.createSequence = async (connection, userId, number) => {
    await connection.query(
        `INSERT INTO purchase_order_sequences (user_id, last_number)
         VALUES (?, ?)`,
        [userId, number]
    );
};

// UPDATE PURCHASE ORDER SEQUENCE
exports.updateSequence = async (connection, userId, number) => {
    await connection.query(
        `UPDATE purchase_order_sequences
         SET last_number = ?
         WHERE user_id = ?`,
        [number, userId]
    );
};

// ENSURE USER EXISTS
exports.ensureUser = async (connection, userId) => {
    if (!userId) {
        return 1;
    }

    const [users] = await connection.query(
        'SELECT id FROM users WHERE id = ? LIMIT 1',
        [userId]
    );

    if (users.length > 0) {
        return users[0].id;
    }

    const [firstUser] = await connection.query(
        'SELECT id FROM users LIMIT 1'
    );
    if (firstUser.length > 0) {
        return firstUser[0].id;
    }

    return 1;
};

// ENSURE SUPPLIER EXISTS
exports.ensureSupplier = async (connection, supplierId, userId) => {
    const validUserId = userId || 1;

    if (supplierId) {
        const [suppliers] = await connection.query(
            `SELECT id FROM suppliers WHERE id = ? AND user_id = ? LIMIT 1`,
            [supplierId, validUserId]
        );

        if (suppliers.length > 0) {
            return suppliers[0].id;
        }

        const [anySupplier] = await connection.query(
            `SELECT id FROM suppliers WHERE id = ? LIMIT 1`,
            [supplierId]
        );
        if (anySupplier.length > 0) {
            return anySupplier[0].id;
        }
    }

    const [userSuppliers] = await connection.query(
        `SELECT id FROM suppliers WHERE user_id = ? LIMIT 1`,
        [validUserId]
    );
    if (userSuppliers.length > 0) {
        return userSuppliers[0].id;
    }

    const [firstSupplier] = await connection.query(
        `SELECT id FROM suppliers LIMIT 1`
    );
    if (firstSupplier.length > 0) {
        return firstSupplier[0].id;
    }

    const [created] = await connection.query(
        `INSERT INTO suppliers (user_id, supplier_name, address, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?)`,
        [validUserId, 'Default Supplier', 'N/A', 'N/A', 'N/A', '000000']
    );
    return created.insertId;
};

// ENSURE PRODUCT EXISTS
exports.ensureProduct = async (connection, itemOrId, userId) => {
    const validUserId = userId || 1;
    if (itemOrId && typeof itemOrId === 'object') {
        return await Product.resolveOrCreateProduct(connection, itemOrId, validUserId);
    }
    return await Product.resolveOrCreateProduct(connection, { product_id: itemOrId }, validUserId);
};

// CHECK SUPPLIER
exports.checkSupplier = async (connection, supplierId, userId) => {
    const [rows] = await connection.query(
        `SELECT id
         FROM suppliers
         WHERE id = ? AND user_id = ?`,
        [supplierId, userId]
    );
    return rows;
};

// CREATE PURCHASE ORDER
exports.createPurchaseOrder = async (connection, data) => {
    const {
        userId,
        supplierId,
        purchaseOrderNo,
        poDate,
        subtotal,
        discount,
        taxAmount,
        totalAmount,
        status,
        notes,
        documentName,
        documentType,
        documentData
    } = data;

    const [result] = await connection.query(
        `INSERT INTO purchase_orders (
            user_id,
            supplier_id,
            purchase_order_no,
            po_date,
            subtotal,
            discount,
            tax_amount,
            total_amount,
            status,
            notes,
            document_name,
            document_type,
            document_data
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            userId,
            supplierId,
            purchaseOrderNo,
            poDate,
            subtotal || 0,
            discount || 0,
            taxAmount || 0,
            totalAmount || 0,
            status || ' Pending',
            notes || null,
            documentName || null,
            documentType || null,
            documentData || null
        ]
    );

    return result.insertId;
};

// CREATE PURCHASE ORDER ITEM
exports.createPurchaseOrderItem = async (connection, data) => {
    const {
        purchaseOrderId,
        productId,
        quantity,
        purchasePrice,
        discount,
        taxRate,
        taxAmount,
        totalAmount
    } = data;

    const [result] = await connection.query(
        `INSERT INTO purchase_order_items (
            purchase_order_id,
            product_id,
            quantity,
            purchase_price,
            discount,
            tax_rate,
            tax_amount,
            total_amount,
            received_quantity
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            purchaseOrderId,
            productId,
            quantity,
            purchasePrice,
            discount || 0,
            taxRate || 0,
            taxAmount || 0,
            totalAmount || 0,
            0
        ]
    );

    return result.insertId;
};



exports.getPurchaseOrders = async (connection, userId) => {
    const [rows] = await connection.query(
        `SELECT
        po.id AS poid,
        po.user_id,
        po.supplier_id,
        s.supplier_name AS supplier_name,

        po.purchase_order_no,
        po.po_date,
        po.subtotal,
        po.discount,
        po.tax_amount,
        po.total_amount,
        po.status,
        po.notes,

        po.document_name,
        po.document_type,
        po.document_data,
        po.created_at,
        po.updated_at,

        poi.id AS item_id,
        poi.purchase_order_id,
        poi.product_id,
        pr.product_name AS product_name,

        poi.quantity,
        poi.purchase_price,
        poi.discount AS item_discount,
        poi.tax_rate AS item_tax_rate,
        poi.tax_amount AS item_tax_amount,
        poi.total_amount AS item_total_amount,
        poi.received_quantity,
        poi.created_at AS item_created_date
        
        FROM purchase_orders po
        
        LEFT JOIN suppliers s ON po.supplier_id = s.id
        LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
        LEFT JOIN products pr ON poi.product_id = pr.id
        WHERE po.user_id = ?
        ORDER BY po.id DESC, poi.id ASC`,
        [userId]
    );

    const purchaseOrdersMap = {};
    for (const row of rows) {
        if (!purchaseOrdersMap[row.poid]) {
            purchaseOrdersMap[row.poid] = {
                poid: row.poid,
                user_id: row.user_id,
                supplier_id: row.supplier_id,
                supplier_name: row.supplier_name,
                purchase_order_no: row.purchase_order_no,
                po_date: row.po_date,
                subtotal: row.subtotal,
                discount: row.discount,
                tax_amount: row.tax_amount,
                total_amount: row.total_amount,
                status: row.status,
                notes: row.notes,
                document_name: row.document_name,
                document_type: row.document_type,
                document_data: row.document_data ? (Buffer.isBuffer(row.document_data) ? row.document_data.toString('base64') : String(row.document_data)) : null,
                created_at: row.created_at,
                updated_at: row.updated_at,
                items: []
            };
        }

        if (row.item_id) {
            purchaseOrdersMap[row.poid].items.push({
                item_id: row.item_id,
                purchase_order_id: row.purchase_order_id,
                product_id: row.product_id,
                product_name: row.product_name,
                quantity: row.quantity,
                purchase_price: row.purchase_price,
                item_discount: row.item_discount,
                item_tax_rate: row.item_tax_rate,
                item_tax_amount: row.item_tax_amount,
                item_total_amount: row.item_total_amount,
                received_quantity: row.received_quantity,
                item_created_date: row.item_created_date
            });
        }
    }

    return Object.values(purchaseOrdersMap);
};

exports.getPurchaseOrderById = async (connection, purchaseOrderId, userId) => {
    const [rows] = await connection.query(
        `SELECT
        po.id AS poid,
        po.user_id,
        po.supplier_id,
        s.supplier_name AS supplier_name,

        po.purchase_order_no,
        po.po_date,
        po.subtotal,
        po.discount,
        po.tax_amount,
        po.total_amount,
        po.status,
        po.notes,

        po.document_name,
        po.document_type,
        po.document_data,
        po.created_at,
        po.updated_at,

        poi.id AS item_id,
        poi.purchase_order_id,
        poi.product_id,
        pr.product_name AS product_name,

        poi.quantity,
        poi.purchase_price,
        poi.discount AS item_discount,
        poi.tax_rate AS item_tax_rate,
        poi.tax_amount AS item_tax_amount,
        poi.total_amount AS item_total_amount,
        poi.received_quantity,
        poi.created_at AS item_created_date
        
        FROM purchase_orders po
        
        LEFT JOIN suppliers s ON po.supplier_id = s.id
        LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
        LEFT JOIN products pr ON poi.product_id = pr.id
        WHERE po.id = ? AND po.user_id = ?
        ORDER BY poi.id ASC`,
        [purchaseOrderId, userId]
    );

    if (rows.length === 0) {
        return null;
    }

    const purchaseOrder = {
        poid: rows[0].poid,
        user_id: rows[0].user_id,
        supplier_id: rows[0].supplier_id,
        supplier_name: rows[0].supplier_name,
        purchase_order_no: rows[0].purchase_order_no,
        po_date: rows[0].po_date,
        subtotal: rows[0].subtotal,
        discount: rows[0].discount,
        tax_amount: rows[0].tax_amount,
        total_amount: rows[0].total_amount,
        status: rows[0].status,
        notes: rows[0].notes,
        document_name: rows[0].document_name,
        document_type: rows[0].document_type,
        document_data: rows[0].document_data ? rows[0].document_data.toString('base64') : null,
        created_at: rows[0].created_at,
        updated_at: rows[0].updated_at,
        items: []
    };

    for (const row of rows) {
        if (row.item_id) {
            purchaseOrder.items.push({
                item_id: row.item_id,
                purchase_order_id: row.purchase_order_id,
                product_id: row.product_id,
                product_name: row.product_name,
                quantity: row.quantity,
                purchase_price: row.purchase_price,
                item_discount: row.item_discount,
                item_tax_rate: row.item_tax_rate,
                item_tax_amount: row.item_tax_amount,
                item_total_amount: row.item_total_amount,
                received_quantity: row.received_quantity,
                item_created_date: row.item_created_date
            });
        }
    }

    return purchaseOrder;
};

exports.updatePurchaseOrder = async (
    connection,
    purchaseOrderId,
    userId,
    poData,
    items
) => {
    const {
        supplierId,
        poDate,
        subtotal,
        discount,
        taxAmount,
        totalAmount,
        status,
        notes,
        documentName,
        documentType,
        documentData,
        hasNewDocument
    } = poData;

    // =====================================================
    // 1. GET EXISTING PURCHASE ORDER
    // =====================================================

    const [existingPO] = await connection.query(
        `
        SELECT
            id,
            user_id,
            supplier_id,
            purchase_order_no,
            status
        FROM purchase_orders
        WHERE id = ?
          AND user_id = ?
        FOR UPDATE
        `,
        [purchaseOrderId, userId]
    );

    if (existingPO.length === 0) {
        throw new Error('Purchase order not found');
    }

    const oldStatus = (existingPO[0].status || '').trim();

    if (oldStatus === 'Received') {
        throw new Error('Purchase order with Received status cannot be updated or modified.');
    }

    if (oldStatus === 'Cancelled') {
        throw new Error('Purchase order with Cancelled status cannot be updated or modified.');
    }

    // If status is not provided, keep the existing status
    const newStatus = status ? String(status).trim() : oldStatus;

    // =====================================================
    // 2. UPDATE PURCHASE ORDER
    // =====================================================

    let updateSql = `
        UPDATE purchase_orders
        SET supplier_id = ?,
            po_date = ?,
            subtotal = ?,
            discount = ?,
            tax_amount = ?,
            total_amount = ?,
            status = ?,
            notes = ?
    `;

    let queryParams = [
        supplierId,
        poDate,
        subtotal || 0,
        discount || 0,
        taxAmount || 0,
        totalAmount || 0,
        newStatus,
        notes || null
    ];

    // Update document only if a new document was uploaded
    if (hasNewDocument) {
        updateSql += `
            , document_name = ?
            , document_type = ?
            , document_data = ?
        `;

        queryParams.push(
            documentName || null,
            documentType || null,
            documentData || null
        );
    }

    updateSql += `
        WHERE id = ?
          AND user_id = ?
    `;

    queryParams.push(
        purchaseOrderId,
        userId
    );

    const [result] = await connection.query(
        updateSql,
        queryParams
    );

    if (result.affectedRows === 0) {
        throw new Error('Purchase order not found');
    }

    // =====================================================
    // 3. REPLACE PURCHASE ORDER ITEMS
    // =====================================================

    await connection.query(
        `
        DELETE FROM purchase_order_items
        WHERE purchase_order_id = ?
        `,
        [purchaseOrderId]
    );

    for (const item of items) {

        const validProductId =
            await exports.ensureProduct(
                connection,
                item,
                userId
            );

        const quantity = Number(item.quantity);

        const purchasePrice =
            Number(item.purchase_price);

        const itemDiscount =
            Number(
                item.discount ||
                item.item_discount ||
                0
            );

        const taxRate =
            Number(
                item.tax_rate ||
                item.item_tax_rate ||
                0
            );

        const amount =
            quantity * purchasePrice;

        const taxableAmount =
            amount - itemDiscount;

        const itemTaxAmount =
            item.tax_amount !== undefined &&
            item.tax_amount !== null
                ? Number(item.tax_amount)
                : item.item_tax_amount !== undefined &&
                  item.item_tax_amount !== null
                    ? Number(item.item_tax_amount)
                    : (taxableAmount * taxRate) / 100;

        const itemTotal =
            item.total_amount !== undefined &&
            item.total_amount !== null
                ? Number(item.total_amount)
                : item.item_total_amount !== undefined &&
                  item.item_total_amount !== null
                    ? Number(item.item_total_amount)
                    : taxableAmount + itemTaxAmount;

        const receivedQuantity =
            Number(item.received_quantity || 0);

        await connection.query(
            `
            INSERT INTO purchase_order_items (
                purchase_order_id,
                product_id,
                quantity,
                purchase_price,
                discount,
                tax_rate,
                tax_amount,
                total_amount,
                received_quantity
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                purchaseOrderId,
                validProductId,
                quantity,
                purchasePrice,
                itemDiscount,
                taxRate,
                itemTaxAmount,
                itemTotal,
                receivedQuantity
            ]
        );
    }

    // =====================================================
    // 4. PENDING → RECEIVED
    // =====================================================

    let purchaseId = null;

    if (
        oldStatus === 'Pending' &&
        newStatus === 'Received'
    ) {

        // -------------------------------------------------
        // 4.1 Check if Purchase already exists
        // -------------------------------------------------

        const [existingPurchase] =
            await connection.query(
                `
                SELECT id
                FROM purchases
                WHERE purchase_order_id = ?
                  AND user_id = ?
                LIMIT 1
                `,
                [
                    purchaseOrderId,
                    userId
                ]
            );

        if (existingPurchase.length > 0) {
            throw new Error(
                'Purchase already exists for this purchase order'
            );
        }

        // -------------------------------------------------
        // 4.2 Create Purchase
        // -------------------------------------------------

        const poNo = existingPO[0].purchase_order_no || `PO-${purchaseOrderId}`;
        const invNo = `INV-${poNo}`;

        const [purchaseResult] =
            await connection.query(
                `
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
                `,
                [
                    userId,
                    supplierId,
                    purchaseOrderId,
                    invNo,
                    poDate,
                    subtotal || 0,
                    discount || 0,
                    taxAmount || 0,
                    totalAmount || 0,
                    'Pending',
                    'Credit',
                    notes || null
                ]
            );

        purchaseId =
            purchaseResult.insertId;

        // -------------------------------------------------
        // 4.3 Create Purchase Items
        // -------------------------------------------------

        for (const item of items) {

            const validProductId =
                await exports.ensureProduct(
                    connection,
                    item.product_id,
                    userId
                );

            const quantity =
                Number(item.quantity);

            const purchasePrice =
                Number(item.purchase_price);

            const itemDiscount =
                Number(
                    item.discount ||
                    item.item_discount ||
                    0
                );

            const taxRate =
                Number(
                    item.tax_rate ||
                    item.item_tax_rate ||
                    0
                );

            const amount =
                quantity * purchasePrice;

            const taxableAmount =
                amount - itemDiscount;

            const itemTaxAmount =
                item.tax_amount !== undefined &&
                item.tax_amount !== null
                    ? Number(item.tax_amount)
                    : item.item_tax_amount !== undefined &&
                      item.item_tax_amount !== null
                        ? Number(item.item_tax_amount)
                        : (taxableAmount * taxRate) / 100;

            const itemTotal =
                item.total_amount !== undefined &&
                item.total_amount !== null
                    ? Number(item.total_amount)
                    : item.item_total_amount !== undefined &&
                      item.item_total_amount !== null
                        ? Number(item.item_total_amount)
                        : taxableAmount + itemTaxAmount;

            await connection.query(
                `
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
                `,
                [
                    purchaseId,
                    validProductId,
                    quantity,
                    purchasePrice,
                    itemDiscount,
                    taxRate,
                    itemTaxAmount,
                    itemTotal
                ]
            );

            // -------------------------------------------------
            // 4.4 PRODUCT VALIDATION COMPLETE
            // -------------------------------------------------
        }
    }

    // Return useful information to controller
    return {
        success: true,
        purchaseOrderId,
        oldStatus,
        newStatus,
        purchaseId
    };
};

// DELETE PURCHASE ORDER
exports.deletePurchaseOrder = async (connection, purchaseOrderId, userId) => {
    // 1. Check if Purchase Order exists and belongs to user
    const [existingRows] = await connection.query(
        `SELECT id, status FROM purchase_orders WHERE id = ? AND user_id = ? FOR UPDATE`,
        [purchaseOrderId, userId]
    );

    if (existingRows.length === 0) {
        throw new Error('Purchase order not found');
    }

    const poStatus = (existingRows[0].status || '').trim();

    if (poStatus === 'Received') {
        throw new Error('Purchase order with Received status cannot be deleted.');
    }

    if (poStatus === 'Cancelled') {
        throw new Error('Purchase order with Cancelled status cannot be deleted.');
    }

    // 2. Check if a linked purchase invoice exists
    const [existingPurchase] = await connection.query(
        `SELECT id FROM purchases WHERE purchase_order_id = ? AND user_id = ? LIMIT 1`,
        [purchaseOrderId, userId]
    );

    if (existingPurchase.length > 0) {
        throw new Error('Cannot delete purchase order because a linked purchase invoice exists. Delete the purchase invoice first.');
    }

    // 3. Delete items from purchase_order_items
    await connection.query(
        `DELETE FROM purchase_order_items WHERE purchase_order_id = ?`,
        [purchaseOrderId]
    );

    // 4. Delete purchase order header
    const [result] = await connection.query(
        `DELETE FROM purchase_orders WHERE id = ? AND user_id = ?`,
        [purchaseOrderId, userId]
    );

    return result;
};


