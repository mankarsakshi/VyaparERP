const FinancialYear = require('../model/FinancialYear');

/**
 * Resolve active Financial Year record for the current request/user:
 * 1. Explicit financial_year_id in body / query (highest priority for targeted writes)
 * 2. Transaction date match from request body (purchase_date, po_date, date, etc.)
 * 3. Header override (x-financial-year-id)
 * 4. Active/Default financial year stored in database (or auto-detected system FY)
 * 5. Fallback to token payload
 */
async function resolveFinancialYear(req, userId) {
    const queryFyId = req.query?.financial_year_id || req.query?.financialYearId;
    const bodyFyId = req.body?.financial_year_id || req.body?.financialYearId;

    // 1. Explicit override in query / body
    const directId = queryFyId || bodyFyId;
    if (directId && Number(directId) > 0) {
        const fy = await FinancialYear.getFYById(Number(directId), userId);
        if (fy) return fy;
    }

    // 2. Transaction date match from request body
    const txDate = req.body?.purchase_date || req.body?.po_date || req.body?.sale_date || req.body?.SaleDate || req.body?.date;
    if (txDate && typeof txDate === 'string' && /^\d{4}-\d{2}-\d{2}/.test(txDate)) {
        const dateFy = await FinancialYear.getFYByDate(userId, txDate.substring(0, 10));
        if (dateFy) return dateFy;
    }

    // 3. Header override passed in the current request
    const headerFyId = req.headers['x-financial-year-id'];
    if (headerFyId && Number(headerFyId) > 0) {
        const fy = await FinancialYear.getFYById(Number(headerFyId), userId);
        if (fy) return fy;
    }

    // 4. Active/Default financial year stored in database (or auto-detected system FY)
    const activeFy = await FinancialYear.findOrCreateCurrentFY(userId);
    if (activeFy) return activeFy;

    // 5. Fallback to token payload if any
    const tokenFyId = req.user?.financialYear?.id;
    if (tokenFyId && Number(tokenFyId) > 0) {
        const fy = await FinancialYear.getFYById(Number(tokenFyId), userId);
        if (fy) return fy;
    }

    return null;
}

/**
 * Validate that the financial year is not locked for write operations
 */
function assertFYNotLocked(fy) {
    if (fy && (fy.is_locked === 1 || fy.is_locked === true)) {
        const err = new Error(
            `Financial Year "${fy.fy_name}" (${fy.fy_code || 'Closed'}) is locked. Unlock it in Financial Year Master to create or modify entries in this period.`
        );
        err.statusCode = 403;
        throw err;
    }
}

module.exports = {
    resolveFinancialYear,
    assertFYNotLocked
};
