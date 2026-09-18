const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const supplierController = require("../controllers/supplierController");

/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [supplier_name, address, city, state, pincode]
 *             properties:
 *               supplier_name: { type: string, example: "ABC Traders" }
 *               phone: { type: string, example: "9876543210" }
 *               email: { type: string, example: "abc@gmail.com" }
 *               gstin: { type: string, example: "27ABCDE1234F1Z5" }
 *               address: { type: string, example: "123 Business Hub" }
 *               city: { type: string, example: "Pune" }
 *               state: { type: string, example: "Maharashtra" }
 *               pincode: { type: string, example: "411001" }
 *               opening_balance: { type: number, example: 5000.00 }
 *               status: { type: string, example: "active" }
 *     responses:
 *       201: { description: Supplier created successfully }
 */
router.post("/", authMiddleware, supplierController.createSupplier);

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Suppliers fetched successfully }
 */
router.get("/", authMiddleware, supplierController.getSuppliers);

/**
 * @swagger
 * /api/suppliers/search:
 *   get:
 *     summary: Get suppliers by name query keyword
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema: { type: string }
 *         description: Keyword or name to search suppliers
 *     responses:
 *       200: { description: Suppliers matched successfully }
 */
router.get("/search", authMiddleware, supplierController.getSupplierByName);

/**
 * @swagger
 * /api/suppliers/name/{name}:
 *   get:
 *     summary: Get suppliers by specific name path parameter
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Suppliers matched successfully }
 */
router.get("/name/:name", authMiddleware, supplierController.getSupplierByName);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get single supplier details by ID
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Supplier details fetched }
 *       404: { description: Supplier not found }
 */
router.get("/:id", authMiddleware, supplierController.getSupplierById);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   put:
 *     summary: Update existing supplier details by ID
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               supplier_name: { type: string }
 *               phone: { type: string }
 *               email: { type: string }
 *               gstin: { type: string }
 *               address: { type: string }
 *               city: { type: string }
 *               state: { type: string }
 *               pincode: { type: string }
 *               opening_balance: { type: number }
 *               status: { type: string }
 *     responses:
 *       200: { description: Supplier updated successfully }
 *       404: { description: Supplier not found }
 */
router.put("/:id", authMiddleware, supplierController.updateSupplier);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     summary: Delete supplier record by ID
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Supplier deleted successfully }
 *       404: { description: Supplier not found }
 */
router.delete("/:id", authMiddleware, supplierController.deleteSupplier);

module.exports = router;
