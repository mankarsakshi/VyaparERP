CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,

    business_id INT NOT NULL,

    category_name VARCHAR(100) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,

    status ENUM('active', 'inactive') DEFAULT 'active',

    FOREIGN KEY (business_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE (business_id, category_name)
);