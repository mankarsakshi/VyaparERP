CREATE TABLE IF NOT EXISTS purchase_items (
    id INT AUTO_INCREMENT PRIMARY KEY,

    purchase_id INT NOT NULL,
    product_id INT NOT NULL,

    quantity DECIMAL(12,2) NOT NULL,
    purchase_price DECIMAL(12,2) NOT NULL,

    discount DECIMAL(12,2) DEFAULT 0.00,
    tax_rate DECIMAL(5,2) DEFAULT 0.00,
    tax_amount DECIMAL(12,2) DEFAULT 0.00,

    total_amount DECIMAL(12,2) DEFAULT 0.00,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (purchase_id) REFERENCES purchases(id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id) REFERENCES products(id)
);