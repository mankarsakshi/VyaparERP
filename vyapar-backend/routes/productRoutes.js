const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - product_name
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated product ID
 *           example: 1
 *         business_id:
 *           type: integer
 *           description: Business ID associated with the user
 *           example: 1
 *         category_id:
 *           type: integer
 *           nullable: true
 *           description: Optional category ID
 *           example: 2
 *         product_name:
 *           type: string
 *           description: Name of the product
 *           example: Wireless Ergonomic Mouse
 *         sku:
 *           type: string
 *           description: Product SKU or code
 *           example: PROD-17253456
 *         hsn_code:
 *           type: string
 *           description: HSN / SAC Code
 *           example: "8471"
 *         unit:
 *           type: string
 *           description: Unit of measure (e.g. PCS, KG, BOX)
 *           example: PCS
 *         purchase_price:
 *           type: number
 *           format: float
 *           description: Purchase rate / cost
 *           example: 1200.00
 *         selling_price:
 *           type: number
 *           format: float
 *           description: Selling rate / price
 *           example: 1800.00
 *         opening_stock:
 *           type: number
 *           format: float
 *           description: Initial stock quantity
 *           example: 50.00
 *         current_stock:
 *           type: number
 *           format: float
 *           description: Current stock quantity in inventory
 *           example: 50.00
 *         minimum_stock:
 *           type: integer
 *           description: Minimum stock threshold for alert
 *           example: 5
 *         min_stock_alert:
 *           type: integer
 *           description: Alias for minimum stock threshold
 *           example: 5
 *         sgst:
 *           type: number
 *           format: float
 *           description: SGST percentage (optional)
 *           example: 9.00
 *         cgst:
 *           type: number
 *           format: float
 *           description: CGST percentage (optional)
 *           example: 9.00
 *         igst:
 *           type: number
 *           format: float
 *           description: IGST percentage (optional)
 *           example: 0.00
 *         tax_rate:
 *           type: number
 *           format: float
 *           description: Total Tax Rate percentage
 *           example: 18.00
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     ProductInput:
 *       type: object
 *       required:
 *         - product_name
 *       properties:
 *         category_id:
 *           type: integer
 *           nullable: true
 *           description: Optional category ID
 *           example: 2
 *         product_name:
 *           type: string
 *           description: Name of the product (or 'name')
 *           example: Wireless Ergonomic Mouse
 *         sku:
 *           type: string
 *           description: SKU or product code
 *           example: MOUSE-001
 *         hsn_code:
 *           type: string
 *           description: HSN / SAC Code
 *           example: "8471"
 *         unit:
 *           type: string
 *           description: Unit of measure
 *           example: PCS
 *         purchase_price:
 *           type: number
 *           format: float
 *           description: Purchase rate / cost
 *           example: 1200.00
 *         selling_price:
 *           type: number
 *           format: float
 *           description: Selling rate / price
 *           example: 1800.00
 *         opening_stock:
 *           type: number
 *           format: float
 *           description: Opening stock quantity
 *           example: 50
 *         current_stock:
 *           type: number
 *           format: float
 *           description: Current stock quantity
 *           example: 50
 *         min_stock_alert:
 *           type: integer
 *           description: Minimum stock threshold
 *           example: 5
 *         sgst:
 *           type: number
 *           format: float
 *           description: SGST rate (%)
 *           example: 9.00
 *         cgst:
 *           type: number
 *           format: float
 *           description: CGST rate (%)
 *           example: 9.00
 *         igst:
 *           type: number
 *           format: float
 *           description: IGST rate (%)
 *           example: 0.00
 *         tax_rate:
 *           type: number
 *           format: float
 *           description: Total Tax Rate (%)
 *           example: 18.00
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve all products
 *     description: Fetches a list of all products belonging to the logged-in user's business. Supports optional search.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name, SKU, HSN, or category
 *     responses:
 *       200:
 *         description: List of products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized / Missing access token
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, productController.getProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product for the authenticated business user.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
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
 *                   example: Product created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error or missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Fetches details of a single product by its unique ID.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique product ID
 *     responses:
 *       200:
 *         description: Product details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authMiddleware, productController.getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     description: Updates product information by ID.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
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
 *                   example: Product updated successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authMiddleware, productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product by ID.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
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
 *                   example: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
