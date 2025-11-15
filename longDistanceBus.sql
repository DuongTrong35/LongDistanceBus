-- ============================================
-- Long Distance Bus Database Schema
-- MySQL Database Setup Script
-- Dựa trên database hiện có trong MySQL
-- ============================================

-- Tạo database nếu chưa có
CREATE DATABASE IF NOT EXISTS longdistancebus 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE longdistancebus;

-- ============================================
-- DATABASE 1: USERDB (User Service)
-- ============================================

-- Tạo userdb nếu chưa có
CREATE DATABASE IF NOT EXISTS userdb 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE userdb;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT uk_roles_name UNIQUE (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) 
        REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default roles
INSERT INTO roles(name) VALUES ('USER'), ('ADMIN')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================
-- DATABASE 2: LONGDISTANCEBUS (Booking & Staff Services)
-- ============================================

USE longdistancebus;

-- Operators table (Nhà xe) - Đã cập nhật thêm các trường cần thiết
CREATE TABLE IF NOT EXISTS operators (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    hotline VARCHAR(30),
    address VARCHAR(255),
    description TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_operators_name UNIQUE (name),
    INDEX idx_operators_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stations table (Bến xe)
CREATE TABLE IF NOT EXISTS stations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    city VARCHAR(120) NOT NULL,
    address VARCHAR(255),
    INDEX idx_stations_city (city),
    INDEX idx_stations_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Routes table (Tuyến đường)
CREATE TABLE IF NOT EXISTS routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_station_id BIGINT NOT NULL,
    to_station_id BIGINT NOT NULL,
    distance_km INT,
    CONSTRAINT fk_routes_from_station FOREIGN KEY (from_station_id) 
        REFERENCES stations(id) ON DELETE RESTRICT,
    CONSTRAINT fk_routes_to_station FOREIGN KEY (to_station_id) 
        REFERENCES stations(id) ON DELETE RESTRICT,
    INDEX idx_routes_from_station (from_station_id),
    INDEX idx_routes_to_station (to_station_id),
    CONSTRAINT uk_routes_unique UNIQUE (from_station_id, to_station_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Buses table (Xe khách)
CREATE TABLE IF NOT EXISTS buses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    plate VARCHAR(25) NOT NULL,
    seat_count INT,
    CONSTRAINT uk_buses_plate UNIQUE (plate),
    INDEX idx_buses_plate (plate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seats table (Ghế ngồi)
CREATE TABLE IF NOT EXISTS seats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_id BIGINT NOT NULL,
    code VARCHAR(10) NOT NULL,
    type VARCHAR(50),
    CONSTRAINT fk_seats_bus FOREIGN KEY (bus_id) 
        REFERENCES buses(id) ON DELETE CASCADE,
    INDEX idx_seats_bus_id (bus_id),
    INDEX idx_seats_code (code),
    CONSTRAINT uk_seats_bus_code UNIQUE (bus_id, code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Trips table (Chuyến đi)
CREATE TABLE IF NOT EXISTS trips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT NOT NULL,
    bus_id BIGINT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price INT,
    seats_total INT,
    seats_booked INT DEFAULT 0,
    CONSTRAINT fk_trips_route FOREIGN KEY (route_id) 
        REFERENCES routes(id) ON DELETE RESTRICT,
    CONSTRAINT fk_trips_bus FOREIGN KEY (bus_id) 
        REFERENCES buses(id) ON DELETE RESTRICT,
    INDEX idx_trips_route_id (route_id),
    INDEX idx_trips_bus_id (bus_id),
    INDEX idx_trips_departure_time (departure_time),
    INDEX idx_trips_arrival_time (arrival_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Employee table (Nhân viên)
CREATE TABLE IF NOT EXISTS employee (
    id VARCHAR(255) PRIMARY KEY,
    userid INT NOT NULL,
    honv VARCHAR(100),
    tennv VARCHAR(100),
    gioitinh VARCHAR(10),
    ngaysinh DATE,
    cmnd VARCHAR(20),
    sdt VARCHAR(20),
    email VARCHAR(255),
    ngayvaolam DATE,
    chucvu VARCHAR(100),
    tinhtrang INT DEFAULT 1,
    INDEX idx_employee_userid (userid),
    INDEX idx_employee_email (email),
    INDEX idx_employee_cmnd (cmnd)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SAMPLE DATA (Optional)
-- ============================================

-- Insert sample stations
INSERT INTO stations(name, city, address) VALUES
    ('Bến xe Miền Tây', 'Ho Chi Minh', '395 Kinh Dương Vương, An Lạc, Bình Tân, TP.HCM'),
    ('Bến xe Miền Đông', 'Ho Chi Minh', '292 Đinh Bộ Lĩnh, Bình Thạnh, TP.HCM'),
    ('Bến xe An Sương', 'Ho Chi Minh', 'Quốc lộ 22, An Sương, Hóc Môn, TP.HCM'),
    ('Bến xe Đà Nẵng', 'Da Nang', 'Tôn Đức Thắng, Hải Châu, Đà Nẵng'),
    ('Bến xe Miền Bắc', 'Ha Noi', 'Gia Lâm, Long Biên, Hà Nội'),
    ('Bến xe Nước Ngầm', 'Ha Noi', 'Nguyễn Hoàng Tôn, Tây Mỗ, Nam Từ Liêm, Hà Nội')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert sample operators
INSERT INTO operators(name, hotline) VALUES
    ('Xe khách Phương Trang', '1900.6067'),
    ('Xe khách Hoàng Long', '1900.6268'),
    ('Xe khách Mai Linh', '1900.6066'),
    ('Xe khách Phúc Xuyên', '1900.9112')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Kiểm tra tables trong userdb
USE userdb;
SHOW TABLES;

-- Kiểm tra tables trong longdistancebus
USE longdistancebus;
SHOW TABLES;

-- ============================================
-- LƯU Ý
-- ============================================
-- 1. File này được tạo dựa trên các entity classes trong code
-- 2. Database structure:
--    - userdb: Dùng cho user-service
--    - longdistancebus: Dùng cho booking-service và staff-service
-- 3. Sử dụng CREATE TABLE IF NOT EXISTS để tránh lỗi nếu bảng đã tồn tại
-- 4. Nếu database đã có sẵn, hãy so sánh với cấu trúc hiện tại

