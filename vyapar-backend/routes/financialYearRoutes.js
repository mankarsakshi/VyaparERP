const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const financialYearController = require('../controllers/financialYearController');

/**
 * @swagger
 * tags:
 *   name: Financial Years
 *   description: Financial Year Master configuration & Active Working Scope management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FinancialYear:
 *       type: object
 *       required:
 *         - fy_name
 *         - fy_code
 *         - start_date
 *         - end_date
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-increment primary key ID
 *           example: 1
 *         user_id:
 *           type: integer
 *           description: User ID owning this financial year
 *           example: 1
 *         fy_name:
 *           type: string
 *           description: Financial year name
 *           example: "2026-2027"
 *         fy_code:
 *           type: string
 *           description: Short code
 *           example: "FY26-27"
 *         start_date:
 *           type: string
 *           format: date
 *           example: "2026-04-01"
 *         end_date:
 *           type: string
 *           format: date
 *           example: "2027-03-31"
 *         assessment_year:
 *           type: string
 *           example: "2027-2028"
 *         is_active:
 *           type: boolean
 *           example: true
 *         is_default:
 *           type: boolean
 *           example: true
 *         is_locked:
 *           type: boolean
 *           example: false
 *         description:
 *           type: string
 *           nullable: true
 */

// All routes are protected with JWT auth middleware
router.use(authMiddleware);

// GET /api/financial-years - List all financial years
router.get('/', financialYearController.getAllFinancialYears);

// POST /api/financial-years/switch-active - Switch active working year and re-issue token
router.post('/switch-active', financialYearController.switchActiveFinancialYear);

// GET /api/financial-years/:id - Get single financial year
router.get('/:id', financialYearController.getFinancialYearById);

// POST /api/financial-years - Create new financial year with non-overlapping validation
router.post('/', financialYearController.createFinancialYear);

// PUT /api/financial-years/:id/set-default - Set as default active year
router.put('/:id/set-default', financialYearController.switchActiveFinancialYear);

// PUT /api/financial-years/:id - Update financial year
router.put('/:id', financialYearController.updateFinancialYear);

// PATCH /api/financial-years/:id/toggle-lock - Toggle lock status
router.patch('/:id/toggle-lock', financialYearController.toggleLockFinancialYear);

// DELETE /api/financial-years/:id - Delete financial year
router.delete('/:id', financialYearController.deleteFinancialYear);

module.exports = router;
