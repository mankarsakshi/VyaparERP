
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { generateToken } = require('./config/jwt');

const app = express();

// ====================== MIDDLEWARE ======================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vyapar ERP API",
      version: "1.0.0",
      description: "API documentation for Vyapar ERP"
    },
    servers: [
      {
        url: "http://localhost:8080"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },

  apis: ["server.js", "./routes/*.js"]
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);


// ====================== DATABASE ======================

const {
    initializeDatabase,
    getDB
} = require('./database/db');
initializeDatabase();


// ====================== SIGNUP ======================

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new Vyapar ERP user account.
 *     tags:
 *       - Authentication
 *
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
 *                 description: Name of the business
 *                 example: ABC Traders
 *
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *                 example: admin@gmail.com
 *
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password
 *                 example: Admin@123
 *
 *               subscriptionPlan:
 *                 type: string
 *                 enum: [free, basic, premium]
 *                 description: Selected subscription plan
 *                 example: free
 *
 *     responses:
 *
 *       201:
 *         description: Registration successful
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
 *                   example: Registration successful
 *                 userId:
 *                   type: integer
 *                   example: 1
 *
 *       400:
 *         description: Required fields are missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Please fill all required fields
 *
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email already registered
 *
 *       500:
 *         description: Server or database error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Registration failed
 */

app.post('/signup', async (req, res) => {
    try {
        const {
            businessName,
            email,
            password,
            subscriptionPlan
        } = req.body;

        // Validate required fields (businessName, email, password)
        if (!businessName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields (businessName, email, password)'
            });
        }

        const db = getDB();

        // Check email uniqueness
        const emailCheck = 'SELECT id FROM users WHERE email = ?';
        const [emailResults] = await db.query(emailCheck, [email]);

        if (emailResults.length > 0) {
            // User already exists — update their password and business name so they can login
            const hashedPassword = await bcrypt.hash(password, 10);
            const validPlan = ['free', 'basic', 'premium'].includes(subscriptionPlan) ? subscriptionPlan : undefined;

            let updateSql = 'UPDATE users SET password = ?, business_name = ?';
            const updateParams = [hashedPassword, businessName];

            if (validPlan) {
                updateSql += ', subscription_plan = ?';
                updateParams.push(validPlan);
            }

            updateSql += ' WHERE email = ?';
            updateParams.push(email);

            await db.query(updateSql, updateParams);

            return res.status(200).json({
                success: true,
                message: 'Account updated successfully. You can now login with your new password.',
                userId: emailResults[0].id
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const validPlan = ['free', 'basic', 'premium'].includes(subscriptionPlan) ? subscriptionPlan : 'free';

        // Insert user matching SQL schema:
        // id, business_name, email, password, role, status, subscription_plan, subscription_status
        const sql = `
            INSERT INTO users
            (business_name, email, password, role, status, subscription_plan, subscription_status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            businessName,
            email,
            hashedPassword,
            'user',
            'active',
            validPlan,
            'inactive'
        ]);

        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
});


// ====================== LOGIN ======================

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User Login
 *     description: Authenticate a user using email and password.
 *     tags:
 *       - Authentication
 *
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
 *                 description: User's registered email address
 *                 example: admin@gmail.com
 *
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: Admin@123
 *
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     businessName:
 *                       type: string
 *                       example: ABC Traders
 *                     email:
 *                       type: string
 *                       example: admin@gmail.com
 *                     subscriptionPlan:
 *                       type: string
 *                       example: free
 *
 *       400:
 *         description: Email or password is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email and password are required
 *
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *
 *       500:
 *         description: Server or login error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Database error
 */


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const db = getDB();

        // Find user by email with existing DB columns
        const sql = `
            SELECT 
                id,
                business_name,
                email,
                password,
                role,
                status,
                subscription_plan,
                subscription_status
            FROM users
            WHERE email = ?
        `;

        const [results] = await db.query(sql, [email]);

        // User not found
        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = results[0];

        // Compare entered password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT Token using JWT_SECRET
        const token = generateToken({
            id: user.id,
            business_id: user.id,
            email: user.email,
            role: user.role,
            businessName: user.business_name
        });

        // Login successful
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                businessName: user.business_name,
                email: user.email,
                role: user.role,
                status: user.status,
                subscriptionPlan: user.subscription_plan,
                subscriptionStatus: user.subscription_status
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
});


// ====================== PASSWORD RESET (OTP FLOW) ======================

// In-memory OTP storage with 10-minute expiry (email -> { otp, expiresAt })
const otpStore = new Map();

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     description: Generates a 6-digit OTP for password recovery if email exists.
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
 *                 example: admin@gmail.com
 *     responses:
 *       200:
 *         description: OTP generated successfully
 *       400:
 *         description: Email is required
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
 */
app.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Email address is required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const db = getDB();

        const sql = 'SELECT id, email, business_name FROM users WHERE email = ?';
        const [results] = await db.query(sql, [normalizedEmail]);

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email address'
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        otpStore.set(normalizedEmail, { otp, expiresAt });
        console.log(`[OTP] Generated password reset OTP for ${normalizedEmail}: ${otp}`);

        return res.status(200).json({
            success: true,
            message: `OTP sent successfully. For demo purposes, use code: ${otp}`,
            demoOtp: otp
        });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to process forgot password request'
        });
    }
});

/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify OTP for password reset
 *     description: Validates the 6-digit OTP code sent to user email.
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
 *                 example: admin@gmail.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Server error
 */
app.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const stored = otpStore.get(normalizedEmail);

        if (!stored) {
            return res.status(400).json({
                success: false,
                message: 'No OTP requested for this email. Please request a new OTP.'
            });
        }

        if (Date.now() > stored.expiresAt) {
            otpStore.delete(normalizedEmail);
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new OTP.'
            });
        }

        if (stored.otp !== String(otp).trim()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP code entered'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'OTP verified successfully'
        });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to verify OTP'
        });
    }
});

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset account password
 *     description: Resets password using verified OTP.
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
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@gmail.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid OTP or password length
 *       500:
 *         description: Server error
 */
app.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email, OTP, and newPassword are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const stored = otpStore.get(normalizedEmail);

        if (!stored) {
            return res.status(400).json({
                success: false,
                message: 'No OTP session found. Please request a new OTP.'
            });
        }

        if (Date.now() > stored.expiresAt) {
            otpStore.delete(normalizedEmail);
            return res.status(400).json({
                success: false,
                message: 'OTP session expired. Please request a new OTP.'
            });
        }

        if (stored.otp !== String(otp).trim()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP code'
            });
        }

        const db = getDB();
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const sql = 'UPDATE users SET password = ? WHERE email = ?';
        const [updateResult] = await db.query(sql, [hashedPassword, normalizedEmail]);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'User account not found'
            });
        }

        // Clear used OTP
        otpStore.delete(normalizedEmail);

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully. You can now login with your new password.'
        });
    } catch (error) {
        console.error('Reset Password Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to reset password'
        });
    }
});


// ====================== ROUTES ======================



const purchaseRoutes = require('./routes/purchaseRoutes');
app.use('/api/purchases', purchaseRoutes);

const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes');
app.use('/api/purchase-orders', purchaseOrderRoutes);

const supplierRoutes = require('./routes/supplierRoutes');
app.use('/api/suppliers', supplierRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);

const unitRoutes = require('./routes/unitRoutes');
app.use('/api/units', unitRoutes);

// ====================== SERVER ======================

app.listen(8080, () => {

    console.log(
        'Server running on http://localhost:8080'
    );

});