CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    financial_year_id INT NOT NULL,
    customer_id INT NULL,

    invoice_number VARCHAR(50) NOT NULL,
    sale_date DATE NOT NULL,
    due_date DATE NULL,

    subtotal DECIMAL(12,2) DEFAULT 0.00,
    discount DECIMAL(12,2) DEFAULT 0.00,
    tax_amount DECIMAL(12,2) DEFAULT 0.00,
    freight_charges DECIMAL(12,2) DEFAULT 0.00,
    round_off DECIMAL(12,2) DEFAULT 0.00,
    total_amount DECIMAL(12,2) DEFAULT 0.00,

    paid_amount DECIMAL(12,2) DEFAULT 0.00,
    balance_amount DECIMAL(12,2) DEFAULT 0.00,
    payment_status ENUM('Pending', 'Partial', 'Paid') DEFAULT 'Pending',
    payment_method ENUM('Cash', 'UPI', 'Card', 'Bank Transfer', 'Credit', 'Cheque') DEFAULT 'Cash',

    notes TEXT,
    terms TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (financial_year_id) REFERENCES financial_years(id),

    UNIQUE KEY unique_user_fy_sale_invoice (
        user_id,
        financial_year_id,
        invoice_number
    )
);
