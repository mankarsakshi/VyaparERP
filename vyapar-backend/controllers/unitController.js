const Unit = require('../model/Unit');

const getUserId = (req) => {
    return req.user?.id || req.user?.business_id;
};

exports.createUnit = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const { unit_name, unit_code, description } = req.body;

        if (!unit_name || !unit_name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Unit name is required"
            });
        }

        if (!unit_code || !unit_code.trim()) {
            return res.status(400).json({
                success: false,
                message: "Unit code is required (e.g. PCS, KG, BOX)"
            });
        }

        const trimmedName = unit_name.trim();
        const trimmedCode = unit_code.trim().toUpperCase();

        // Check if unit name or unit code already exists for this user
        const duplicates = await Unit.checkDuplicate(userId, trimmedName, trimmedCode);
        if (duplicates && duplicates.length > 0) {
            const dupName = duplicates.find(d => d.unit_name.toLowerCase() === trimmedName.toLowerCase());
            if (dupName) {
                return res.status(409).json({
                    success: false,
                    message: `Cannot save unit because Unit Name "${trimmedName}" already exists.`
                });
            }
            const dupCode = duplicates.find(d => d.unit_code.toUpperCase() === trimmedCode);
            if (dupCode) {
                return res.status(409).json({
                    success: false,
                    message: `Cannot save unit because Unit Code "${trimmedCode}" already exists.`
                });
            }
            return res.status(409).json({
                success: false,
                message: "Cannot save unit because it already exists."
            });
        }

        const id = await Unit.createUnit({
            user_id: userId,
            unit_name: trimmedName,
            unit_code: trimmedCode,
            description: description ? description.trim() : null
        });

        return res.status(201).json({
            success: true,
            message: "Unit created successfully",
            data: {
                id,
                unit_name: trimmedName,
                unit_code: trimmedCode,
                description: description ? description.trim() : null
            }
        });
    } catch (error) {
        console.error("Create Unit Error:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: "Cannot save unit because a unit with this name or code already exists."
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create unit"
        });
    }
};

exports.getUnits = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const units = await Unit.getUnits(userId);
        return res.status(200).json({
            success: true,
            count: units.length,
            data: units
        });
    } catch (error) {
        console.error("Get Units Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch units"
        });
    }
};

exports.getUnitById = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const unit = await Unit.getUnitById(req.params.id, userId);
        if (!unit) {
            return res.status(404).json({
                success: false,
                message: "Unit not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: unit
        });
    } catch (error) {
        console.error("Get Unit By ID Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch unit"
        });
    }
};

exports.updateUnit = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const { unit_name, unit_code, description } = req.body;
        const updateData = {};
        if (unit_name !== undefined) updateData.unit_name = unit_name.trim();
        if (unit_code !== undefined) updateData.unit_code = unit_code.trim().toUpperCase();
        if (description !== undefined) updateData.description = description ? description.trim() : null;

        // Check if updating to an already existing name or code
        if (updateData.unit_name || updateData.unit_code) {
            const duplicates = await Unit.checkDuplicate(
                userId,
                updateData.unit_name || '',
                updateData.unit_code || '',
                req.params.id
            );
            if (duplicates && duplicates.length > 0) {
                if (updateData.unit_name && duplicates.some(d => d.unit_name.toLowerCase() === updateData.unit_name.toLowerCase())) {
                    return res.status(409).json({
                        success: false,
                        message: `Cannot save unit because Unit Name "${updateData.unit_name}" already exists.`
                    });
                }
                if (updateData.unit_code && duplicates.some(d => d.unit_code.toUpperCase() === updateData.unit_code.toUpperCase())) {
                    return res.status(409).json({
                        success: false,
                        message: `Cannot save unit because Unit Code "${updateData.unit_code}" already exists.`
                    });
                }
                return res.status(409).json({
                    success: false,
                    message: "Cannot save unit because it already exists."
                });
            }
        }

        const updated = await Unit.updateUnit(req.params.id, userId, updateData);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Unit not found or no changes made"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Unit updated successfully"
        });
    } catch (error) {
        console.error("Update Unit Error:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: "Cannot save unit because a unit with this name or code already exists."
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update unit"
        });
    }
};

exports.deleteUnit = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const deleted = await Unit.deleteUnit(req.params.id, userId);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Unit not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Unit deleted successfully"
        });
    } catch (error) {
        console.error("Delete Unit Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete unit"
        });
    }
};
