const { getDB } = require('../database/db');
const PurchaseOrder = require('../model/PurchaseOrder');

const getUserId = (req) => {
    return req.user.business_id || req.user.id;
};

exports.createPurchaseOrder = async (req, res) => {
    const db = getDB();
    const connection = await db.getConnection();

    try {
        const userId = getUserId(req);

        let {
            supplier_id,
            po_date,
            subtotal,
            discount,
            tax_amount,
            total_amount,
            status,
            notes,
            items
        } = req.body;

        // 1. VALIDATE REQUIRED FIELDS
        if (!supplier_id || !po_date) {
            return res.status(400).json({
                success: false,
                message: 'supplier_id and po_date are required'
            });
        }

        // 2. CONVERT ITEMS JSON STRING IF PASSED AS STRING (FOR MULTIPART/FORM-DATA)
        if (typeof items === 'string') {
            try {
                items = JSON.parse(items);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid items JSON format'
                });
            }
        }

        // 3. VALIDATE ITEMS
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one purchase order item is required'
            });
        }

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const hasNameOrId = item.product_id || item.productId || item.product_name || item.product || item.name;
            const hasQty = item.quantity !== undefined && item.quantity !== null && item.quantity !== '';
            const hasPrice = item.purchase_price !== undefined || item.rate !== undefined;

            if (!hasNameOrId || !hasQty || !hasPrice) {
                return res.status(400).json({
                    success: false,
                    message: `Item at index ${i} is missing product name/id, quantity, or purchase_price`
                });
            }
        }

        // 4. START TRANSACTION
        await connection.beginTransaction();

        // 5. ENSURE USER, SUPPLIER
        const validUserId = await PurchaseOrder.ensureUser(connection, userId);
        const validSupplierId = await PurchaseOrder.ensureSupplier(
            connection,
            supplier_id,
            validUserId
        );

        // 6. GET USER'S PO SEQUENCE
        const sequence = await PurchaseOrder.getSequence(
            connection,
            validUserId
        );

        let nextNumber;
        if (sequence.length === 0) {
            nextNumber = 1;
            await PurchaseOrder.createSequence(
                connection,
                validUserId,
                nextNumber
            );
        } else {
            nextNumber = sequence[0].last_number + 1;
            await PurchaseOrder.updateSequence(
                connection,
                validUserId,
                nextNumber
            );
        }

        // 7. GENERATE PO NUMBER
        const purchaseOrderNo = `PO-${String(nextNumber).padStart(4, '0')}`;

        // 8. CREATE PURCHASE ORDER
        const purchaseOrderId = await PurchaseOrder.createPurchaseOrder(
            connection,
            {
                userId: validUserId,
                supplierId: validSupplierId,
                purchaseOrderNo,
                poDate: po_date,
                subtotal: Number(subtotal || 0),
                discount: Number(discount || 0),
                taxAmount: Number(tax_amount || 0),
                totalAmount: Number(total_amount || 0),
                status: status ? String(status).trim() : 'Pending',
                notes: notes || null,
                documentName: req.file ? req.file.originalname : null,
                documentType: req.file ? req.file.mimetype : null,
                documentData: req.file ? req.file.buffer : null
            }
        );

        // 9. CREATE PURCHASE ORDER ITEMS
        for (const item of items) {
            const validProductId = await PurchaseOrder.ensureProduct(
                connection,
                item,
                validUserId
            );

            const quantity = Number(item.quantity || item.qty || 0);
            const purchasePrice = Number(item.purchase_price ?? item.rate ?? 0);
            const itemDiscount = Number(item.discount || 0);
            const taxRate = Number(item.tax_rate || item.gst_percent || 0);
            const amount = quantity * purchasePrice;
            const taxableAmount = amount - itemDiscount;
            const itemTaxAmount = (taxableAmount * taxRate) / 100;
            const itemTotal = taxableAmount + itemTaxAmount;

            await PurchaseOrder.createPurchaseOrderItem(
                connection,
                {
                    purchaseOrderId,
                    productId: validProductId,
                    quantity,
                    purchasePrice,
                    discount: itemDiscount,
                    taxRate,
                    taxAmount: itemTaxAmount,
                    totalAmount: itemTotal
                }
            );
        }

        // 10. COMMIT TRANSACTION
        await connection.commit();

        // 11. SUCCESS RESPONSE
        return res.status(201).json({
            success: true,
            message: 'Purchase order created successfully',
            data: {
                id: purchaseOrderId,
                purchase_order_no: purchaseOrderNo,
                supplier_id: supplier_id,
                po_date: po_date,
                subtotal: Number(subtotal || 0),
                discount: Number(discount || 0),
                tax_amount: Number(tax_amount || 0),
                total_amount: Number(total_amount || 0),
                status: status || 'Draft',
                notes: notes || null,
                document: req.file ? {
                    name: req.file.originalname,
                    type: req.file.mimetype
                } : null
            }
        });

    } catch (error) {
        await connection.rollback();
        console.error('Create Purchase Order Error:', error);

        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to create purchase order'
        });

    } finally {
        connection.release();
    }
};

exports.getPurchaseOrders = async (req, res) => {
    let connection;
    try {
        const db = getDB();
        connection = await db.getConnection();
        const userId = getUserId(req);
        const purchaseOrders = await PurchaseOrder.getPurchaseOrders(connection, userId);
        return res.status(200).json({
            success: true,
            count: purchaseOrders.length,
            data: purchaseOrders,
        });
    } catch (error) {
        console.error("Get purchase Orders error : ", error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error while fetching purchase orders'
        });
    } finally {
        if (connection) connection.release();
    }
};

exports.getPurchaseOrderById = async (req, res) => {
    let connection;
    try {
        const db = getDB();
        connection = await db.getConnection();
        const userId = getUserId(req);
        const purchaseOrderId = req.params.id;

        if (!purchaseOrderId) {
            return res.status(400).json({
                success: false,
                message: 'Purchase order ID is required'
            });
        }

        const purchaseOrder = await PurchaseOrder.getPurchaseOrderById(
            connection,
            purchaseOrderId,
            userId
        );

        if (!purchaseOrder) {
            return res.status(404).json({
                success: false,
                message: 'Purchase order not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: purchaseOrder
        });

    } catch (error) {
        console.error('Get Purchase Order By ID Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch purchase order'
        });
    } finally {
        if (connection) connection.release();
    }
};

exports.updatePurchaseOrder = async (req, res) => {
    const db = getDB();
    const connection = await db.getConnection();

    try {
        const userId = getUserId(req);

        let {
            purchase_order_id,
            id,
            supplier_id,
            po_date,
            subtotal,
            discount,
            tax_amount,
            total_amount,
            status,
            notes,
            items
        } = req.body || {};

        const targetPoId = req.params.id || purchase_order_id || id;

        // 1. Validate Purchase Order ID
        if (!targetPoId) {
            return res.status(400).json({
                success: false,
                message: 'Purchase order ID is required'
            });
        }

        await connection.beginTransaction();
        const validUserId = getUserId(req);

        // 2. Fetch existing Purchase Order
        const [existingRows] = await connection.query(
            `SELECT id, user_id, supplier_id, purchase_order_no, po_date, subtotal, discount, tax_amount, total_amount, status, notes
             FROM purchase_orders
             WHERE id = ? AND user_id = ?
             FOR UPDATE`,
            [targetPoId, validUserId]
        );

        if (existingRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Purchase order not found'
            });
        }

        const existingPO = existingRows[0];
        const oldStatus = (existingPO.status || '').trim();

        // 3. Status Lock Checks (No edits/modifications if Received or Cancelled)
        if (oldStatus === 'Received') {
            await connection.rollback();
            return res.status(409).json({
                success: false,
                message: 'Purchase order with Received status cannot be updated or modified.'
            });
        }

        if (oldStatus === 'Cancelled') {
            await connection.rollback();
            return res.status(409).json({
                success: false,
                message: 'Purchase order with Cancelled status cannot be updated or modified.'
            });
        }

        // 4. Validate requested new status
        const newStatus = status ? String(status).trim() : oldStatus;
        const allowedStatuses = ['Pending', 'Received', 'Cancelled'];

        if (!allowedStatuses.includes(newStatus)) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Allowed values are Pending, Received, and Cancelled'
            });
        }

        // 5. Populate default values for partial updates
        supplier_id = supplier_id || existingPO.supplier_id;
        po_date = po_date || existingPO.po_date;
        subtotal = subtotal !== undefined ? subtotal : existingPO.subtotal;
        discount = discount !== undefined ? discount : existingPO.discount;
        tax_amount = tax_amount !== undefined ? tax_amount : existingPO.tax_amount;
        total_amount = total_amount !== undefined ? total_amount : existingPO.total_amount;
        notes = notes !== undefined ? notes : existingPO.notes;

        // 6. Handle items payload
        if (typeof items === 'string') {
            try {
                items = JSON.parse(items);
            } catch (error) {
                await connection.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'Invalid items JSON format'
                });
            }
        }

        if (!Array.isArray(items) || items.length === 0) {
            const [existingItems] = await connection.query(
                `SELECT product_id, quantity, purchase_price, discount, tax_rate, tax_amount, total_amount, received_quantity
                 FROM purchase_order_items WHERE purchase_order_id = ?`,
                [targetPoId]
            );
            items = existingItems;
        }

        if (!Array.isArray(items) || items.length === 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'At least one purchase order item is required'
            });
        }

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const hasNameOrId = item.product_id || item.productId || item.product_name || item.product || item.name;
            const hasQty = item.quantity !== undefined && item.quantity !== null && item.quantity !== '';
            const hasPrice = item.purchase_price !== undefined || item.rate !== undefined;

            if (!hasNameOrId || !hasQty || !hasPrice) {
                await connection.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Item at index ${i} is missing product name/id, quantity, or purchase_price`
                });
            }

            if (Number(item.quantity || item.qty) <= 0) {
                await connection.rollback();
                return res.status(400).json({
                    success: false,
                    message: `Item at index ${i} must have quantity greater than 0`
                });
            }
        }

        // 7. Ensure valid supplier
        const validSupplierId = await PurchaseOrder.ensureSupplier(
            connection,
            supplier_id,
            validUserId
        );

        // 8. Update Purchase Order
        const result = await PurchaseOrder.updatePurchaseOrder(
            connection,
            targetPoId,
            validUserId,
            {
                supplierId: validSupplierId,
                poDate: po_date,
                subtotal: Number(subtotal || 0),
                discount: Number(discount || 0),
                taxAmount: Number(tax_amount || 0),
                totalAmount: Number(total_amount || 0),
                status: newStatus,
                notes: notes || null,
                documentName: req.file ? req.file.originalname : null,
                documentType: req.file ? req.file.mimetype : null,
                documentData: req.file ? req.file.buffer : null,
                hasNewDocument: !!req.file
            },
            items
        );

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: 'Purchase order updated successfully',
            data: {
                id: Number(targetPoId),
                purchase_order_id: Number(targetPoId),
                poid: Number(targetPoId),
                old_status: result.oldStatus,
                new_status: result.newStatus,
                purchase_created: !!result.purchaseId,
                purchase_id: result.purchaseId || null
            }
        });

    } catch (error) {
        await connection.rollback();
        console.error('Update Purchase Order Error:', error);

        if (error.message && error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        if (error.message && (error.message.includes('already exists') || error.message.includes('cannot be updated'))) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update purchase order'
        });

    } finally {
        connection.release();
    }
};

exports.deletePurchaseOrder = async (req, res) => {
    const db = getDB();
    const connection = await db.getConnection();

    try {
        const userId = getUserId(req);
        const targetPoId = req.params.id || req.body?.purchase_order_id || req.body?.id || req.query?.purchase_order_id;

        if (!targetPoId) {
            return res.status(400).json({
                success: false,
                message: 'Purchase order ID is required'
            });
        }

        await connection.beginTransaction();

        const [existingRows] = await connection.query(
            `SELECT id, status FROM purchase_orders WHERE id = ? AND user_id = ? FOR UPDATE`,
            [targetPoId, userId]
        );

        if (existingRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Purchase order not found'
            });
        }

        const poStatus = (existingRows[0].status || '').trim();

        if (poStatus === 'Received') {
            await connection.rollback();
            return res.status(409).json({
                success: false,
                message: 'Purchase order with Received status cannot be deleted.'
            });
        }

        if (poStatus === 'Cancelled') {
            await connection.rollback();
            return res.status(409).json({
                success: false,
                message: 'Purchase order with Cancelled status cannot be deleted.'
            });
        }

        const result = await PurchaseOrder.deletePurchaseOrder(
            connection,
            targetPoId,
            userId
        );

        await connection.commit();

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Purchase order not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Purchase order deleted successfully'
        });

    } catch (error) {
        await connection.rollback();

        console.error('Delete Purchase Order Error:', error);

        if (error.message && error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        if (error.message && (error.message.includes('linked purchase invoice') || error.message.includes('cannot be deleted'))) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete purchase order'
        });

    } finally {
        connection.release();
    }
};

