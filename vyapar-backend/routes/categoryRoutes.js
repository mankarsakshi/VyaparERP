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
 *       required:
 *         - category_name
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
 *           nullable: true
 *           example: Electronic devices and hardware accessories
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           example: active
 */

router.get('/', authMiddleware, categoryController.getCategories);
router.post('/', authMiddleware, categoryController.createCategory);
router.get('/:id', authMiddleware, categoryController.getCategoryById);
router.put('/:id', authMiddleware, categoryController.updateCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

module.exports = router;
