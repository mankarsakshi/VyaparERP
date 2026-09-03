CREATE TABLE IF NOT EXISTS purchase_order_sequences (
    user_id INT PRIMARY KEY,
    last_number INT NOT NULL DEFAULT 0,

    FOREIGN KEY (user_id) REFERENCES users(id)
);