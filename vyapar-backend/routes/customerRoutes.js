const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const customerController = require('../controllers/customerController');

router.use(authMiddleware);

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for name, phone, email, gstin
 *     responses:
 *       200:
 *         description: List of customers
 */
router.get('/', customerController.getCustomers);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Customer created
 */
router.post('/', customerController.createCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer details
 */
router.get('/:id', customerController.getCustomerById);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer updated
 */
router.put('/:id', customerController.updateCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer deleted
 */
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
