const express = require('express');
const router = express.Router();

const purchaseReturnController = require('../controllers/purchaseReturnController');
const authMiddleware = require('../middleware/authMiddleware');
const financialYearMiddleware = require('../middleware/financialYearMiddleware');

router.use(authMiddleware);
router.use(financialYearMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     PurchaseReturnItem:
 *       type: object
 *       required:
 *         - productName
 *         - quantity
 *         - rate
 *       properties:
 *         product_id:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         productName:
 *           type: string
 *           example: Laptop i7 16GB
 *         hsnCode:
 *           type: string
 *           example: "8471"
 *         quantity:
 *           type: number
 *           example: 2
 *         rate:
 *           type: number
 *           example: 45000.00
 *         discount:
 *           type: number
 *           example: 5.00
 *         gstRate:
 *           type: number
 *           example: 18.00
 *
 *     PurchaseReturn:
 *       type: object
 *       required:
 *         - debitNoteNumber
 *         - originalInvoiceNumber
 *         - returnDate
 *         - returnReason
 *         - items
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         supplier_id:
 *           type: integer
 *           nullable: true
 *           example: 2
 *         supplierName:
 *           type: string
 *           example: ABC Traders
 *         debitNoteNumber:
 *           type: string
 *           example: DN-20260915-1042
 *         originalInvoiceNumber:
 *           type: string
 *           example: INV-20260901-778
 *         returnDate:
 *           type: string
 *           format: date
 *           example: "2026-09-15"
 *         returnReason:
 *           type: string
 *           example: Damaged Goods
 *         refundStatus:
 *           type: string
 *           enum: [Refund Pending, Refunded to Bank, Adjusted in Credit Note]
 *           example: Refund Pending
 *         notes:
 *           type: string
 *           example: Returned due to damaged outer casing
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PurchaseReturnItem'
 */

/**
 * @swagger
 * /api/purchase-returns:
 *   post:
 *     summary: Create a new purchase return (debit note)
 *     tags: [Purchase Returns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchaseReturn'
 *     responses:
 *       201:
 *         description: Purchase return created successfully
 *       400:
 *         description: Missing required fields or items
 *       409:
 *         description: Debit note number already exists
 */
router.post('/', authMiddleware, purchaseReturnController.createPurchaseReturn);

/**
 * @swagger
 * /api/purchase-returns:
 *   get:
 *     summary: Get all purchase returns
 *     tags: [Purchase Returns]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of purchase returns
 */
router.get('/', authMiddleware, purchaseReturnController.getPurchaseReturns);
router.get('/next-number', authMiddleware, purchaseReturnController.getNextDebitNoteNumber);

/**
 * @swagger
 * /api/purchase-returns/{id}:
 *   get:
 *     summary: Get purchase return by ID
 *     tags: [Purchase Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Purchase return details
 *       404:
 *         description: Return record not found
 */
router.get('/:id', authMiddleware, purchaseReturnController.getPurchaseReturnById);

/**
 * @swagger
 * /api/purchase-returns:
 *   put:
 *     summary: Update purchase return
 *     tags: [Purchase Returns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchaseReturn'
 *     responses:
 *       200:
 *         description: Purchase return updated successfully
 */
router.put('/', authMiddleware, purchaseReturnController.updatePurchaseReturn);

/**
 * @swagger
 * /api/purchase-returns:
 *   delete:
 *     summary: Delete purchase return
 *     tags: [Purchase Returns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Purchase return deleted successfully
 */
router.delete('/', authMiddleware, purchaseReturnController.deletePurchaseReturn);
router.delete('/:id', authMiddleware, purchaseReturnController.deletePurchaseReturn);

module.exports = router;
