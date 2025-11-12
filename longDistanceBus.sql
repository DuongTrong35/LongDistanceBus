CREATE DATABASE IF NOT EXISTS longdistancebus;
USE longdistancebus;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS fares;
DROP TABLE IF EXISTS seats;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS buses;
DROP TABLE IF EXISTS routes;
DROP TABLE IF EXISTS seat_types;
DROP TABLE IF EXISTS operators;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS promotion;
DROP TABLE IF EXISTS stop;
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS permission;
DROP TABLE IF EXISTS functions;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS supportchat;
DROP TABLE IF EXISTS functionpermission;
DROP TABLE IF EXISTS ticket;
DROP TABLE IF EXISTS paymentdetails;

SET FOREIGN_KEY_CHECKS = 1;

-- ===========================
-- BẢNG DANH MỤC CƠ BẢN
-- ===========================

CREATE TABLE operators (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    hotline VARCHAR(30),
    address VARCHAR(255),
    city VARCHAR(120),
    email VARCHAR(120),
    website VARCHAR(120),
    logo_url VARCHAR(255),
    description TEXT,
    average_rating DECIMAL(3,1),
    review_count INT DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE seat_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(80) NOT NULL,
    description VARCHAR(255),
    base_price INT
) ENGINE=InnoDB;

CREATE TABLE stations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    city VARCHAR(120) NOT NULL,
    address VARCHAR(255),
    INDEX idx_station_city (city),
    INDEX idx_station_name (name)
) ENGINE=InnoDB;

CREATE TABLE routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_station_id BIGINT NOT NULL,
    to_station_id BIGINT NOT NULL,
    distance_km INT,
    diem_di VARCHAR(120),
    diem_den VARCHAR(120),
    quang_duong VARCHAR(50),
    thoi_gian INT,
    CONSTRAINT fk_route_from_station FOREIGN KEY (from_station_id) REFERENCES stations(id),
    CONSTRAINT fk_route_to_station FOREIGN KEY (to_station_id) REFERENCES stations(id)
) ENGINE=InnoDB;

CREATE TABLE buses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    operator_id BIGINT NOT NULL,
    name VARCHAR(80) NOT NULL,
    plate VARCHAR(25) NOT NULL UNIQUE,
    bienso VARCHAR(50),
    loaixe VARCHAR(50),
    model VARCHAR(80),
    manufactured_year INT,
    floor_count INT,
    seat_count INT,
    soghe INT,
    tongchoghe INT,
    layout_name VARCHAR(80),
    amenities VARCHAR(255),
    image_url VARCHAR(255),
    CONSTRAINT fk_bus_operator FOREIGN KEY (operator_id) REFERENCES operators(id)
) ENGINE=InnoDB;

CREATE TABLE seats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_id BIGINT NOT NULL,
    seat_type_id BIGINT NOT NULL,
    code VARCHAR(10) NOT NULL,
    ten_ghe VARCHAR(20),
    row_index INT,
    column_index INT,
    deck_number INT,
    available TINYINT(1) DEFAULT 1,
    hang INT,
    trang_thai TINYINT(1),
    UNIQUE KEY uk_bus_code (bus_id, code),
    INDEX idx_seat_bus (bus_id),
    INDEX idx_seat_type (seat_type_id),
    CONSTRAINT fk_seat_bus FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    CONSTRAINT fk_seat_type FOREIGN KEY (seat_type_id) REFERENCES seat_types(id)
) ENGINE=InnoDB;

CREATE TABLE trips (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT NOT NULL,
    bus_id BIGINT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price INT,
    seats_total INT,
    seats_booked INT,
    diem_xuat_phat VARCHAR(150),
    trang_thai INT,
    tuyen_duong INT,
    CONSTRAINT fk_trip_route FOREIGN KEY (route_id) REFERENCES routes(id),
    CONSTRAINT fk_trip_bus FOREIGN KEY (bus_id) REFERENCES buses(id)
) ENGINE=InnoDB;

CREATE TABLE fares (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    route_id BIGINT NOT NULL,
    seat_type_id BIGINT NOT NULL,
    operator_id BIGINT NULL,
    price INT NOT NULL,
    currency VARCHAR(3) DEFAULT 'VND',
    active TINYINT(1) DEFAULT 1,
    note VARCHAR(255),
    UNIQUE KEY uk_fare_rule (route_id, seat_type_id, operator_id),
    CONSTRAINT fk_fare_route FOREIGN KEY (route_id) REFERENCES routes(id),
    CONSTRAINT fk_fare_seat_type FOREIGN KEY (seat_type_id) REFERENCES seat_types(id),
    CONSTRAINT fk_fare_operator FOREIGN KEY (operator_id) REFERENCES operators(id)
) ENGINE=InnoDB;

CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    operator_id BIGINT NOT NULL,
    bus_id BIGINT,
    trip_id BIGINT,
    rating INT NOT NULL,
    title VARCHAR(255),
    content TEXT,
    customer_name VARCHAR(120),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(80),
    INDEX idx_review_operator (operator_id),
    INDEX idx_review_bus (bus_id),
    INDEX idx_review_trip (trip_id),
    CONSTRAINT fk_review_operator FOREIGN KEY (operator_id) REFERENCES operators(id),
    CONSTRAINT fk_review_bus FOREIGN KEY (bus_id) REFERENCES buses(id),
    CONSTRAINT fk_review_trip FOREIGN KEY (trip_id) REFERENCES trips(id)
) ENGINE=InnoDB;

-- ===================================
-- CÁC BẢNG CŨ (GIỮ LẠI THUỘC TÍNH BAN ĐẦU)
-- ===================================

CREATE TABLE promotion (
    id VARCHAR(10) PRIMARY KEY,
    majalmgia VARCHAR(10),
    giamtoithieu INT(2),
    ngaybatdau DATE,
    ngayketthuc DATE
) ENGINE=InnoDB;

CREATE TABLE stop (
    id VARCHAR(10) PRIMARY KEY,
    tentram VARCHAR(50),
    diachi VARCHAR(50),
    ghichu VARCHAR(50),
    gio TIME,
    chuthich VARCHAR(50)
) ENGINE=InnoDB;

CREATE TABLE news (
    id INT(10) PRIMARY KEY,
    tieude VARCHAR(30),
    noidung VARCHAR(1000),
    mota VARCHAR(100),
    ngaydang DATE,
    trangthai INT(2)
) ENGINE=InnoDB;

CREATE TABLE employee (
    id VARCHAR(10) PRIMARY KEY,
    ho VARCHAR(25),
    ten VARCHAR(25),
    diachi VARCHAR(75),
    sdt VARCHAR(10),
    cmnd VARCHAR(12),
    ngaysinh DATE,
    email VARCHAR(50),
    gioitinh VARCHAR(1),
    chucvu VARCHAR(2),
    ngayvaolam DATE,
    trangthai INT(2)
) ENGINE=InnoDB;

CREATE TABLE user (
    id VARCHAR(10) PRIMARY KEY,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    sdt VARCHAR(10),
    email VARCHAR(50)
) ENGINE=InnoDB;

CREATE TABLE permission (
    id VARCHAR(10) PRIMARY KEY,
    maquyen VARCHAR(10),
    tenquyen VARCHAR(50)
) ENGINE=InnoDB;

CREATE TABLE functions (
    id VARCHAR(10) PRIMARY KEY,
    machucnang VARCHAR(50),
    tenchucnang VARCHAR(50)
) ENGINE=InnoDB;

CREATE TABLE payment (
    id VARCHAR(10) PRIMARY KEY,
    ngaygd DATE,
    thanhtien VARCHAR(10),
    makh VARCHAR(10),
    soghe INT(3),
    employeeid VARCHAR(10)
) ENGINE=InnoDB;

CREATE TABLE account (
    id VARCHAR(10) PRIMARY KEY,
    taikhoan VARCHAR(25),
    matkhau VARCHAR(25),
    makh VARCHAR(10),
    ngaytao DATE
) ENGINE=InnoDB;

CREATE TABLE supportchat (
    id VARCHAR(10) PRIMARY KEY,
    makh VARCHAR(10),
    employeeid VARCHAR(10),
    thoigian DATETIME,
    noidung TEXT
) ENGINE=InnoDB;

CREATE TABLE functionpermission (
    id VARCHAR(10) PRIMARY KEY,
    machucnang VARCHAR(10),
    maquyen VARCHAR(10)
) ENGINE=InnoDB;

CREATE TABLE ticket (
    id VARCHAR(10) PRIMARY KEY,
    tripid VARCHAR(10),
    userid VARCHAR(10),
    soghe INT(2),
    ngaydat DATE,
    trangthai INT(1)
) ENGINE=InnoDB;

CREATE TABLE paymentdetails (
    id VARCHAR(10) PRIMARY KEY,
    mahd VARCHAR(10),
    maghe VARCHAR(10),
    tongtien INT(10)
) ENGINE=InnoDB;

-- ===================================
-- DỮ LIỆU MẪU
-- ===================================

INSERT INTO stations(name, city, address) VALUES
('Bến xe Miền Tây','Ho Chi Minh','395 Kinh Dương Vương'),
('Bến xe An Sương','Ho Chi Minh','QL22, Hóc Môn'),
('Bến xe Cần Thơ','Can Tho','P. Hưng Thạnh, Cái Răng'),
('Bến xe Đà Nẵng','Da Nang','201 Tôn Đức Thắng');

INSERT INTO operators(name, hotline, address, city, email, website, description) VALUES
('Nhà xe ABC', '19001234', '123 Lê Lợi, Quận 1', 'Ho Chi Minh', 'support@abc-bus.vn', 'https://abc-bus.vn', 'Nhà xe chuyên tuyến miền Tây'),
('Nhà xe XYZ', '19004321', '45 Trần Phú', 'Da Nang', 'contact@xyzbus.vn', 'https://xyzbus.vn', 'Limousine cao cấp miền Trung');

INSERT INTO seat_types(code, name, description, base_price) VALUES
('STANDARD', 'Ghế ngồi', 'Ghế ngồi tiêu chuẩn', 150000),
('SLEEPER', 'Giường nằm', 'Giường nằm 2 tầng', 280000),
('VIP', 'Limousine VIP', 'Ghế VIP có massage', 350000);

INSERT INTO routes(from_station_id, to_station_id, distance_km, diem_di, diem_den, quang_duong, thoi_gian)
SELECT fs.id, ts.id, 170, 'Bến xe Miền Tây', 'Bến xe Cần Thơ', '170km', 180
FROM stations fs, stations ts
WHERE fs.name='Bến xe Miền Tây' AND ts.name='Bến xe Cần Thơ';

INSERT INTO routes(from_station_id, to_station_id, distance_km, diem_di, diem_den, quang_duong, thoi_gian)
SELECT fs.id, ts.id, 960, 'Bến xe Miền Tây', 'Bến xe Đà Nẵng', '960km', 720
FROM stations fs, stations ts
WHERE fs.name='Bến xe Miền Tây' AND ts.name='Bến xe Đà Nẵng';

INSERT INTO buses(operator_id, name, plate, bienso, loaixe, model, manufactured_year, floor_count, seat_count, soghe, tongchoghe, layout_name, amenities)
SELECT op.id, 'Giường nằm 40 chỗ', '51A-123.45', '51A-123.45', 'Giường nằm', 'Thaco Sleeper', 2022, 2, 40, 40, 40, 'Giường nằm 2 tầng', 'Wifi, nước uống'
FROM operators op WHERE op.name='Nhà xe ABC';

INSERT INTO buses(operator_id, name, plate, bienso, loaixe, model, manufactured_year, floor_count, seat_count, soghe, tongchoghe, layout_name, amenities)
SELECT op.id, 'Limousine 20 chỗ', '51B-678.90', '51B-678.90', 'Limousine', 'Fuso Limousine', 2023, 1, 20, 20, 20, 'Limousine VIP', 'Wifi, massage'
FROM operators op WHERE op.name='Nhà xe ABC';

INSERT INTO buses(operator_id, name, plate, bienso, loaixe, model, manufactured_year, floor_count, seat_count, soghe, tongchoghe, layout_name, amenities)
SELECT op.id, 'Xe trung chuyển 16 chỗ', '43C-111.22', '43C-111.22', 'Xe ghế ngồi', 'Ford Transit', 2021, 1, 16, 16, 16, 'Ghế ngồi', 'Điều hòa'
FROM operators op WHERE op.name='Nhà xe XYZ';

SET @busSleeper = (SELECT id FROM buses WHERE plate='51A-123.45');
SET @busVip = (SELECT id FROM buses WHERE plate='51B-678.90');
SET @busStandard = (SELECT id FROM buses WHERE plate='43C-111.22');
SET @seatSleeper = (SELECT id FROM seat_types WHERE code='SLEEPER');
SET @seatVip = (SELECT id FROM seat_types WHERE code='VIP');
SET @seatStandard = (SELECT id FROM seat_types WHERE code='STANDARD');

INSERT INTO seats(bus_id, seat_type_id, code, ten_ghe, deck_number, row_index, column_index, hang, trang_thai, available)
VALUES
(@busSleeper, @seatSleeper, 'A01', 'A01', 1, 1, 1, 1, 0, 1),
(@busSleeper, @seatSleeper, 'A02', 'A02', 1, 1, 2, 1, 0, 1),
(@busSleeper, @seatSleeper, 'B01', 'B01', 2, 2, 1, 2, 0, 1),
(@busVip, @seatVip, 'VIP01', 'VIP01', 1, 1, 1, 1, 0, 1),
(@busVip, @seatVip, 'VIP02', 'VIP02', 1, 1, 2, 1, 0, 1),
(@busStandard, @seatStandard, 'S01', 'S01', 1, 1, 1, 1, 0, 1);

SET @routeCanTho = (SELECT r.id FROM routes r JOIN stations fs ON r.from_station_id = fs.id JOIN stations ts ON r.to_station_id = ts.id WHERE fs.name='Bến xe Miền Tây' AND ts.name='Bến xe Cần Thơ');
SET @routeDaNang = (SELECT r.id FROM routes r JOIN stations fs ON r.from_station_id = fs.id JOIN stations ts ON r.to_station_id = ts.id WHERE fs.name='Bến xe Miền Tây' AND ts.name='Bến xe Đà Nẵng');

INSERT INTO trips(route_id, bus_id, departure_time, arrival_time, price, seats_total, seats_booked, diem_xuat_phat, trang_thai, tuyen_duong)
VALUES
(@routeCanTho, @busSleeper, CONCAT(CURDATE(), ' 08:00:00'), CONCAT(CURDATE(), ' 11:00:00'), 280000, 40, 5, 'Bến xe Miền Tây', 1, 1),
(@routeCanTho, @busVip, CONCAT(CURDATE(), ' 14:00:00'), CONCAT(CURDATE(), ' 17:00:00'), 350000, 20, 7, 'Bến xe Miền Tây', 1, 1),
(@routeDaNang, @busSleeper, CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' 19:30:00'), CONCAT(DATE_ADD(CURDATE(), INTERVAL 2 DAY), ' 09:00:00'), 900000, 40, 12, 'Bến xe Miền Tây', 1, 2);

INSERT INTO fares(route_id, seat_type_id, operator_id, price, currency, note)
VALUES
(@routeCanTho, @seatSleeper, (SELECT id FROM operators WHERE name='Nhà xe ABC'), 290000, 'VND', 'Giường nằm tiêu chuẩn'),
(@routeCanTho, @seatVip, (SELECT id FROM operators WHERE name='Nhà xe ABC'), 360000, 'VND', 'Limousine VIP'),
(@routeCanTho, @seatStandard, NULL, 170000, 'VND', 'Ghế ngồi tiêu chuẩn');

INSERT INTO reviews(operator_id, bus_id, trip_id, rating, title, content, customer_name, source)
VALUES
((SELECT id FROM operators WHERE name='Nhà xe ABC'), @busSleeper, (SELECT id FROM trips ORDER BY id LIMIT 1), 5, 'Rất hài lòng', 'Tài xế thân thiện, xe sạch sẽ.', 'Nguyễn Văn A', 'App'),
((SELECT id FROM operators WHERE name='Nhà xe ABC'), @busVip, NULL, 4, 'Xe VIP', 'Ghế VIP thoải mái nhưng giá hơi cao.', 'Trần Thị B', 'Website');

