const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const categoryController = require('../controllers/categoryController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         business_id:
 *           type: integer
 *           example: 1
 *         category_name:
 *           type: string
 *           example: Electronics
 *         description:
 *           type: string
 *           example: Electronic gadgets and accessories
 *         status:
 *           type: string
 *           example: active
 *     CategoryInput:
 *       type: object
 *       required:
 *         - category_name
 *       properties:
 *         category_name:
 *           type: string
 *           example: Electronics
 *         description:
 *           type: string
 *           example: Electronic gadgets and accessories
 *         status:
 *           type: string
 *           example: active
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Retrieve all categories
 *     description: Fetches active product categories.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search category name or description
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get('/', authMiddleware, categoryController.getCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router.post('/', authMiddleware, categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags:
 *       - Categories
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
 *         description: Category found
 *       404:
 *         description: Category not found
 */
router.get('/:id', authMiddleware, categoryController.getCategoryById);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category by ID
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put('/:id', authMiddleware, categoryController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category by ID
 *     tags:
 *       - Categories
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
 *         description: Category deleted successfully
 */
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

module.exports = router;
