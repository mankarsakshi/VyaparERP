const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
    database: process.env.DB_NAME || 'vyapardb',
    port: Number(process.env.DB_PORT) || 3306
};

const tableFiles = [
    'users.sql',
    'customers.sql',
    'suppliers.sql',
    'categories.sql',
    'products.sql',

    'purchase_order_sequences.sql',
    'purchase_orders.sql',
    'purchase_order_items.sql',

    'sales.sql',
    'sale_items.sql',

    'purchases.sql',
    'purchase_items.sql',

    // Inventory
    'inventory_transactions.sql',

    'expenses.sql',
    'payments.sql',

    'seed.sql'
];

let db = null;

async function ensureProductColumns(pool) {
    try {
        const [columns] = await pool.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products'
        `, [dbConfig.database]);

        const columnNames = columns.map(c => (c.COLUMN_NAME || c.column_name || '').toLowerCase());

        if (!columnNames.includes('sku')) {
            await pool.query(`ALTER TABLE products ADD COLUMN sku VARCHAR(100) DEFAULT NULL AFTER product_name`);
            console.log('Added sku column to products table');
        }
        if (!columnNames.includes('opening_stock')) {
            await pool.query(`ALTER TABLE products ADD COLUMN opening_stock DECIMAL(12,2) DEFAULT 0.00 AFTER selling_price`);
            console.log('Added opening_stock column to products table');
        }
        if (!columnNames.includes('current_stock')) {
            await pool.query(`ALTER TABLE products ADD COLUMN current_stock DECIMAL(12,2) DEFAULT 0.00 AFTER opening_stock`);
            console.log('Added current_stock column to products table');
        }

        const [catCols] = await pool.query(`
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'categories'
        `, [dbConfig.database]);
        const catColNames = catCols.map(c => (c.COLUMN_NAME || c.column_name || '').toLowerCase());
        if (!catColNames.includes('description')) {
            await pool.query(`ALTER TABLE categories ADD COLUMN description VARCHAR(255) DEFAULT NULL AFTER category_name`);
            console.log('Added description column to categories table');
        }

        // Ensure suppliers table columns allow NULL or default values so optional form fields never fail
        try {
            await pool.query(`
                ALTER TABLE suppliers
                MODIFY COLUMN address TEXT NULL DEFAULT NULL,
                MODIFY COLUMN city VARCHAR(100) NULL DEFAULT NULL,
                MODIFY COLUMN state VARCHAR(100) NULL DEFAULT NULL,
                MODIFY COLUMN pincode VARCHAR(20) NULL DEFAULT NULL
            `);
        } catch (suppErr) {
            console.warn('Suppliers schema alter notice:', suppErr.message);
        }

        // Ensure default user 1 exists in users table for FK integrity
        try {
            await pool.query(`
                INSERT IGNORE INTO users (id, business_name, email, password, role, status)
                VALUES (1, 'RA Infotech Admin', 'admin@rainfotech.com', '$2b$10$wE9zH8G.Y3kC7bXqM.pZ1e1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o', 'admin', 'active')
            `);
        } catch (uErr) {
            console.warn('Default user check notice:', uErr.message);
        }
    } catch (e) {
        console.warn('ensureProductColumns warning:', e.message);
    }
}

async function initializeDatabase() {
    let connection;

    try {
        // Connect to MySQL server first
        connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });

        // Create database if it does not exist
        await connection.query(
            `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``
        );

        await connection.end();
        connection = null;

        // Connect to the database
        db = await mysql.createPool({
            ...dbConfig,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            multipleStatements: true
        });

        console.log('MySQL database connected');

        // Execute SQL files
        for (const file of tableFiles) {
            const filePath = path.join(__dirname, file);

            if (!fs.existsSync(filePath)) {
                console.warn(`${file} not found. Skipping...`);
                continue;
            }

            const sql = fs.readFileSync(filePath, 'utf8');

            if (sql.trim()) {
                await db.query(sql);
                console.log(`${file} executed successfully`);
            }
        }

        // Ensure critical columns exist in products table
        await ensureProductColumns(db);

        console.log('Database initialization completed');

        return db;

    } catch (error) {
        console.error(
            'Database initialization failed:',
            error
        );

        if (connection) {
            await connection.end();
        }

        throw error;
    }
}

function getDB() {
    if (!db) {
        throw new Error(
            'Database has not been initialized yet'
        );
    }

    return db;
}

module.exports = {
    initializeDatabase,
    getDB
};