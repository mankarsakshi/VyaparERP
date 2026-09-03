const { getDB } = require('../database/db');

const Category = {
    getCategories: async (businessId, search = '') => {
        const db = getDB();
        let sql = `
            SELECT id, business_id, category_name, description, status
            FROM categories
            WHERE 1=1
        `;
        const params = [];

        if (search && String(search).trim()) {
            sql += ` AND (LOWER(category_name) LIKE ? OR LOWER(description) LIKE ?)`;
            const term = `%${String(search).trim().toLowerCase()}%`;
            params.push(term, term);
        }

        sql += ` ORDER BY id DESC`;

        const [rows] = await db.query(sql, params);
        return rows;
    },

    getCategoryById: async (id) => {
        const db = getDB();
        const sql = `
            SELECT id, business_id, category_name, description, status
            FROM categories
            WHERE id = ?
            LIMIT 1
        `;
        const [rows] = await db.query(sql, [id]);
        return rows[0] || null;
    },

    createCategory: async (categoryData) => {
        const db = getDB();
        const {
            business_id,
            category_name,
            description,
            status
        } = categoryData;

        const bId = Number(business_id) || 1;
        const name = String(category_name || '').trim();

        // Check if category already exists
        const [existing] = await db.query(
            `SELECT id FROM categories WHERE LOWER(TRIM(category_name)) = LOWER(?) LIMIT 1`,
            [name]
        );

        if (existing.length > 0) {
            if (description) {
                await db.query(
                    `UPDATE categories SET description = COALESCE(?, description), status = 'active' WHERE id = ?`,
                    [String(description).trim(), existing[0].id]
                );
            }
            return existing[0].id;
        }

        const sql = `
            INSERT INTO categories (
                business_id,
                category_name,
                description,
                status
            ) VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            bId,
            name,
            description ? String(description).trim() : null,
            status || 'active'
        ]);

        return result.insertId;
    },

    updateCategory: async (id, businessId, categoryData) => {
        const db = getDB();
        const {
            category_name,
            description,
            status
        } = categoryData;

        const sql = `
            UPDATE categories
            SET category_name = COALESCE(?, category_name),
                description = COALESCE(?, description),
                status = COALESCE(?, status)
            WHERE id = ?
        `;

        const [result] = await db.query(sql, [
            category_name ? String(category_name).trim() : null,
            description !== undefined ? (description ? String(description).trim() : null) : null,
            status || null,
            id
        ]);

        return result.affectedRows > 0;
    },

    deleteCategory: async (id) => {
        const db = getDB();
        const sql = `DELETE FROM categories WHERE id = ?`;
        const [result] = await db.query(sql, [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Category;
