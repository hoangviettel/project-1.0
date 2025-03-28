-- Tạo database
CREATE DATABASE ecommerce_platform
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE ecommerce_platform;

-- Bảng customers (Tài khoản khách hàng)
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    birth_date DATE,
    gender ENUM('Nam', 'Nữ'),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bảng users (Tài khoản hệ thống - admin/staff)
CREATE TABLE users (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    birth_date DATE,
    gender ENUM('Nam', 'Nữ'),
    phone VARCHAR(20),
    address TEXT,
    role ENUM('admin', 'staff') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--
-- Bảng payment_methods (Phương thức thanh toán)
CREATE TABLE payment_methods (
    method_id INT AUTO_INCREMENT PRIMARY KEY,
    method_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--
-- Bảng categories (Danh mục sản phẩm)
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--
-- Bảng brands (Thương hiệu)
CREATE TABLE brands (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--
-- Bảng products (Sản phẩm)
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    brand_id INT,
    category_id INT,
    price DECIMAL(12, 2) NOT NULL,
    discount_price DECIMAL(12, 2) DEFAULT NULL,
    description TEXT,
    specifications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--
-- Bảng product_images (Hình ảnh sản phẩm)
CREATE TABLE product_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--
-- Bảng shipping_method (Phương thức vận chuyển)
CREATE TABLE shipping_methods (
    shipping_method_id INT AUTO_INCREMENT PRIMARY KEY,
    method_name VARCHAR(50) NOT NULL,
    cost DECIMAL(12, 2) NOT NULL,
    estimated_delivery_time INT, -- Thời gian dự kiến (ngày)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng orders (Đơn hàng - Thay ENUM bằng khóa ngoại)
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    staff_id INT,
    total_amount DECIMAL(12, 2) NOT NULL,
    order_status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
	shipping_method_id INT,
    shipping_address TEXT NOT NULL,
    method_id INT NOT NULL, -- Thay ENUM bằng khóa ngoại
    payment_status ENUM('Unpaid', 'Paid', 'Failed') DEFAULT 'Unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (staff_id) REFERENCES users(account_id),
    FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(shipping_method_id),
    FOREIGN KEY (method_id) REFERENCES payment_methods(method_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--
-- Bảng order_details (Chi tiết đơn hàng)
CREATE TABLE order_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    warehouse_id INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--
-- Bảng carts (Giỏ hàng)
CREATE TABLE carts (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--
-- Bảng cart_items (Sản phẩm trong giỏ hàng)
CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT,
    product_id INT,
    quantity INT NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bảng reviews (Đánh giá sản phẩm)
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    product_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bảng suppliers (Nhà cung cấp)
CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL UNIQUE,
    contact_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bảng import_invoices (Hóa đơn nhập hàng)
CREATE TABLE import_invoices (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT,
    staff_id INT,
    total_amount DECIMAL(12, 2) NOT NULL,
    invoice_date DATETIME NOT NULL,
    warehouse_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    FOREIGN KEY (staff_id) REFERENCES users(account_id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bảng import_invoice_details (Chi tiết hóa đơn nhập)
CREATE TABLE import_invoice_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES import_invoices(invoice_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bảng warehouses (Kho hàng)
CREATE TABLE warehouses (
    warehouse_id INT AUTO_INCREMENT PRIMARY KEY,
    warehouse_name VARCHAR(100) NOT NULL,
    location TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bảng inventory (Quản lý tồn kho)
CREATE TABLE inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    warehouse_id INT,
    stock INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id),
    UNIQUE (product_id, warehouse_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bảng promotions (Khuyến mãi)
CREATE TABLE promotions (
    promotion_id INT AUTO_INCREMENT PRIMARY KEY,
    promotion_code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    discount_type ENUM('Percentage', 'Fixed') NOT NULL,
    discount_value DECIMAL(12, 2) NOT NULL,
    min_order_value DECIMAL(12, 2) DEFAULT 0,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bảng order_promotions (Liên kết khuyến mãi với đơn hàng)
CREATE TABLE order_promotions (
    order_promotion_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    promotion_id INT,
    applied_discount DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (promotion_id) REFERENCES promotions(promotion_id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    method_id INT,
    amount DECIMAL(12, 2) NOT NULL,
    transaction_status ENUM('Pending', 'Success', 'Failed') DEFAULT 'Pending',
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_code VARCHAR(100), -- Mã giao dịch từ cổng thanh toán
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (method_id) REFERENCES payment_methods(method_id)
);

CREATE TABLE refresh_tokens (
    user_id INT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(account_id)
);
