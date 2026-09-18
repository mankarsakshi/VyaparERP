const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'vyapar_erp_jwt_secret_key_default_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate a signed JWT token for a given user payload.
 * @param {Object} payload - User information (e.g. { id, email, role, businessName })
 * @returns {string} - Signed JWT token string
 */
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
};

/**
 * Verify a given JWT token.
 * @param {string} token - JWT token string
 * @returns {Object} - Decoded payload if valid
 */
const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

module.exports = {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    generateToken,
    verifyToken
};
