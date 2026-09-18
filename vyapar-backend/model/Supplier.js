const { getDB } = require('../database/db');

const Supplier = {
    // Create new supplier
    createSupplier: async (supplierData) => {
        const db = getDB();
        const {
            user_id,
            supplier_name,
            phone,
            email,
            gstin,
            address,
            city,
            state,
            pincode,
            opening_balance,
            status
        } = supplierData;

        const sql = `
            INSERT INTO suppliers
            (
                user_id,
                supplier_name,
                phone,
                email,
                gstin,
                address,
                city,
                state,
                pincode,
                opening_balance,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(sql, [
            user_id,
            supplier_name,
            phone || null,
            email || null,
            gstin || null,
            address,
            city,
            state,
            pincode,
            opening_balance || 0.00,
            status || "active"
        ]);

        return result.insertId;
    },

    // Check for duplicate supplier for a user by UNIQUE (user_id, gstin) constraint
    findDuplicateSupplier: async ({ user_id, gstin, excludeId = null }) => {
        const db = getDB();

        if (!gstin || gstin.trim() === "") {
            return null;
        }

        const trimmedGstin = gstin.trim();

        let sql = `
            SELECT id, user_id, supplier_name, phone, email, gstin, status
            FROM suppliers
            WHERE user_id = ? AND LOWER(TRIM(gstin)) = LOWER(TRIM(?))
        `;

        const params = [user_id, trimmedGstin];

        if (excludeId) {
            sql += ` AND id != ?`;
            params.push(excludeId);
        }

        sql += ` LIMIT 1`;

        const [rows] = await db.execute(sql, params);
        return rows[0] || null;
    },

    // Get all suppliers for user
    getSuppliers: async (userId) => {
        const db = getDB();
        const sql = `
            SELECT
                id,
                user_id,
                supplier_name,
                supplier_name AS name,
                phone,
                phone AS mobile,
                email,
                gstin,
                address,
                city,
                state,
                pincode,
                opening_balance,
                opening_balance AS openingBalance,
                0.00 AS current_payable,
                0.00 AS currentPayable,
                status,
                created_at,
                updated_at
            FROM suppliers
            WHERE user_id = ?
            ORDER BY id DESC
        `;

        const [rows] = await db.execute(sql, [userId]);
        return rows;
    },

    // Get single supplier by ID
    getSupplierById: async (id, userId) => {
        const db = getDB();
        const sql = `
            SELECT
                id,
                user_id,
                supplier_name,
                supplier_name AS name,
                phone,
                phone AS mobile,
                email,
                gstin,
                address,
                city,
                state,
                pincode,
                opening_balance,
                opening_balance AS openingBalance,
                0.00 AS current_payable,
                0.00 AS currentPayable,
                status,
                created_at,
                updated_at
            FROM suppliers
            WHERE id = ? AND user_id = ?
        `;

        const [rows] = await db.execute(sql, [id, userId]);
        return rows[0] || null;
    },

    // Get supplier(s) by Supplier Name
    getSuppliersByName: async (name, userId) => {
        const db = getDB();
        const sql = `
            SELECT
                id,
                user_id,
                supplier_name,
                supplier_name AS name,
                phone,
                phone AS mobile,
                email,
                gstin,
                address,
                city,
                state,
                pincode,
                opening_balance,
                opening_balance AS openingBalance,
                0.00 AS current_payable,
                0.00 AS currentPayable,
                status,
                created_at,
                updated_at
            FROM suppliers
            WHERE (supplier_name LIKE ? OR supplier_name = ?) AND user_id = ?
            ORDER BY id DESC
        `;

        const searchPattern = `%${name}%`;
        const [rows] = await db.execute(sql, [searchPattern, name, userId]);
        return rows;
    },

    // Update existing supplier by ID
    updateSupplier: async (id, supplierData, userId) => {
        const db = getDB();
        const {
            supplier_name,
            phone,
            email,
            gstin,
            address,
            city,
            state,
            pincode,
            opening_balance,
            status
        } = supplierData;

        const sql = `
            UPDATE suppliers
            SET
                supplier_name = COALESCE(?, supplier_name),
                phone = COALESCE(?, phone),
                email = COALESCE(?, email),
                gstin = COALESCE(?, gstin),
                address = COALESCE(?, address),
                city = COALESCE(?, city),
                state = COALESCE(?, state),
                pincode = COALESCE(?, pincode),
                opening_balance = COALESCE(?, opening_balance),
                status = COALESCE(?, status)
            WHERE id = ? AND user_id = ?
        `;

        const [result] = await db.execute(sql, [
            supplier_name || null,
            phone || null,
            email || null,
            gstin || null,
            address || null,
            city || null,
            state || null,
            pincode || null,
            opening_balance !== undefined ? opening_balance : null,
            status || null,
            id,
            userId
        ]);

        return result.affectedRows > 0;
    },

    // Delete supplier by ID
    deleteSupplier: async (id, userId) => {
        const db = getDB();
        const sql = `
            DELETE FROM suppliers
            WHERE id = ? AND user_id = ?
        `;

        const [result] = await db.execute(sql, [id, userId]);
        return result.affectedRows > 0;
    }
};

module.exports = Supplier;