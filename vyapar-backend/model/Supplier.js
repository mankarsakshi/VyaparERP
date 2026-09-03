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

        const finalUserId = Number(user_id) || 1;
        const finalGstin = gstin && String(gstin).trim() ? String(gstin).trim() : null;

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
            finalUserId,
            String(supplier_name || '').trim(),
            phone ? String(phone).trim() : null,
            email ? String(email).trim() : null,
            finalGstin,
            address ? String(address).trim() : '',
            city ? String(city).trim() : '',
            state ? String(state).trim() : '',
            pincode ? String(pincode).trim() : '',
            Number(opening_balance) || 0.00,
            status || "active"
        ]);

        return result.insertId;
    },

    // Check for duplicate supplier by GSTIN constraint
    findDuplicateSupplier: async ({ user_id, gstin, excludeId = null }) => {
        const db = getDB();

        if (!gstin || String(gstin).trim() === "") {
            return null;
        }

        const trimmedGstin = String(gstin).trim();

        let sql = `
            SELECT id, user_id, supplier_name, phone, email, gstin, status
            FROM suppliers
            WHERE LOWER(TRIM(gstin)) = LOWER(TRIM(?))
        `;
        const params = [trimmedGstin];

        if (excludeId) {
            sql += ` AND id != ?`;
            params.push(excludeId);
        }

        sql += ` LIMIT 1`;

        const [rows] = await db.execute(sql, params);
        return rows[0] || null;
    },

    // Get all suppliers stored in the database
    getSuppliers: async (userId, search = '') => {
        const db = getDB();
        let sql = `
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
            WHERE 1=1
        `;
        const params = [];

        if (search && String(search).trim()) {
            sql += ` AND (
                LOWER(supplier_name) LIKE ? OR
                LOWER(phone) LIKE ? OR
                LOWER(email) LIKE ? OR
                LOWER(gstin) LIKE ? OR
                LOWER(city) LIKE ?
            )`;
            const term = `%${String(search).trim().toLowerCase()}%`;
            params.push(term, term, term, term, term);
        }

        sql += ` ORDER BY id DESC`;

        const [rows] = await db.execute(sql, params);
        return rows;
    },

    // Get single supplier by ID
    getSupplierById: async (id) => {
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
            WHERE id = ?
            LIMIT 1
        `;

        const [rows] = await db.execute(sql, [id]);
        return rows[0] || null;
    },

    // Get supplier(s) by Supplier Name
    getSuppliersByName: async (name) => {
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
            WHERE supplier_name LIKE ? OR supplier_name = ?
            ORDER BY id DESC
        `;

        const searchPattern = `%${name}%`;
        const [rows] = await db.execute(sql, [searchPattern, name]);
        return rows;
    },

    // Update existing supplier by ID
    updateSupplier: async (id, supplierData) => {
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

        const finalGstin = gstin !== undefined
            ? (gstin && String(gstin).trim() ? String(gstin).trim() : null)
            : undefined;

        const sql = `
            UPDATE suppliers
            SET
                supplier_name = COALESCE(?, supplier_name),
                phone = COALESCE(?, phone),
                email = COALESCE(?, email),
                gstin = ${finalGstin !== undefined ? '?' : 'gstin'},
                address = COALESCE(?, address),
                city = COALESCE(?, city),
                state = COALESCE(?, state),
                pincode = COALESCE(?, pincode),
                opening_balance = COALESCE(?, opening_balance),
                status = COALESCE(?, status)
            WHERE id = ?
        `;

        const params = [
            supplier_name ? String(supplier_name).trim() : null,
            phone ? String(phone).trim() : null,
            email ? String(email).trim() : null
        ];

        if (finalGstin !== undefined) {
            params.push(finalGstin);
        }

        params.push(
            address !== undefined ? String(address).trim() : null,
            city !== undefined ? String(city).trim() : null,
            state !== undefined ? String(state).trim() : null,
            pincode !== undefined ? String(pincode).trim() : null,
            opening_balance !== undefined ? Number(opening_balance) : null,
            status || null,
            id
        );

        const [result] = await db.execute(sql, params);
        return result.affectedRows > 0;
    },

    // Delete supplier by ID
    deleteSupplier: async (id) => {
        const db = getDB();
        const sql = `
            DELETE FROM suppliers
            WHERE id = ?
        `;

        const [result] = await db.execute(sql, [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Supplier;