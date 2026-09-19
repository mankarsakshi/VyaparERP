const { getDB } = require('../database/db');

// Create Customer
const createCustomer = async (customerData) => {
    const db = getDB();
    const sql = `
        INSERT INTO customers (
            user_id,
            customer_name,
            phone,
            email,
            gstin,
            address,
            city,
            state,
            pincode,
            opening_balance,
            status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        customerData.user_id,
        customerData.customer_name,
        customerData.phone || null,
        customerData.email || null,
        customerData.gstin ? customerData.gstin.trim().toUpperCase() : null,
        customerData.address || null,
        customerData.city || null,
        customerData.state || 'Maharashtra',
        customerData.pincode || null,
        Number(customerData.opening_balance) || 0.00,
        customerData.status || 'active'
    ];

    const [result] = await db.query(sql, values);
    return result.insertId;
};

// Get All Customers for a user
const getCustomers = async (userId, search = null) => {
    const db = getDB();
    let sql = `
        SELECT
            id,
            user_id,
            customer_name,
            phone,
            email,
            gstin,
            address,
            city,
            state,
            pincode,
            opening_balance,
            status,
            created_at,
            updated_at
        FROM customers
        WHERE user_id = ?
    `;

    const params = [userId];

    if (search && search.trim()) {
        const pattern = `%${search.trim()}%`;
        sql += ` AND (customer_name LIKE ? OR phone LIKE ? OR email LIKE ? OR gstin LIKE ?)`;
        params.push(pattern, pattern, pattern, pattern);
    }

    sql += ` ORDER BY id DESC`;

    const [rows] = await db.query(sql, params);
    return rows;
};

// Get Single Customer by ID
const getCustomerById = async (id, userId) => {
    const db = getDB();
    const sql = `
        SELECT
            id,
            user_id,
            customer_name,
            phone,
            email,
            gstin,
            address,
            city,
            state,
            pincode,
            opening_balance,
            status,
            created_at,
            updated_at
        FROM customers
        WHERE id = ? AND user_id = ?
    `;
    const [rows] = await db.query(sql, [id, userId]);
    return rows.length > 0 ? rows[0] : null;
};

// Update Customer
const updateCustomer = async (id, customerData, userId) => {
    const db = getDB();
    const sql = `
        UPDATE customers
        SET
            customer_name = ?,
            phone = ?,
            email = ?,
            gstin = ?,
            address = ?,
            city = ?,
            state = ?,
            pincode = ?,
            opening_balance = ?,
            status = ?
        WHERE id = ? AND user_id = ?
    `;

    const values = [
        customerData.customer_name,
        customerData.phone || null,
        customerData.email || null,
        customerData.gstin ? customerData.gstin.trim().toUpperCase() : null,
        customerData.address || null,
        customerData.city || null,
        customerData.state || 'Maharashtra',
        customerData.pincode || null,
        Number(customerData.opening_balance) || 0.00,
        customerData.status || 'active',
        id,
        userId
    ];

    const [result] = await db.query(sql, values);
    return result.affectedRows > 0;
};

// Delete Customer
const deleteCustomer = async (id, userId) => {
    const db = getDB();
    const sql = `DELETE FROM customers WHERE id = ? AND user_id = ?`;
    const [result] = await db.query(sql, [id, userId]);
    return result.affectedRows > 0;
};

// Find Duplicate
const findDuplicateCustomer = async ({ user_id, gstin, phone }) => {
    const db = getDB();
    if (gstin && gstin.trim()) {
        const [rows] = await db.query(
            'SELECT * FROM customers WHERE user_id = ? AND gstin = ? LIMIT 1',
            [user_id, gstin.trim().toUpperCase()]
        );
        if (rows.length > 0) return rows[0];
    }
    if (phone && phone.trim()) {
        const [rows] = await db.query(
            'SELECT * FROM customers WHERE user_id = ? AND phone = ? LIMIT 1',
            [user_id, phone.trim()]
        );
        if (rows.length > 0) return rows[0];
    }
    return null;
};

module.exports = {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    findDuplicateCustomer
};
