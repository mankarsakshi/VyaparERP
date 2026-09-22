CREATE TABLE IF NOT EXISTS financial_years (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    fy_name VARCHAR(50) NOT NULL,
    fy_code VARCHAR(20),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    assessment_year VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);