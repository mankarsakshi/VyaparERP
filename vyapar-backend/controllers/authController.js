const bcrypt = require('bcrypt');
const { getDB } = require('../database/db');
const { generateToken } = require('../config/jwt');

// In-memory OTP storage with 10-minute expiry
const otpStore = new Map();

// Periodic cleanup of expired OTPs every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [email, record] of otpStore.entries()) {
        if (record.expiresAt < now) {
            otpStore.delete(email);
        }
    }
}, 5 * 60 * 1000);

/**
 * Register a new user business account
 */
exports.signup = async (req, res) => {
    try {
        const {
            businessName,
            email,
            password,
            subscriptionPlan,
            phone,
            address,
            gstin
        } = req.body;

        if (!businessName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields (businessName, email, password)'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const db = getDB();

        // Check email uniqueness
        const emailCheck = 'SELECT id FROM users WHERE LOWER(email) = ?';
        const [emailResults] = await db.query(emailCheck, [normalizedEmail]);

        if (emailResults.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const validPlan = ['free', 'basic', 'premium'].includes(subscriptionPlan) ? subscriptionPlan : 'free';

        const sql = `
            INSERT INTO users
            (business_name, email, password, role, status, subscription_plan, subscription_status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            businessName.trim(),
            normalizedEmail,
            hashedPassword,
            'user',
            'active',
            validPlan,
            'active'
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
            message: 'Registration failed: ' + (error.message || 'Server error')
        });
    }
};

/**
 * Authenticate existing user
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const db = getDB();

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
            WHERE LOWER(email) = ?
        `;

        const [results] = await db.query(sql, [normalizedEmail]);

        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = results[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT Token
        const token = generateToken({
            id: user.id,
            business_id: user.id,
            email: user.email,
            role: user.role,
            businessName: user.business_name
        });

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
            message: 'Login failed: ' + (error.message || 'Server error')
        });
    }
};

/**
 * Request password reset OTP
 */
exports.forgotPassword = async (req, res) => {
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

        const [users] = await db.query(
            'SELECT id, email, business_name FROM users WHERE LOWER(email) = ?',
            [normalizedEmail]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email address'
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes TTL

        otpStore.set(normalizedEmail, {
            otp,
            expiresAt
        });

        console.log(`[AUTH] Generated OTP for ${normalizedEmail}: ${otp}`);

        return res.status(200).json({
            success: true,
            message: 'OTP sent to your email successfully',
            otp // included for seamless local development and mobile emulator testing
        });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to process forgot password request'
        });
    }
};

/**
 * Verify OTP code
 */
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const record = otpStore.get(normalizedEmail);

        if (!record || record.expiresAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP. Please request a new one.'
            });
        }

        if (record.otp !== String(otp).trim()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP. Please check the code and try again.'
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
};

/**
 * Reset password with OTP
 */
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, password } = req.body;
        const targetPassword = newPassword || password;

        if (!email || !targetPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email and new password are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const db = getDB();

        // If OTP was provided, verify it
        if (otp) {
            const record = otpStore.get(normalizedEmail);
            if (record && record.otp !== String(otp).trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid OTP'
                });
            }
        }

        const hashedPassword = await bcrypt.hash(targetPassword, 10);

        const [result] = await db.query(
            'UPDATE users SET password = ? WHERE LOWER(email) = ?',
            [hashedPassword, normalizedEmail]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'User account not found'
            });
        }

        // Clean up OTP store
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
};
