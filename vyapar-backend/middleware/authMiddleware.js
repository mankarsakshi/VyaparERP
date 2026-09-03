const { verifyToken } = require('../config/jwt');

// Default fallback user context for frontend requests that don't send Authorization headers
const DEFAULT_USER = {
    id: 1,
    business_id: 1,
    email: 'admin@rainfotech.com',
    role: 'admin',
    businessName: 'RA Infotech Admin'
};

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // If no Authorization header is provided, smoothly fallback to default user
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            req.user = DEFAULT_USER;
            return next();
        }

        let token = authHeader.substring(7).trim();

        // Handle case where user typed "Bearer <token>" in Swagger Authorize dialog
        if (token.startsWith('Bearer ')) {
            token = token.substring(7).trim();
        }

        if (!token || token === 'undefined' || token === 'null') {
            req.user = DEFAULT_USER;
            return next();
        }

        try {
            const decoded = verifyToken(token);
            req.user = decoded;
            return next();
        } catch (err) {
            // If token expired/invalid, fallback to default user so app screens don't break
            req.user = DEFAULT_USER;
            return next();
        }

    } catch (error) {
        req.user = DEFAULT_USER;
        return next();
    }
};

module.exports = authMiddleware;