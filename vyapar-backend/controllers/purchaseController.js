const Purchase = require('../model/Purchase');

// Helper to get user_id / business_id from auth token
const getUserId = (req) => {
    return req.user.business_id || req.user.id;
};

// Create Purchase Invoice with Items
exports.createPurchase = async (req, res) => {
    try {
        const userId = getUserId(req);

        const {
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
            notes,
            items
        } = req.body;

        if (!supplier_id || !invoice_number || !purchase_date) {
            return res.status(400).json({
                success: false,
                message: 'supplier_id, invoice_number, and purchase_date are required'
            });
        }

        // Parse items if passed as JSON string
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

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Purchase must contain at least one item'
            });
        }

        // Validate items array (allow product_id or product_name/product/name)
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

        // Check invoice number uniqueness for user
        const invoiceExists = await Purchase.checkInvoiceExists(invoice_number, userId);
        if (invoiceExists) {
            return res.status(409).json({
                success: false,
                message: `Purchase invoice '${invoice_number}' already exists`
            });
        }

        const purchaseData = {
            user_id: userId,
            supplier_id: Number(supplier_id),
            purchase_order_id: purchase_order_id ? Number(purchase_order_id) : null,
            invoice_number,
            purchase_date,
            subtotal: Number(subtotal) || 0,
            discount: Number(discount) || 0,
            tax_amount: Number(tax_amount) || 0,
            total_amount: Number(total_amount) || 0,
            payment_status: payment_status || 'Pending',
            payment_method: payment_method || 'Credit',
            notes: notes || null
        };

        const purchaseId = await Purchase.createPurchase(purchaseData, items);

        return res.status(201).json({
            success: true,
            message: 'Purchase created successfully',
            data: {
                id: purchaseId,
                ...purchaseData,
                items
            }
        });
    } 
    
    catch (error) {
        console.error('Create purchase error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error while creating purchase'
        });
    }
};

exports.getPurchases = async (req, res) => {
    try {
        const userId = getUserId(req);
        const purchases = await Purchase.getPurchases(userId);
        return res.status(200).json({
            success: true,
            count: purchases.length,
            data: purchases,
        });
    } catch (error) {
        console.error("Get purchase error : ", error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error while fetching purchases'
        });
    }
};

exports.getPurchaseById = async (req, res) => {
    try {
        const userId = getUserId(req);
        const purchaseId = req.params.id;

        if (!purchaseId) {
            return res.status(400).json({
                success: false,
                message: "Purchase ID is required"
            });
        }

        const purchase = await Purchase.getPurchaseById(purchaseId, userId);

        if (!purchase) {
            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: purchase,
        });
    } catch (error) {
        console.error("Get purchase by id error : ", error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error while fetching purchase'
        });
    }
};

exports.deletePurchase = async (req, res) => {
    try {
        const userId = getUserId(req);
        const purchase_id = req.body?.purchase_id || req.query?.purchase_id || req.params?.id;

        if (!purchase_id) {
            return res.status(400).json({
                success: false,
                message: "Purchase ID is required"
            });
        }

        const result = await Purchase.deletePurchase(purchase_id, userId);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Purchase not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Purchase deleted successfully"
        });

    } catch (error) {
        console.log("Delete purchase error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updatePurchase = async (req, res) => {
    try {
        const userId = getUserId(req);

        let {
            purchase_id,
            id,
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
            notes,
            items
        } = req.body || {};

        const targetPurchaseId = req.params.id || purchase_id || id;

        if (!targetPurchaseId) {
            return res.status(400).json({
                success: false,
                message: "purchase_id is required"
            });
        }

        if (!supplier_id || !invoice_number || !purchase_date) {
            return res.status(400).json({
                success: false,
                message: "supplier_id, invoice_number and purchase_date are required"
            });
        }

        if (typeof items === 'string') {
            try {
                items = JSON.parse(items);
            } catch (err) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid items JSON format"
                });
            }
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one purchase item is required"
            });
        }

        await Purchase.updatePurchase(
            targetPurchaseId,
            userId,
            {
                supplier_id,
                purchase_order_id: purchase_order_id ? Number(purchase_order_id) : null,
                invoice_number,
                purchase_date,
                subtotal,
                discount,
                tax_amount,
                total_amount,
                payment_status,
                payment_method,
                notes
            },
            items
        );

        return res.status(200).json({
            success: true,
            message: "Purchase updated successfully"
        });

    } catch (error) {
        console.error("Update Purchase Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



