const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const unitController = require('../controllers/unitController');

/**
 * @swagger
 * tags:
 *   name: Units
 *   description: Measurement unit master management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Unit:
 *       type: object
 *       required:
 *         - unit_name
 *         - unit_code
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         unit_name:
 *           type: string
 *           example: Pieces
 *         unit_code:
 *           type: string
 *           example: PCS
 *         description:
 *           type: string
 *           nullable: true
 *           example: Standard piece count measurement unit
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/units:
 *   get:
 *     summary: Retrieve all measurement units for authenticated user
 *     tags: [Units]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched list of units
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
 *                     $ref: '#/components/schemas/Unit'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, unitController.getUnits);

/**
 * @swagger
 * /api/units:
 *   post:
 *     summary: Create a new measurement unit
 *     tags: [Units]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unit_name
 *               - unit_code
 *             properties:
 *               unit_name:
 *                 type: string
 *                 example: Kilograms
 *               unit_code:
 *                 type: string
 *                 example: KG
 *               description:
 *                 type: string
 *                 example: Standard metric weight in kilograms
 *     responses:
 *       201:
 *         description: Unit created successfully
 *       400:
 *         description: Validation error (missing fields)
 *       409:
 *         description: Unit name or code already exists for user
 */
router.post('/', authMiddleware, unitController.createUnit);

/**
 * @swagger
 * /api/units/{id}:
 *   get:
 *     summary: Get a specific measurement unit by ID
 *     tags: [Units]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unit ID
 *     responses:
 *       200:
 *         description: Unit details fetched successfully
 *       404:
 *         description: Unit not found
 */
router.get('/:id', authMiddleware, unitController.getUnitById);

/**
 * @swagger
 * /api/units/{id}:
 *   put:
 *     summary: Update an existing measurement unit
 *     tags: [Units]
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
 *             type: object
 *             properties:
 *               unit_name:
 *                 type: string
 *                 example: Kilograms
 *               unit_code:
 *                 type: string
 *                 example: KG
 *               description:
 *                 type: string
 *                 example: Updated description
 *     responses:
 *       200:
 *         description: Unit updated successfully
 *       404:
 *         description: Unit not found
 *       409:
 *         description: Duplicate unit name or code
 */
router.put('/:id', authMiddleware, unitController.updateUnit);

/**
 * @swagger
 * /api/units/{id}:
 *   delete:
 *     summary: Delete a measurement unit
 *     tags: [Units]
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
 *         description: Unit deleted successfully
 *       404:
 *         description: Unit not found
 */
router.delete('/:id', authMiddleware, unitController.deleteUnit);

module.exports = router;
