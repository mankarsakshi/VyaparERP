const { getDB } = require('../database/db');

const Unit = {
    createUnit: async (data) => {
        const db = getDB();
        const { user_id, unit_name, unit_code, description } = data;
        const sql = `
            INSERT INTO units (user_id, unit_name, unit_code, description)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [
            user_id,
            unit_name,
            unit_code,
            description || null
        ]);
        return result.insertId;
    },

    getUnits: async (userId) => {
        const db = getDB();
        const sql = `
            SELECT id, user_id, unit_name, unit_code, description, created_at, updated_at
            FROM units
            WHERE user_id = ?
            ORDER BY id DESC
        `;
        const [rows] = await db.query(sql, [userId]);
        return rows;
    },

    getUnitById: async (id, userId) => {
        const db = getDB();
        const sql = `
            SELECT id, user_id, unit_name, unit_code, description, created_at, updated_at
            FROM units
            WHERE id = ? AND user_id = ?
        `;
        const [rows] = await db.query(sql, [id, userId]);
        return rows[0] || null;
    },

    updateUnit: async (id, userId, data) => {
        const db = getDB();
        const { unit_name, unit_code, description } = data;
        const sql = `
            UPDATE units
            SET unit_name = COALESCE(?, unit_name),
                unit_code = COALESCE(?, unit_code),
                description = ?
            WHERE id = ? AND user_id = ?
        `;
        const [result] = await db.query(sql, [
            unit_name !== undefined ? unit_name : null,
            unit_code !== undefined ? unit_code : null,
            description !== undefined ? description : null,
            id,
            userId
        ]);
        return result.affectedRows > 0;
    },

    deleteUnit: async (id, userId) => {
        const db = getDB();
        const sql = `DELETE FROM units WHERE id = ? AND user_id = ?`;
        const [result] = await db.query(sql, [id, userId]);
        return result.affectedRows > 0;
    },

    checkDuplicate: async (userId, unitName, unitCode, excludeId = null) => {
        const db = getDB();
        let sql = `
            SELECT id, unit_name, unit_code
            FROM units
            WHERE user_id = ? AND (LOWER(unit_name) = LOWER(?) OR LOWER(unit_code) = LOWER(?))
        `;
        const params = [userId, unitName ? unitName.trim() : '', unitCode ? unitCode.trim() : ''];
        if (excludeId) {
            sql += ` AND id != ?`;
            params.push(excludeId);
        }
        const [rows] = await db.query(sql, params);
        return rows;
    }
};

module.exports = Unit;
