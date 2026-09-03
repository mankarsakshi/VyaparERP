const express = require('express');
const router = express.Router();

const PurchaseOrderController = require('../controllers/PurchaseOrderController');
const authMiddleware = require('../middleware/authMiddleware');

const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const handleUpload = (req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
        return upload.single('document')(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message || 'File upload failed'
                });
            }
            next();
        });
    }
    next();
};

/**
 * @swagger
 * tags:
 *   name: Purchase Orders
 *   description: Management APIs for Purchase Orders
 */

/**
 * @swagger
 * /api/purchase-orders:
 *   post:
 *     summary: Create a new purchase order
 *     description: |
 *       Creates a new Purchase Order sequentially (e.g. PO-0001, PO-0002) with line items.
 *       Supports optional file document attachment.
 *     tags:
 *       - Purchase Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - supplier_id
 *               - po_date
 *               - items
 *             properties:
 *               supplier_id:
 *                 type: integer
 *                 description: ID of the supplier
 *                 example: 1
 *               po_date:
 *                 type: string
 *                 format: date
 *                 description: Date of the purchase order (YYYY-MM-DD)
 *                 example: "2026-08-21"
 *               subtotal:
 *                 type: number
 *                 format: double
 *                 example: 5000.00
 *               discount:
 *                 type: number
 *                 format: double
 *                 example: 500.00
 *               tax_amount:
 *                 type: number
 *                 format: double
 *                 example: 810.00
 *               total_amount:
 *                 type: number
 *                 format: double
 *                 example: 5310.00
 *               status:
 *                 type: string
 *                 enum: [Pending, Received, Cancelled]
 *                 default: Pending
 *                 example: "Pending"
 *               notes:
 *                 type: string
 *                 nullable: true
 *                 example: "Deliver before end of month"
 *               items:
 *                 type: string
 *                 description: |
 *                   JSON string array of item objects.
 *                   Each item requires product_id, quantity, and purchase_price.
 *                 example: '[{"product_id":1,"quantity":10,"purchase_price":500,"discount":50,"tax_rate":18}]'
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Optional document file attachment (max 5MB)
 *     responses:
 *       201:
 *         description: Purchase order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Purchase order created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     purchase_order_no:
 *                       type: string
 *                       example: "PO-0001"
 *                     supplier_id:
 *                       type: integer
 *                       example: 1
 *                     po_date:
 *                       type: string
 *                       example: "2026-08-21"
 *                     subtotal:
 *                       type: number
 *                       example: 5000.00
 *                     discount:
 *                       type: number
 *                       example: 500.00
 *                     tax_amount:
 *                       type: number
 *                       example: 810.00
 *                     total_amount:
 *                       type: number
 *                       example: 5310.00
 *                     status:
 *                       type: string
 *                       example: "Draft"
 *                     notes:
 *                       type: string
 *                       example: "Deliver before end of month"
 *       400:
 *         description: Bad Request / Validation error
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Server error
 */
router.post(
    '/',
    authMiddleware,
    handleUpload,
    PurchaseOrderController.createPurchaseOrder
);


/**
 * @swagger
 * /api/purchase-orders:
 *   get:
 *     summary: Get purchase orders
 *     description: |
 *       Returns all purchase orders belonging to the currently logged-in user.
 *       The user is identified from the JWT token. Purchase order items,
 *       supplier details, and product details are included in the response.
 *     tags:
 *       - Purchase Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchase orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       poid:
 *                         type: integer
 *                         example: 1
 *                       user_id:
 *                         type: integer
 *                         example: 5
 *                       supplier_id:
 *                         type: integer
 *                         example: 2
 *                       supplier_name:
 *                         type: string
 *                         example: ABC Suppliers
 *                       purchase_order_no:
 *                         type: string
 *                         example: PO-2026-001
 *                       po_date:
 *                         type: string
 *                         format: date
 *                         example: "2026-08-22"
 *                       subtotal:
 *                         type: number
 *                         format: double
 *                         example: 10000
 *                       discount:
 *                         type: number
 *                         format: double
 *                         example: 500
 *                       tax_amount:
 *                         type: number
 *                         format: double
 *                         example: 1710
 *                       total_amount:
 *                         type: number
 *                         format: double
 *                         example: 11210
 *                       status:
 *                         type: string
 *                         enum:
 *                           - Draft
 *                           - Pending
 *                           - Approved
 *                           - Partially Received
 *                           - Received
 *                           - Cancelled
 *                         example: Pending
 *                       notes:
 *                         type: string
 *                         nullable: true
 *                         example: Urgent order
 *                       document_name:
 *                         type: string
 *                         nullable: true
 *                         example: invoice.pdf
 *                       document_type:
 *                         type: string
 *                         nullable: true
 *                         example: application/pdf
 *                       document_data:
 *                         type: string
 *                         nullable: true
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-08-22T10:30:00.000Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-08-22T10:30:00.000Z"
 *                       items:
 *                         type: array
 *                         description: Products included in the purchase order
 *                         items:
 *                           type: object
 *                           properties:
 *                             item_id:
 *                               type: integer
 *                               example: 1
 *                             purchase_order_id:
 *                               type: integer
 *                               example: 1
 *                             product_id:
 *                               type: integer
 *                               example: 10
 *                             product_name:
 *                               type: string
 *                               example: Laptop
 *                             quantity:
 *                               type: number
 *                               example: 5
 *                             purchase_price:
 *                               type: number
 *                               format: double
 *                               example: 50000
 *                             item_discount:
 *                               type: number
 *                               format: double
 *                               example: 1000
 *                             item_tax_rate:
 *                               type: number
 *                               format: double
 *                               example: 18
 *                             item_tax_amount:
 *                               type: number
 *                               format: double
 *                               example: 44100
 *                             item_total_amount:
 *                               type: number
 *                               format: double
 *                               example: 293100
 *                             received_quantity:
 *                               type: number
 *                               example: 0
 *                             item_created_date:
 *                               type: string
 *                               format: date-time
 *                               example: "2026-08-22T10:30:00.000Z"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Authentication required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to fetch purchase orders
 */
router.get(
    '/',
    authMiddleware,
    PurchaseOrderController.getPurchaseOrders
);

/**
 * @swagger
 * /api/purchase-orders/{id}:
 *   get:
 *     summary: Get purchase order by ID
 *     description: Returns a single purchase order and its line items by purchase order ID.
 *     tags:
 *       - Purchase Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Purchase Order ID
 *     responses:
 *       200:
 *         description: Purchase order fetched successfully
 *       404:
 *         description: Purchase order not found
 *       500:
 *         description: Internal server error
 */
router.get(
    '/:id',
    authMiddleware,
    PurchaseOrderController.getPurchaseOrderById
);

/**
 * @swagger
 * /api/purchase-orders:
 *   put:
 *     summary: Update a purchase order
 *     description: >
 *       Updates an existing purchase order and replaces its line items.
 *       Supports optional document re-upload.
 *       When the status changes from Pending to Received, the system
 *       automatically creates a purchase record, creates purchase items,
 *       and increases product stock based on the received quantities.
 *       The Pending to Received operation is processed in a database transaction
 *       to prevent partial updates.
 *     tags:
 *       - Purchase Orders
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - purchase_order_id
 *               - supplier_id
 *               - po_date
 *               - items
 *             properties:
 *               purchase_order_id:
 *                 type: integer
 *                 description: ID of the purchase order to update
 *                 example: 1
 *
 *               supplier_id:
 *                 type: integer
 *                 description: Supplier ID
 *                 example: 2
 *
 *               po_date:
 *                 type: string
 *                 format: date
 *                 description: Purchase order date
 *                 example: "2026-08-24"
 *
 *               subtotal:
 *                 type: number
 *                 format: decimal
 *                 example: 5000.00
 *
 *               discount:
 *                 type: number
 *                 format: decimal
 *                 example: 200.00
 *
 *               tax_amount:
 *                 type: number
 *                 format: decimal
 *                 example: 864.00
 *
 *               total_amount:
 *                 type: number
 *                 format: decimal
 *                 example: 5664.00
 *
 *               status:
 *                 type: string
 *                 enum:
 *                   - Pending
 *                   - Received
 *                   - Cancelled
 *                 description: >
 *                   Purchase order status. When changed from Pending to Received,
 *                   a purchase is created and stock is increased. When changed to Cancelled,
 *                   the order is cancelled. Once in Received or Cancelled status, no further
 *                   edits, updates, or deletions are allowed.
 *                 example: "Received"
 *
 *               notes:
 *                 type: string
 *                 example: "Purchase order received successfully"
 *
 *               items:
 *                 type: string
 *                 description: >
 *                   JSON string containing the purchase order items.
 *                   Each item contains product_id, quantity, purchase_price,
 *                   discount and tax_rate.
 *                 example: >
 *                   [{"product_id":1,"quantity":10,"purchase_price":500,"discount":50,"tax_rate":18},
 *                    {"product_id":2,"quantity":5,"purchase_price":200,"discount":20,"tax_rate":18}]
 *
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Optional purchase order document
 *
 *     responses:
 *       200:
 *         description: Purchase order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Purchase order updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     purchase_order_id:
 *                       type: integer
 *                       example: 1
 *                     status:
 *                       type: string
 *                       example: Received
 *                     purchase_created:
 *                       type: boolean
 *                       example: true
 *
 *       400:
 *         description: Bad Request / Validation error
 *
 *       401:
 *         description: Authentication required
 *
 *       404:
 *         description: Purchase order not found
 *
 *       409:
 *         description: Conflict / Purchase order with Received or Cancelled status cannot be updated or modified
 *
 *       500:
 *         description: Server error
 */

router.put(
    '/',
    authMiddleware,
    handleUpload,
    PurchaseOrderController.updatePurchaseOrder
);

router.put(
    '/:id',
    authMiddleware,
    handleUpload,
    PurchaseOrderController.updatePurchaseOrder
);

/**
 * @swagger
 * /api/purchase-orders/{id}:
 *   delete:
 *     summary: Delete a purchase order by ID
 *     description: |
 *       Deletes a purchase order and its line items by purchase order ID for the logged-in user.
 *       Only Purchase Orders in Pending status can be deleted. Received and Cancelled Purchase Orders cannot be deleted.
 *     tags:
 *       - Purchase Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Purchase Order ID to delete
 *     responses:
 *       200:
 *         description: Purchase order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Purchase order deleted successfully
 *       400:
 *         description: Purchase order ID is required
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Purchase order not found
 *       409:
 *         description: Only Pending Purchase Orders can be deleted. Received and Cancelled Purchase Orders cannot be deleted.
 *       500:
 *         description: Server error
 */
router.delete(
    '/:id',
    authMiddleware,
    PurchaseOrderController.deletePurchaseOrder
);

module.exports = router;


