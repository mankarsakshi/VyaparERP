CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,

    business_id INT NOT NULL,

    product_name VARCHAR(150) NOT NULL,
    sku VARCHAR(100) DEFAULT NULL,
    category_id INT DEFAULT NULL,
    unit VARCHAR(50) NOT NULL DEFAULT 'PCS',
    hsn_code VARCHAR(50),
    gst_rate DECIMAL(5,2) DEFAULT 0.00,
    sgst DECIMAL(5,2) DEFAULT 0.00,
    cgst DECIMAL(5,2) DEFAULT 0.00,
    igst DECIMAL(5,2) DEFAULT 0.00,
    purchase_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    selling_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    opening_stock DECIMAL(12,2) DEFAULT 0.00,
    current_stock DECIMAL(12,2) DEFAULT 0.00,
    minimum_stock DECIMAL(12,2) DEFAULT 0.00,
    status ENUM('active', 'inactive') DEFAULT 'active',

    FOREIGN KEY (business_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);