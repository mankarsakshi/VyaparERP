const { getDB } = require('../database/db');

const Product = {
    createProduct: async (productData) => {
        const db = getDB();
        const {
            business_id,
            product_name,
            category_id,
            unit,
            hsn_code,
            gst_rate,
            sgst,
            cgst,
            igst,
            purchase_price,
            selling_price,
            minimum_stock,
            status
        } = productData;

        const sql = `
            INSERT INTO products (
                business_id,
                product_name,
                category_id,
                unit,
                hsn_code,
                gst_rate,
                sgst,
                cgst,
                igst,
                purchase_price,
                selling_price,
                minimum_stock,
                status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            business_id,
            product_name,
            category_id || null,
            unit || 'PCS',
            hsn_code || null,
            gst_rate || 0,
            sgst || 0,
            cgst || 0,
            igst || 0,
            purchase_price || 0,
            selling_price || 0,
            minimum_stock || 0,
            status || 'active'
        ]);

        return result.insertId;
    },

    getProducts: async (businessId) => {
        const db = getDB();
        const sql = `
            SELECT p.*, c.category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.business_id = ?
            ORDER BY p.id DESC
        `;
        const [rows] = await db.query(sql, [businessId]);
        return rows;
    },

    getProductById: async (productId, businessId) => {
        const db = getDB();
        const sql = `
            SELECT p.*, c.category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ? AND p.business_id = ?
        `;
        const [rows] = await db.query(sql, [productId, businessId]);
        return rows[0] || null;
    },

    updateProduct: async (productId, businessId, productData) => {
        const db = getDB();
        const {
            product_name,
            category_id,
            unit,
            hsn_code,
            gst_rate,
            sgst,
            cgst,
            igst,
            purchase_price,
            selling_price,
            minimum_stock,
            status
        } = productData;

        const sql = `
            UPDATE products
            SET product_name = ?,
                category_id = ?,
                unit = ?,
                hsn_code = ?,
                gst_rate = ?,
                sgst = ?,
                cgst = ?,
                igst = ?,
                purchase_price = ?,
                selling_price = ?,
                minimum_stock = ?,
                status = ?
            WHERE id = ? AND business_id = ?
        `;

        const [result] = await db.query(sql, [
            product_name,
            category_id || null,
            unit || 'PCS',
            hsn_code || null,
            gst_rate || 0,
            sgst || 0,
            cgst || 0,
            igst || 0,
            purchase_price || 0,
            selling_price || 0,
            minimum_stock || 0,
            status || 'active',
            productId,
            businessId
        ]);

        return result.affectedRows > 0;
    },

    deleteProduct: async (productId, businessId) => {
        const db = getDB();
        const sql = `DELETE FROM products WHERE id = ? AND business_id = ?`;
        const [result] = await db.query(sql, [productId, businessId]);
        return result.affectedRows > 0;
    }
};

module.exports = Product;