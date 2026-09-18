CREATE TABLE IF NOT EXISTS inventory_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    product_id INT NOT NULL,

    transaction_type ENUM(
        'PURCHASE',
        'SALE',
        'PURCHASE_RETURN',
        'SALES_RETURN',
        'STOCK_ADJUSTMENT',
        'STOCK_TRANSFER',
        'DAMAGE'
    ) NOT NULL,

    reference_type VARCHAR(50) NULL,
    reference_id INT NULL,

    quantity DECIMAL(12,2) NOT NULL,

    stock_before DECIMAL(12,2) NOT NULL,
    stock_after DECIMAL(12,2) NOT NULL,

    notes VARCHAR(255) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id),

    FOREIGN KEY (product_id)
        REFERENCES products(id)
);