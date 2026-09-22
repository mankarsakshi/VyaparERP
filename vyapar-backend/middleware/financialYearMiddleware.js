const { resolveFinancialYear } = require('../utils/financialYearHelper');

/**
 * Middleware to resolve and attach active Financial Year to req.financialYear
 */
const financialYearMiddleware = async (req, res, next) => {
    try {
        const userId = req.user?.business_id || req.user?.id;
        if (!userId) {
            return next();
        }

        const fy = await resolveFinancialYear(req, userId);
        req.financialYear = fy;
        return next();
    } catch (error) {
        console.error('Financial Year Middleware Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to resolve active financial year'
        });
    }
};

module.exports = financialYearMiddleware;
