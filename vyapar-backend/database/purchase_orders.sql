CREATE TABLE IF NOT EXISTS purchase_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    supplier_id INT NOT NULL,

    purchase_order_no VARCHAR(50) NOT NULL,

    po_date DATE NOT NULL,

    subtotal DECIMAL(12,2) DEFAULT 0.00,
    discount DECIMAL(12,2) DEFAULT 0.00,
    tax_amount DECIMAL(12,2) DEFAULT 0.00,
    total_amount DECIMAL(12,2) DEFAULT 0.00,

    status ENUM('Pending', 'Received', 'Cancelled') DEFAULT 'Pending',

    notes TEXT,

    document_name VARCHAR(255) NULL,
    document_type VARCHAR(100) NULL,
    document_data LONGBLOB NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),

    UNIQUE KEY unique_user_purchase_order (
        user_id,
        purchase_order_no
    )
);
