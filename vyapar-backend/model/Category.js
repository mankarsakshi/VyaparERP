const { getDB } = require('../database/db');

const Category = {
    createCategory: async (data) => {
        const db = getDB();
        const { business_id, category_name, description, status } = data;
        const sql = `
            INSERT INTO categories (business_id, category_name, description, status)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [
            business_id,
            category_name,
            description || null,
            status || 'active'
        ]);
        return result.insertId;
    },

    getCategories: async (businessId) => {
        const db = getDB();
        const sql = `
            SELECT id, business_id, category_name, description, status
            FROM categories
            WHERE business_id = ?
            ORDER BY id DESC
        `;
        const [rows] = await db.query(sql, [businessId]);
        return rows;
    },

    getCategoryById: async (id, businessId) => {
        const db = getDB();
        const sql = `
            SELECT id, business_id, category_name, description, status
            FROM categories
            WHERE id = ? AND business_id = ?
        `;
        const [rows] = await db.query(sql, [id, businessId]);
        return rows[0] || null;
    },

    updateCategory: async (id, businessId, data) => {
        const db = getDB();
        const { category_name, description, status } = data;
        const sql = `
            UPDATE categories
            SET category_name = COALESCE(?, category_name),
                description = COALESCE(?, description),
                status = COALESCE(?, status)
            WHERE id = ? AND business_id = ?
        `;
        const [result] = await db.query(sql, [
            category_name || null,
            description !== undefined ? description : null,
            status || null,
            id,
            businessId
        ]);
        return result.affectedRows > 0;
    },

    deleteCategory: async (id, businessId) => {
        const db = getDB();
        const sql = `DELETE FROM categories WHERE id = ? AND business_id = ?`;
        const [result] = await db.query(sql, [id, businessId]);
        return result.affectedRows > 0;
    }
};

module.exports = Category;
