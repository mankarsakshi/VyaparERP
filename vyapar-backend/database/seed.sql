-- Seed Data for vyapardb (3 records per table)

-- 1. Users (3 records)
INSERT IGNORE INTO users (id, business_name, email, password, role, status, subscription_plan, subscription_status, subscription_start_date, subscription_end_date) VALUES
(1, 'RA Infotech Admin', 'admin@rainfotech.com', '$2b$10$wE9zH8G.Y3kC7bXqM.pZ1e1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o', 'admin', 'active', 'premium', 'active', '2026-01-01', '2027-01-01'),
(2, 'Vyapar Store 1', 'store1@vyapar.com', '$2b$10$wE9zH8G.Y3kC7bXqM.pZ1e1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o', 'user', 'active', 'basic', 'active', '2026-01-01', '2026-12-31'),
(3, 'Global Traders', 'info@globaltraders.com', '$2b$10$wE9zH8G.Y3kC7bXqM.pZ1e1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o', 'user', 'active', 'free', 'inactive', NULL, NULL);

-- 2. Categories (3 records)
INSERT IGNORE INTO categories (id, business_id, category_name, status) VALUES
(1, 1, 'Electronics', 'active'),
(2, 1, 'Office Supplies', 'active'),
(3, 1, 'Furniture', 'active');

-- 3. Suppliers (3 records)
INSERT IGNORE INTO suppliers (id, user_id, supplier_name, phone, email, gstin, address, city, state, pincode, opening_balance, status) VALUES
(1, 1, 'ABC Traders', '+91 98765 43210', 'contact@abctraders.com', '27ABCDE1234F1Z5', '123 Business Hub', 'Pune', 'Maharashtra', '411001', 15000.00, 'active'),
(2, 1, 'XYZ Enterprises', '+91 98765 43211', 'info@xyzenterprises.com', '27XYZDE5678G2Z9', '45 Commercial St', 'Mumbai', 'Maharashtra', '400001', 0.00, 'active'),
(3, 1, 'Global Tech Supplies', '+91 98765 43212', 'sales@globaltech.com', '27GBLTS9012H3Z4', '88 Tech Park', 'Bengaluru', 'Karnataka', '560001', 25500.00, 'active');

-- 4. Products (3 records)
INSERT IGNORE INTO products (id, business_id, product_name, category_id, unit, hsn_code, gst_rate, sgst, cgst, igst, purchase_price, selling_price, minimum_stock, status) VALUES
(1, 1, 'Laptop i7 16GB', 1, 'PCS', '8471', 18.00, 9.00, 9.00, 0.00, 45000.00, 52000.00, 5.00, 'active'),
(2, 1, 'Wireless Keyboard', 2, 'PCS', '8471', 18.00, 9.00, 9.00, 0.00, 1200.00, 1500.00, 10.00, 'active'),
(3, 1, 'Ergonomic Office Chair', 3, 'PCS', '9401', 18.00, 9.00, 9.00, 0.00, 7500.00, 9500.00, 2.00, 'active');

-- 5. Purchase Orders (3 records)
INSERT IGNORE INTO purchase_orders (id, user_id, supplier_id, purchase_order_no, po_date, subtotal, discount, tax_amount, total_amount, status, notes) VALUES
(1, 1, 1, 'PO-20260827-1001', '2026-08-27', 45000.00, 0.00, 8100.00, 53100.00, 'Pending', 'Urgent delivery requested for tech hardware.'),
(2, 1, 2, 'PO-20260827-1002', '2026-08-26', 12000.00, 500.00, 2070.00, 13570.00, 'Received', 'Order completed and items received in stock.'),
(3, 1, 3, 'PO-20260827-1003', '2026-08-25', 22500.00, 0.00, 4050.00, 26550.00, 'Pending', 'Payment terms 30 days credit.');

-- 6. Purchases (3 records)
INSERT IGNORE INTO purchases (id, user_id, supplier_id, purchase_order_id, invoice_number, purchase_date, subtotal, discount, tax_amount, total_amount, payment_status, payment_method, notes) VALUES
(1, 1, 1, 2, 'PUR-20260827-8001', '2026-08-26', 12000.00, 500.00, 2070.00, 13570.00, 'Paid', 'Bank Transfer', 'Fully paid via bank transfer.'),
(2, 1, 2, NULL, 'PUR-20260827-8002', '2026-08-25', 30000.00, 1000.00, 5220.00, 34220.00, 'Partial', 'UPI', 'Partial payment of 15000 made.'),
(3, 1, 3, NULL, 'PUR-20260827-8003', '2026-08-24', 15000.00, 0.00, 2700.00, 17700.00, 'Pending', 'Credit', 'Payment due in 30 days.');
