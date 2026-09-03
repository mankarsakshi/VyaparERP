CREATE TABLE IF NOT EXISTS purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    supplier_id INT NOT NULL,
    purchase_order_id INT NULL,

    invoice_number VARCHAR(50) NOT NULL,
    purchase_date DATE NOT NULL,

    subtotal DECIMAL(12,2) DEFAULT 0.00,
    discount DECIMAL(12,2) DEFAULT 0.00,
    tax_amount DECIMAL(12,2) DEFAULT 0.00,
    total_amount DECIMAL(12,2) DEFAULT 0.00,

    payment_status ENUM(
        'Pending',
        'Partial',
        'Paid'
    ) DEFAULT 'Pending',

    payment_method ENUM(
        'Cash',
        'UPI',
        'Card',
        'Bank Transfer',
        'Credit'
    ) DEFAULT 'Credit',

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id),

    FOREIGN KEY (supplier_id)
        REFERENCES suppliers(id),

    FOREIGN KEY (purchase_order_id)
        REFERENCES purchase_orders(id),

    UNIQUE KEY unique_user_invoice (
        user_id,
        invoice_number
    ),

    UNIQUE KEY unique_purchase_order (
        purchase_order_id
    )
);