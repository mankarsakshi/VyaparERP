const FinancialYear = require('../model/FinancialYear');
const { generateToken } = require('../config/jwt');

const getUserId = (req) => {
    return req.user?.id || req.user?.business_id;
};

// GET /api/financial-years
exports.getAllFinancialYears = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const years = await FinancialYear.getAllFY(userId);
        return res.status(200).json({
            success: true,
            data: years
        });
    } catch (error) {
        console.error("Error fetching financial years:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch financial years" });
    }
};

// GET /api/financial-years/:id
exports.getFinancialYearById = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;

        const fy = await FinancialYear.getFYById(id, userId);
        if (!fy) {
            return res.status(404).json({ success: false, message: "Financial year not found" });
        }

        return res.status(200).json({ success: true, data: fy });
    } catch (error) {
        console.error("Error fetching financial year:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch financial year" });
    }
};

// POST /api/financial-years
exports.createFinancialYear = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const {
            fy_name,
            fy_code,
            start_date,
            end_date,
            assessment_year,
            is_active,
            is_default,
            is_locked,
            description
        } = req.body;

        if (!fy_name || !fy_name.trim()) {
            return res.status(400).json({ success: false, message: "Financial Year Name is required (e.g. 2026-2027)" });
        }

        if (!start_date || !end_date) {
            return res.status(400).json({ success: false, message: "Start Date and End Date are both required" });
        }

        const start = new Date(start_date);
        const end = new Date(end_date);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ success: false, message: "Invalid date format" });
        }

        if (start >= end) {
            return res.status(400).json({ success: false, message: "Start Date must be earlier than End Date" });
        }

        const cleanName = fy_name.trim();
        const cleanCode = (fy_code && fy_code.trim()) ? fy_code.trim() : `FY${cleanName}`;

        // 1. Check duplicate name or code
        const duplicates = await FinancialYear.checkDuplicate(userId, cleanName, cleanCode);
        if (duplicates && duplicates.length > 0) {
            const dupName = duplicates.find(d => d.fy_name.toLowerCase() === cleanName.toLowerCase());
            if (dupName) {
                return res.status(409).json({
                    success: false,
                    message: `Financial Year Name "${cleanName}" already exists.`
                });
            }
            const dupCode = duplicates.find(d => d.fy_code.toLowerCase() === cleanCode.toLowerCase());
            if (dupCode) {
                return res.status(409).json({
                    success: false,
                    message: `Financial Year Code "${cleanCode}" already exists.`
                });
            }
        }

        // 2. Strict non-overlapping date validation
        const overlaps = await FinancialYear.checkDateOverlap(userId, start_date, end_date);
        if (overlaps && overlaps.length > 0) {
            const overlapNames = overlaps.map(o => {
                const s = typeof o.start_date === 'string' ? o.start_date.substring(0, 10) : new Date(o.start_date).toISOString().substring(0, 10);
                const e = typeof o.end_date === 'string' ? o.end_date.substring(0, 10) : new Date(o.end_date).toISOString().substring(0, 10);
                return `"${o.fy_name}" (${s} to ${e})`;
            }).join(', ');
            return res.status(400).json({
                success: false,
                message: `The selected date range (${start_date} to ${end_date}) overlaps with existing financial year: ${overlapNames}. Dates must be non-overlapping.`
            });
        }

        const created = await FinancialYear.createFY(userId, {
            fy_name: cleanName,
            fy_code: cleanCode,
            start_date,
            end_date,
            assessment_year: assessment_year ? assessment_year.trim() : null,
            is_active: is_active !== undefined ? is_active : 1,
            is_default: is_default ? 1 : 0,
            is_locked: is_locked ? 1 : 0,
            description: description ? description.trim() : null
        });

        return res.status(201).json({
            success: true,
            message: "Financial year created successfully",
            data: created
        });

    } catch (error) {
        console.error("Error creating financial year:", error);
        return res.status(500).json({ success: false, message: "Failed to create financial year" });
    }
};

// PUT /api/financial-years/:id
exports.updateFinancialYear = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;

        const existing = await FinancialYear.getFYById(id, userId);
        if (!existing) {
            return res.status(404).json({ success: false, message: "Financial year not found" });
        }

        const {
            fy_name,
            fy_code,
            start_date,
            end_date,
            assessment_year,
            is_active,
            is_default,
            is_locked,
            description
        } = req.body;

        const targetStart = start_date || existing.start_date;
        const targetEnd = end_date || existing.end_date;

        if (new Date(targetStart) >= new Date(targetEnd)) {
            return res.status(400).json({ success: false, message: "Start Date must be earlier than End Date" });
        }

        // Check duplicate name / code (excluding current ID)
        if (fy_name || fy_code) {
            const checkName = fy_name ? fy_name.trim() : existing.fy_name;
            const checkCode = fy_code ? fy_code.trim() : existing.fy_code;
            const duplicates = await FinancialYear.checkDuplicate(userId, checkName, checkCode, id);
            if (duplicates && duplicates.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Financial Year name or code already exists for another record."
                });
            }
        }

        // Check non-overlapping dates (excluding current ID)
        if (start_date || end_date) {
            const overlaps = await FinancialYear.checkDateOverlap(userId, targetStart, targetEnd, id);
            if (overlaps && overlaps.length > 0) {
                const overlapNames = overlaps.map(o => {
                    const s = typeof o.start_date === 'string' ? o.start_date.substring(0, 10) : new Date(o.start_date).toISOString().substring(0, 10);
                    const e = typeof o.end_date === 'string' ? o.end_date.substring(0, 10) : new Date(o.end_date).toISOString().substring(0, 10);
                    return `"${o.fy_name}" (${s} to ${e})`;
                }).join(', ');
                return res.status(400).json({
                    success: false,
                    message: `The updated date range overlaps with existing financial year: ${overlapNames}. Dates must be non-overlapping.`
                });
            }
        }

        const updated = await FinancialYear.updateFY(id, userId, {
            fy_name,
            fy_code,
            start_date,
            end_date,
            assessment_year,
            is_active,
            is_default,
            is_locked,
            description
        });

        let newToken = null;
        if (updated && updated.is_default) {
            const user = req.user;
            newToken = generateToken({
                id: user.id,
                business_id: user.business_id || user.id,
                email: user.email,
                role: user.role,
                businessName: user.businessName,
                financialYear: {
                    id: updated.id,
                    fy_name: updated.fy_name,
                    fy_code: updated.fy_code,
                    start_date: updated.start_date,
                    end_date: updated.end_date,
                    assessment_year: updated.assessment_year,
                    is_locked: updated.is_locked
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Financial year updated successfully",
            token: newToken || undefined,
            data: updated,
            financialYear: updated
        });

    } catch (error) {
        console.error("Error updating financial year:", error);
        return res.status(500).json({ success: false, message: "Failed to update financial year" });
    }
};

// POST /api/financial-years/switch-active or PUT /api/financial-years/:id/set-default
exports.switchActiveFinancialYear = async (req, res) => {
    try {
        const userId = getUserId(req);
        const targetId = req.params.id || req.body.financialYearId || req.body.id;

        if (!targetId) {
            return res.status(400).json({ success: false, message: "Financial Year ID is required" });
        }

        const existing = await FinancialYear.getFYById(targetId, userId);
        if (!existing) {
            return res.status(404).json({ success: false, message: "Financial year not found" });
        }

        const activeFY = await FinancialYear.setActiveFY(targetId, userId);

        // Re-generate JWT token with new active FY payload
        const user = req.user;
        const newToken = generateToken({
            id: user.id,
            business_id: user.business_id || user.id,
            email: user.email,
            role: user.role,
            businessName: user.businessName,
            financialYear: {
                id: activeFY.id,
                fy_name: activeFY.fy_name,
                fy_code: activeFY.fy_code,
                start_date: activeFY.start_date,
                end_date: activeFY.end_date,
                assessment_year: activeFY.assessment_year,
                is_locked: activeFY.is_locked
            }
        });

        return res.status(200).json({
            success: true,
            message: `Active financial year switched to ${activeFY.fy_name}`,
            token: newToken,
            financialYear: activeFY
        });

    } catch (error) {
        console.error("Error switching active financial year:", error);
        return res.status(500).json({ success: false, message: "Failed to switch active financial year" });
    }
};

// PATCH /api/financial-years/:id/toggle-lock
exports.toggleLockFinancialYear = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;

        const existing = await FinancialYear.getFYById(id, userId);
        if (!existing) {
            return res.status(404).json({ success: false, message: "Financial year not found" });
        }

        const newLockState = (existing.is_locked === 1 || existing.is_locked === true) ? 0 : 1;
        const updated = await FinancialYear.updateFY(id, userId, { is_locked: newLockState });

        return res.status(200).json({
            success: true,
            message: `Financial Year "${existing.fy_name}" is now ${newLockState ? 'Locked (Closed)' : 'Unlocked (Open)'}`,
            data: updated
        });
    } catch (error) {
        console.error("Error toggling financial year lock:", error);
        return res.status(500).json({ success: false, message: "Failed to toggle financial year lock status" });
    }
};

// DELETE /api/financial-years/:id
exports.deleteFinancialYear = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;

        const existing = await FinancialYear.getFYById(id, userId);
        if (!existing) {
            return res.status(404).json({ success: false, message: "Financial year not found" });
        }

        if (existing.is_default) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete the currently active default financial year. Please set another year as active first."
            });
        }

        await FinancialYear.deleteFY(id, userId);
        return res.status(200).json({
            success: true,
            message: `Financial year "${existing.fy_name}" deleted successfully`
        });

    } catch (error) {
        console.error("Error deleting financial year:", error);
        return res.status(500).json({ success: false, message: "Failed to delete financial year" });
    }
};
