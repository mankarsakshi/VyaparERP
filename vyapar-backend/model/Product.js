const { getDB } = require('../database/db');

const Product = {
    createProduct: async (productData) => {
        const db = getDB();
        const {
            business_id,
            product_name,
            sku,
            category_id,
            unit,
            hsn_code,
            gst_rate,
            sgst,
            cgst,
            igst,
            purchase_price,
            selling_price,
            opening_stock,
            current_stock,
            minimum_stock,
            status
        } = productData;

        const finalSku = sku && String(sku).trim()
            ? String(sku).trim()
            : `PROD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

        const openStock = Number(opening_stock) || 0;
        const currStock = current_stock !== undefined && current_stock !== null
            ? Number(current_stock)
            : openStock;

        const sql = `
            INSERT INTO products (
                business_id,
                product_name,
                sku,
                category_id,
                unit,
                hsn_code,
                gst_rate,
                sgst,
                cgst,
                igst,
                purchase_price,
                selling_price,
                opening_stock,
                current_stock,
                minimum_stock,
                status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            business_id,
            product_name,
            finalSku,
            category_id || null,
            unit || 'PCS',
            hsn_code || null,
            gst_rate || 0,
            sgst || 0,
            cgst || 0,
            igst || 0,
            purchase_price || 0,
            selling_price || 0,
            openStock,
            currStock,
            minimum_stock || 0,
            status || 'active'
        ]);

        return result.insertId;
    },

    getProducts: async (businessId, search = '') => {
        const db = getDB();
        let sql = `
            SELECT p.*, COALESCE(c.category_name, 'General') AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        `;
        const params = [];

        if (search && String(search).trim()) {
            sql += ` AND (
                LOWER(p.product_name) LIKE ? OR
                LOWER(p.sku) LIKE ? OR
                LOWER(p.hsn_code) LIKE ? OR
                LOWER(c.category_name) LIKE ?
            )`;
            const term = `%${String(search).trim().toLowerCase()}%`;
            params.push(term, term, term, term);
        }

        sql += ` ORDER BY p.id DESC`;

        const [rows] = await db.query(sql, params);
        return rows;
    },

    getProductById: async (productId, businessId) => {
        const db = getDB();
        const sql = `
            SELECT p.*, COALESCE(c.category_name, 'General') AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `;
        const [rows] = await db.query(sql, [productId]);
        return rows[0] || null;
    },

    updateProduct: async (productId, businessId, productData) => {
        const db = getDB();
        const {
            product_name,
            sku,
            category_id,
            unit,
            hsn_code,
            gst_rate,
            sgst,
            cgst,
            igst,
            purchase_price,
            selling_price,
            opening_stock,
            current_stock,
            minimum_stock,
            status
        } = productData;

        const sql = `
            UPDATE products
            SET product_name = ?,
                sku = COALESCE(?, sku),
                category_id = ?,
                unit = ?,
                hsn_code = ?,
                gst_rate = ?,
                sgst = ?,
                cgst = ?,
                igst = ?,
                purchase_price = ?,
                selling_price = ?,
                opening_stock = COALESCE(?, opening_stock),
                current_stock = COALESCE(?, current_stock),
                minimum_stock = ?,
                status = ?
            WHERE id = ?
        `;

        const [result] = await db.query(sql, [
            product_name,
            sku || null,
            category_id || null,
            unit || 'PCS',
            hsn_code || null,
            gst_rate || 0,
            sgst || 0,
            cgst || 0,
            igst || 0,
            purchase_price || 0,
            selling_price || 0,
            opening_stock !== undefined ? Number(opening_stock) : null,
            current_stock !== undefined ? Number(current_stock) : null,
            minimum_stock || 0,
            status || 'active',
            productId
        ]);

        return result.affectedRows > 0;
    },

    deleteProduct: async (productId, businessId) => {
        const db = getDB();
        const sql = `DELETE FROM products WHERE id = ?`;
        const [result] = await db.query(sql, [productId]);
        return result.affectedRows > 0;
    },

    // Resolves an existing product or creates a new one in the database
    resolveOrCreateProduct: async (connectionOrDb, itemData, businessId) => {
        const executor = connectionOrDb || getDB();
        const bId = Number(businessId) || 1;

        const productId = itemData.product_id || itemData.productId || itemData.id;
        const productName = (
            itemData.product_name ||
            itemData.product ||
            itemData.name ||
            ''
        ).trim();

        // 1. Check by ID if provided and belongs to business
        if (productId) {
            const [rows] = await executor.query(
                `SELECT id, product_name, current_stock FROM products WHERE id = ? AND business_id = ? LIMIT 1`,
                [productId, bId]
            );
            if (rows.length > 0) {
                return rows[0].id;
            }
        }

        // 2. Check by product_name if provided
        if (productName) {
            const [nameRows] = await executor.query(
                `SELECT id, product_name, current_stock FROM products WHERE LOWER(TRIM(product_name)) = LOWER(TRIM(?)) AND business_id = ? LIMIT 1`,
                [productName, bId]
            );
            if (nameRows.length > 0) {
                return nameRows[0].id;
            }
        }

        // 3. Product does not exist -> Create and store in database
        const finalName = productName || 'Default Product';
        const rawSku = itemData.sku || itemData.product_code || itemData.productCode;
        const finalSku = rawSku && String(rawSku).trim()
            ? String(rawSku).trim()
            : `PROD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

        const finalUnit = itemData.unit || 'PCS';
        const finalHsn = (itemData.hsn_code || itemData.hsn || '').trim() || null;
        const rate = Number(itemData.purchase_price ?? itemData.purchasePrice ?? itemData.rate ?? 0);
        const sellPrice = Number(itemData.selling_price ?? itemData.sellingPrice ?? itemData.price ?? 0);
        const gstRate = Number(itemData.tax_rate ?? itemData.gst_rate ?? itemData.gst_percent ?? itemData.gst ?? 0);
        const sgst = Number(itemData.sgst ?? (gstRate > 0 ? gstRate / 2 : 0));
        const cgst = Number(itemData.cgst ?? (gstRate > 0 ? gstRate / 2 : 0));
        const igst = Number(itemData.igst ?? 0);
        const qty = Number(itemData.quantity ?? itemData.qty ?? 0);
        const categoryId = itemData.category_id || itemData.categoryId || null;

        const insertSql = `
            INSERT INTO products (
                business_id,
                product_name,
                sku,
                category_id,
                unit,
                hsn_code,
                gst_rate,
                sgst,
                cgst,
                igst,
                purchase_price,
                selling_price,
                opening_stock,
                current_stock,
                minimum_stock,
                status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await executor.query(insertSql, [
            bId,
            finalName,
            finalSku,
            categoryId,
            finalUnit,
            finalHsn,
            gstRate,
            sgst,
            cgst,
            igst,
            rate,
            sellPrice,
            0,
            qty,
            Number(itemData.minimum_stock ?? itemData.min_stock_alert ?? 0),
            itemData.status || 'active'
        ]);

        return result.insertId;
    }
};

module.exports = Product;