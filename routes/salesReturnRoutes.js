const express = require('express');
const router = express.Router();

const salesReturnController = require('../controllers/salesReturnController');
const authMiddleware = require('../middleware/authMiddleware');
const financialYearMiddleware = require('../middleware/financialYearMiddleware');

router.use(authMiddleware);
router.use(financialYearMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     SalesReturnItemInput:
 *       type: object
 *       required:
 *         - product_name
 *         - quantity
 *         - rate
 *       properties:
 *         product_id:
 *           type: integer
 *           nullable: true
 *           description: Database ID of the returned product (optional if custom item)
 *           example: 1
 *         product_name:
 *           type: string
 *           description: Name of the item being returned
 *           example: "Laptop i7 16GB"
 *         batch_no:
 *           type: string
 *           nullable: true
 *           description: Batch number of the item being returned
 *           example: "BATCH-1002"
 *         hsn_code:
 *           type: string
 *           description: HSN / SAC code for GST billing
 *           example: "847130"
 *         quantity:
 *           type: number
 *           format: float
 *           description: Return quantity (cannot exceed original billed quantity if invoice is selected)
 *           example: 1
 *         rate:
 *           type: number
 *           format: float
 *           description: Unit rate/selling price
 *           example: 45000.00
 *         discount:
 *           type: number
 *           format: float
 *           description: Line item discount percentage (0-100)
 *           example: 0.00
 *         tax_rate:
 *           type: number
 *           format: float
 *           description: GST percentage rate (0, 5, 12, 18, 28)
 *           example: 18.00
 *         tax_amount:
 *           type: number
 *           format: float
 *           description: Calculated GST amount for this line item
 *           example: 8100.00
 *         total_amount:
 *           type: number
 *           format: float
 *           description: Total line item amount inclusive of GST tax
 *           example: 53100.00
 *
 *     SalesReturnInput:
 *       type: object
 *       required:
 *         - customer_name
 *         - items
 *       properties:
 *         return_number:
 *           type: string
 *           description: Unique Credit Note / Sales Return voucher number (auto-generated if omitted)
 *           example: "CN-2026-0001"
 *         customer_id:
 *           type: integer
 *           nullable: true
 *           description: ID of linked customer record
 *           example: 1
 *         customer_name:
 *           type: string
 *           description: Customer or party name
 *           example: "ABC Traders"
 *         customer_phone:
 *           type: string
 *           description: Customer contact phone number
 *           example: "9876543210"
 *         customer_gstin:
 *           type: string
 *           description: Customer GSTIN number (15 alphanumeric characters)
 *           example: "27ABCDE1234F1Z5"
 *         customer_state:
 *           type: string
 *           description: Customer state for GST calculation (Place of Supply)
 *           example: "Maharashtra"
 *         return_date:
 *           type: string
 *           format: date
 *           description: Date of issue for Credit Note (YYYY-MM-DD)
 *           example: "2026-09-24"
 *         reason:
 *           type: string
 *           description: Reason for sales return / credit note
 *           example: "Defective / Damaged product"
 *         refund_status:
 *           type: string
 *           enum: [Store Credit, Refunded, Adjusted in Credit Note, Direct Cash / UPI Refund]
 *           description: Settlement status
 *           example: "Store Credit"
 *         payment_method:
 *           type: string
 *           enum: [Credit Note, Cash, Bank Transfer, UPI, Cheque]
 *           description: Mode of settlement
 *           example: "Credit Note"
 *         subtotal:
 *           type: number
 *           format: float
 *           description: Subtotal taxable amount
 *           example: 45000.00
 *         tax_amount:
 *           type: number
 *           format: float
 *           description: Total GST tax amount
 *           example: 8100.00
 *         total_amount:
 *           type: number
 *           format: float
 *           description: Grand total credit note amount
 *           example: 53100.00
 *         notes:
 *           type: string
 *           description: Remarks or internal notes
 *           example: "Item returned under 1-year warranty replacement scheme"
 *         items:
 *           type: array
 *           description: Array of line items returned
 *           items:
 *             $ref: '#/components/schemas/SalesReturnItemInput'
 */

/**
 * @swagger
 * /api/sales-returns/next-number:
 *   get:
 *     summary: Get Auto-Suggested Next Credit Note Number
 *     description: Returns the next recommended sequential Credit Note voucher number for the active financial year (e.g. CN-2026-0001).
 *     tags: [Sales Returns / Credit Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Next Credit Note number generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 return_number:
 *                   type: string
 *                   example: "CN-2026-0001"
 *                 credit_note_number:
 *                   type: string
 *                   example: "CN-2026-0001"
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 */
router.get('/next-number', salesReturnController.getNextCreditNoteNumber);

/**
 * @swagger
 * /api/sales-returns:
 *   post:
 *     summary: Issue a new Sales Credit Note (Sales Return)
 *     description: Records a sales return credit note, inserts line items, updates customer ledger balance, and automatically increments inventory stock.
 *     tags: [Sales Returns / Credit Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalesReturnInput'
 *     responses:
 *       201:
 *         description: Credit Note created successfully
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
 *                   example: "Credit Note / Sales Return created successfully"
 *                 data:
 *                   type: object
 *       400:
 *         description: Missing required customer name or line items
 *       409:
 *         description: Credit Note number already exists in active financial year
 *       401:
 *         description: Unauthorized
 */
router.post('/', salesReturnController.createSalesReturn);

/**
 * @swagger
 * /api/sales-returns:
 *   get:
 *     summary: Get all Sales Credit Notes
 *     description: Retrieve all sales return credit notes for the authenticated user and active financial year with customer details and line items.
 *     tags: [Sales Returns / Credit Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of Credit Notes fetched successfully
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
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/', salesReturnController.getSalesReturns);

/**
 * @swagger
 * /api/sales-returns/{id}:
 *   get:
 *     summary: Get Sales Credit Note details by ID
 *     description: Retrieve full details and line items of a specific Credit Note voucher by ID.
 *     tags: [Sales Returns / Credit Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Credit Note record ID
 *     responses:
 *       200:
 *         description: Credit Note fetched successfully
 *       404:
 *         description: Credit Note not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', salesReturnController.getSalesReturnById);

/**
 * @swagger
 * /api/sales-returns/{id}:
 *   delete:
 *     summary: Delete Sales Credit Note
 *     description: Deletes a Credit Note voucher by ID and reverses associated inventory stock adjustments.
 *     tags: [Sales Returns / Credit Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Credit Note record ID to delete
 *     responses:
 *       200:
 *         description: Credit Note deleted successfully
 *       404:
 *         description: Credit Note not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/', salesReturnController.deleteSalesReturn);
router.delete('/:id', salesReturnController.deleteSalesReturn);

module.exports = router;
