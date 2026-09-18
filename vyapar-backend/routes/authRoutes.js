const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new Vyapar ERP user account.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessName
 *               - email
 *               - password
 *             properties:
 *               businessName:
 *                 type: string
 *                 example: ABC Traders
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Admin@123
 *               subscriptionPlan:
 *                 type: string
 *                 enum: [free, basic, premium]
 *                 example: free
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Required fields are missing
 *       409:
 *         description: Email already registered
 */
router.post('/signup', authController.signup);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User Login
 *     description: Authenticate a user using email and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Email or password is missing
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Forgot Password
 *     description: Request an OTP to reset password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@rainfotech.com
 *     responses:
 *       200:
 *         description: OTP generated and sent
 *       404:
 *         description: Email not found
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify OTP
 *     description: Verify the 6-digit OTP received for password reset.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@rainfotech.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post('/verify-otp', authController.verifyOTP);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset Password
 *     description: Reset password with OTP code.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@rainfotech.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: NewAdmin@123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Missing fields or invalid OTP
 */
router.post('/reset-password', authController.resetPassword);

module.exports = router;
