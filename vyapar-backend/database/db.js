const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vyapardb'
};

const tableFiles = [
    'users.sql',
    'financial_years.sql',
    'customers.sql',
    'suppliers.sql',
    'categories.sql',
    'units.sql',
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

            let sql = fs.readFileSync(filePath, 'utf8');
            sql = sql.replace(/^\uFEFF/, '');

            if (sql.trim()) {
                await db.query(sql);
                console.log(`${file} executed successfully`);
            }
        }

        console.log('Database initialization completed');

        try {
            await db.query(`ALTER TABLE purchase_orders MODIFY COLUMN status ENUM('Pending', 'Approved', 'Received', 'Cancelled') DEFAULT 'Pending'`);
        } catch (e) {}

        // Migrate financial_years table to new schema
        const migrations = [
            `ALTER TABLE financial_years CHANGE year_name fy_name VARCHAR(50) NOT NULL`,
            `ALTER TABLE financial_years DROP COLUMN is_current`,
            `ALTER TABLE financial_years ADD COLUMN fy_code VARCHAR(20)`,
            `ALTER TABLE financial_years ADD COLUMN assessment_year VARCHAR(20)`,
            `ALTER TABLE financial_years ADD COLUMN is_active BOOLEAN DEFAULT true`,
            `ALTER TABLE financial_years ADD COLUMN is_default BOOLEAN DEFAULT false`,
            `ALTER TABLE financial_years ADD COLUMN is_locked BOOLEAN DEFAULT false`,
            `ALTER TABLE financial_years ADD COLUMN description TEXT`
        ];

        for (const query of migrations) {
            try {
                await db.query(query);
            } catch (e) {
                // Ignore errors (e.g. column already exists)
            }
        }

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