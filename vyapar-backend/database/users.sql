CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    business_name VARCHAR(150) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',

    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',

    subscription_plan ENUM('free', 'basic', 'premium') NOT NULL DEFAULT 'free',

    subscription_status ENUM('active', 'inactive', 'expired', 'cancelled') NOT NULL DEFAULT 'inactive',

    subscription_start_date DATE NULL,

    subscription_end_date DATE NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);