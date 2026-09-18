-- Seed Data for vyapardb (3 records per table)

-- 1. Users
INSERT IGNORE INTO users (id, business_name, email, password, role, status, subscription_plan, subscription_status, subscription_start_date, subscription_end_date) VALUES
(1, 'RA Infotech Admin', 'admin@rainfotech.com', '$2b$10$eipUiiP.ACf4FWM7/SwV.uyWMa3ZPS/2j07NTI.w0Dkun0JjtuR0a', 'admin', 'active', 'premium', 'active', '2026-01-01', '2027-01-01'),
(2, 'Vyapar Store 1', 'store1@vyapar.com', '$2b$10$eipUiiP.ACf4FWM7/SwV.uyWMa3ZPS/2j07NTI.w0Dkun0JjtuR0a', 'user', 'active', 'basic', 'active', '2026-01-01', '2026-12-31'),
(3, 'Global Traders', 'info@globaltraders.com', '$2b$10$eipUiiP.ACf4FWM7/SwV.uyWMa3ZPS/2j07NTI.w0Dkun0JjtuR0a', 'user', 'active', 'free', 'inactive', NULL, NULL),
(4, 'Apex Traders & Co', 'user4@vyapar.com', '$2b$10$eipUiiP.ACf4FWM7/SwV.uyWMa3ZPS/2j07NTI.w0Dkun0JjtuR0a', 'user', 'active', 'premium', 'active', '2026-01-01', '2027-01-01');

-- 2. Categories (3 records)
INSERT IGNORE INTO categories (id, business_id, category_name, description, status) VALUES
(1, 1, 'Electronics', 'Electronic devices and hardware accessories', 'active'),
(2, 1, 'Office Supplies', 'General stationery and office paper products', 'active'),
(3, 1, 'Furniture', 'Office chairs, desks, and interior furniture', 'active');

-- 3. Suppliers
INSERT IGNORE INTO suppliers (id, user_id, supplier_name, phone, email, gstin, address, city, state, pincode, opening_balance, status) VALUES
(1, 1, 'ABC Traders', '+91 98765 43210', 'contact@abctraders.com', '27ABCDE1234F1Z5', '123 Business Hub', 'Pune', 'Maharashtra', '411001', 15000.00, 'active'),
(2, 1, 'XYZ Enterprises', '+91 98765 43211', 'info@xyzenterprises.com', '27XYZDE5678G2Z9', '45 Commercial St', 'Mumbai', 'Maharashtra', '400001', 0.00, 'active'),
(3, 1, 'Global Tech Supplies', '+91 98765 43212', 'sales@globaltech.com', '27GBLTS9012H3Z4', '88 Tech Park', 'Bengaluru', 'Karnataka', '560001', 25500.00, 'active'),
(4, 4, 'Reliance Wholesale Mart', '+91 98765 43220', 'contact@reliancewholesale.com', '27RLNWS1111A1Z1', '101 Industrial Estate', 'Pune', 'Maharashtra', '411026', 12000.00, 'active'),
(5, 4, 'Apex Tech Solutions', '+91 98765 43221', 'sales@apextech.com', '27APXTS2222B2Z2', '202 Software Park', 'Mumbai', 'Maharashtra', '400051', 8500.00, 'active'),
(6, 4, 'National Hardware Hub', '+91 98765 43222', 'info@nationalhardware.com', '27NHHHB3333C3Z3', '55 Market Yard', 'Nagpur', 'Maharashtra', '440001', 0.00, 'active'),
(7, 4, 'Metro Components Pvt Ltd', '+91 98765 43223', 'orders@metrocomponents.com', '27MTRCP4444D4Z4', '12 Logistics Zone', 'Thane', 'Maharashtra', '400601', 24000.00, 'active');

-- 4. Products
INSERT IGNORE INTO products (id, business_id, product_name, category_id, unit, hsn_code, gst_rate, sgst, cgst, igst, purchase_price, selling_price, minimum_stock, status) VALUES
(1, 1, 'Laptop i7 16GB', 1, 'PCS', '8471', 18.00, 9.00, 9.00, 0.00, 45000.00, 52000.00, 5.00, 'active'),
(2, 1, 'Wireless Keyboard', 2, 'PCS', '8471', 18.00, 9.00, 9.00, 0.00, 1200.00, 1500.00, 10.00, 'active'),
(3, 1, 'Ergonomic Office Chair', 3, 'PCS', '9401', 18.00, 9.00, 9.00, 0.00, 7500.00, 9500.00, 2.00, 'active'),
(4, 4, 'Dell Latitude Laptop 15"', 1, 'PCS', '8471', 18.00, 9.00, 9.00, 0.00, 48000.00, 56000.00, 5.00, 'active'),
(5, 4, 'Logitech Wireless Mouse', 2, 'PCS', '8471', 18.00, 9.00, 9.00, 0.00, 750.00, 950.00, 15.00, 'active'),
(6, 4, '27" 4K Monitor LED', 1, 'PCS', '8528', 18.00, 9.00, 9.00, 0.00, 19500.00, 23000.00, 3.00, 'active'),
(7, 4, 'USB-C Multiport Hub', 2, 'PCS', '8473', 18.00, 9.00, 9.00, 0.00, 2200.00, 2900.00, 10.00, 'active');

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

-- 7. Units (Seed Records)
INSERT IGNORE INTO units (id, user_id, unit_name, unit_code, description) VALUES
(1, 1, 'Pieces', 'PCS', 'Standard individual piece measurement unit'),
(2, 1, 'Kilograms', 'KG', 'Metric weight measurement in kilograms'),
(3, 4, 'Pieces', 'PCS', 'Standard individual piece measurement unit'),
(4, 4, 'Boxes', 'BOX', 'Bulk packaging box containing multiple items');

