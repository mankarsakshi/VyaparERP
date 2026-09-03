const express = require('express');
const router = express.Router();

const purchaseController = require('../controllers/purchaseController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     PurchaseItem:
 *       type: object
 *       required:
 *         - product_id
 *         - quantity
 *         - purchase_price
 *       properties:
 *         product_id:
 *           type: integer
 *           description: ID of the product purchased
 *           example: 1
 *         quantity:
 *           type: number
 *           format: float
 *           description: Quantity purchased
 *           example: 10
 *         purchase_price:
 *           type: number
 *           format: float
 *           description: Unit purchase price
 *           example: 350.00
 *         discount:
 *           type: number
 *           format: float
 *           description: Item discount amount
 *           example: 0.00
 *         tax_rate:
 *           type: number
 *           format: float
 *           description: Tax percentage (e.g. GST)
 *           example: 18.00
 *         tax_amount:
 *           type: number
 *           format: float
 *           description: Tax amount
 *           example: 630.00
 *         total_amount:
 *           type: number
 *           format: float
 *           description: Total amount for this item
 *           example: 4130.00
 *
 *     Purchase:
 *       type: object
 *       required:
 *         - supplier_id
 *         - invoice_number
 *         - purchase_date
 *         - items
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         supplier_id:
 *           type: integer
 *           example: 2
 *         purchase_order_id:
 *           type: integer
 *           nullable: true
 *           description: ID of associated Purchase Order. When provided, automatically updates the linked Purchase Order status from Pending to Received and closes the order.
 *           example: 1
 *         purchase_order_no:
 *           type: string
 *           nullable: true
 *           description: Associated Purchase Order number
 *           example: PO-0001
 *         invoice_number:
 *           type: string
 *           example: INV-PUR-2026-001
 *         purchase_date:
 *           type: string
 *           format: date
 *           example: "2026-08-19"
 *         subtotal:
 *           type: number
 *           format: float
 *           example: 3500.00
 *         discount:
 *           type: number
 *           format: float
 *           example: 0.00
 *         tax_amount:
 *           type: number
 *           format: float
 *           example: 630.00
 *         total_amount:
 *           type: number
 *           format: float
 *           example: 4130.00
 *         payment_status:
 *           type: string
 *           enum: [Pending, Partial, Paid]
 *           example: Pending
 *         payment_method:
 *           type: string
 *           enum: [Cash, UPI, Card, Bank Transfer, Credit]
 *           example: Credit
 *         notes:
 *           type: string
 *           example: Delivered to main warehouse
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PurchaseItem'
 */

/**
 * @swagger
 * /api/purchases:
 *   post:
 *     summary: Create a new purchase invoice with line items
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Purchase'
 *     responses:
 *       201:
 *         description: Purchase invoice created successfully
 *       400:
 *         description: Validation error or missing required fields
 *       409:
 *         description: Invoice number already exists
 *       401:
 *         description: Unauthorized
 */
router.post(
    '/',
    authMiddleware,
    purchaseController.createPurchase
);

/**
 * @swagger
 * /api/purchases:
 *   get:
 *     summary: Get all purchases
 *     description: Get all purchases of the logged-in user along with their purchase items.
 *     tags:
 *       - Purchases
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchases fetched successfully
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
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       user_id:
 *                         type: integer
 *                         example: 5
 *                       supplier_id:
 *                         type: integer
 *                         example: 2
 *                       purchase_order_id:
 *                         type: integer
 *                         nullable: true
 *                         example: 1
 *                       purchase_order_no:
 *                         type: string
 *                         nullable: true
 *                         example: PO-0001
 *                       invoice_number:
 *                         type: string
 *                         example: PUR-001
 *                       purchase_date:
 *                         type: string
 *                         format: date
 *                         example: 2026-08-20
 *                       subtotal:
 *                         type: number
 *                         format: float
 *                         example: 5000
 *                       discount:
 *                         type: number
 *                         format: float
 *                         example: 0
 *                       tax_amount:
 *                         type: number
 *                         format: float
 *                         example: 900
 *                       total_amount:
 *                         type: number
 *                         format: float
 *                         example: 5900
 *                       payment_status:
 *                         type: string
 *                         example: Paid
 *                       payment_method:
 *                         type: string
 *                         example: Cash
 *                       notes:
 *                         type: string
 *                         nullable: true
 *                         example: Stock purchase
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             product_id:
 *                               type: integer
 *                               example: 101
 *                             quantity:
 *                               type: number
 *                               format: float
 *                               example: 5
 *                             purchase_price:
 *                               type: number
 *                               format: float
 *                               example: 1000
 *                             discount:
 *                               type: number
 *                               format: float
 *                               example: 0
 *                             tax_rate:
 *                               type: number
 *                               format: float
 *                               example: 18
 *                             tax_amount:
 *                               type: number
 *                               format: float
 *                               example: 900
 *                             total_amount:
 *                               type: number
 *                               format: float
 *                               example: 5900
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.get(
    '/',
    authMiddleware,
    purchaseController.getPurchases
);

/**
 * @swagger
 * /api/purchases/{id}:
 *   get:
 *     summary: Get purchase by ID
 *     description: Get a single purchase record and its line items by purchase ID for the logged-in user.
 *     tags:
 *       - Purchases
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Purchase ID
 *     responses:
 *       200:
 *         description: Purchase fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Purchase not found
 *       500:
 *         description: Internal server error
 */
router.get(
    '/:id',
    authMiddleware,
    purchaseController.getPurchaseById
);

/**
 * @swagger
 * /api/purchases:
 *   delete:
 *     summary: Delete a purchase
 *     description: Deletes a purchase record and its related purchase items for the authenticated user.
 *     tags:
 *       - Purchases
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - purchase_id
 *             properties:
 *               purchase_id:
 *                 type: integer
 *                 example: 3
 *                 description: ID of the purchase to delete
 *     responses:
 *       200:
 *         description: Purchase deleted successfully
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
 *                   example: Purchase deleted successfully
 *       400:
 *         description: Purchase ID is required
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
 *                   example: Purchase ID is required
 *       404:
 *         description: Purchase not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Purchase not found
 *       500:
 *         description: Internal server error
 */

router.delete(
    '/',
    authMiddleware,
    purchaseController.deletePurchase
);

router.delete(
    '/:id',
    authMiddleware,
    purchaseController.deletePurchase
);

/**
 * @swagger
 * /api/purchases:
 *   put:
 *     summary: Update a purchase
 *     description: Updates purchase details and replaces its purchase items for the authenticated user.
 *     tags:
 *       - Purchases
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - purchase_id
 *               - supplier_id
 *               - invoice_number
 *               - purchase_date
 *               - items
 *             properties:
 *               purchase_id:
 *                 type: integer
 *                 description: ID of the purchase to update
 *                 example: 5
 *
 *               supplier_id:
 *                 type: integer
 *                 description: ID of the supplier
 *                 example: 2
 *
 *               purchase_order_id:
 *                 type: integer
 *                 nullable: true
 *                 description: Optional ID of the associated Purchase Order
 *                 example: 1
 *
 *               invoice_number:
 *                 type: string
 *                 maxLength: 50
 *                 description: Purchase invoice number
 *                 example: PUR-005
 *
 *               purchase_date:
 *                 type: string
 *                 format: date
 *                 description: Purchase date
 *                 example: "2026-08-21"
 *
 *               subtotal:
 *                 type: number
 *                 format: double
 *                 example: 5000.00
 *
 *               discount:
 *                 type: number
 *                 format: double
 *                 example: 200.00
 *
 *               tax_amount:
 *                 type: number
 *                 format: double
 *                 example: 864.00
 *
 *               total_amount:
 *                 type: number
 *                 format: double
 *                 example: 5664.00
 *
 *               payment_status:
 *                 type: string
 *                 enum:
 *                   - Pending
 *                   - Partial
 *                   - Paid
 *                 example: Paid
 *
 *               payment_method:
 *                 type: string
 *                 enum:
 *                   - Cash
 *                   - UPI
 *                   - Card
 *                   - Bank Transfer
 *                   - Credit
 *                 example: Cash
 *
 *               notes:
 *                 type: string
 *                 example: Updated purchase details
 *
 *               items:
 *                 type: array
 *                 description: Products included in the purchase
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                     - purchase_price
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       description: ID of the product
 *                       example: 1
 *
 *                     quantity:
 *                       type: number
 *                       format: double
 *                       example: 10
 *
 *                     purchase_price:
 *                       type: number
 *                       format: double
 *                       example: 400.00
 *
 *                     discount:
 *                       type: number
 *                       format: double
 *                       example: 50.00
 *
 *                     tax_rate:
 *                       type: number
 *                       format: double
 *                       example: 18.00
 *
 *                     tax_amount:
 *                       type: number
 *                       format: double
 *                       example: 630.00
 *
 *                     total_amount:
 *                       type: number
 *                       format: double
 *                       example: 4380.00
 *
 *     responses:
 *       200:
 *         description: Purchase updated successfully
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
 *                   example: Purchase updated successfully
 *
 *       400:
 *         description: Invalid request data
 *
 *       401:
 *         description: Authentication required
 *
 *       404:
 *         description: Purchase not found
 *
 *       500:
 *         description: Server error
 */
router.put(
    '/',
    authMiddleware,
    purchaseController.updatePurchase
);

router.put(
    '/:id',
    authMiddleware,
    purchaseController.updatePurchase
);

module.exports = router;
