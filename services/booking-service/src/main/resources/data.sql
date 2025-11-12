-- ===== STATIONS =====
INSERT INTO stations(name, city, address) SELECT 'Bến xe Miền Tây','Ho Chi Minh','395 Kinh Dương Vương'
WHERE NOT EXISTS (SELECT 1 FROM stations WHERE name='Bến xe Miền Tây');

INSERT INTO stations(name, city, address) SELECT 'Bến xe An Sương','Ho Chi Minh','QL22, Hóc Môn'
WHERE NOT EXISTS (SELECT 1 FROM stations WHERE name='Bến xe An Sương');

INSERT INTO stations(name, city, address) SELECT 'Bến xe Cần Thơ','Can Tho','P. Hưng Thạnh, Cái Răng'
WHERE NOT EXISTS (SELECT 1 FROM stations WHERE name='Bến xe Cần Thơ');

INSERT INTO stations(name, city, address) SELECT 'Bến xe Đà Nẵng','Da Nang','201 Tôn Đức Thắng'
WHERE NOT EXISTS (SELECT 1 FROM stations WHERE name='Bến xe Đà Nẵng');

-- ===== SEAT TYPES =====
INSERT INTO seat_types(code, name, description, base_price)
SELECT 'STANDARD', 'Ghế ngồi', 'Ghế ngồi tiêu chuẩn', 150000
WHERE NOT EXISTS (SELECT 1 FROM seat_types WHERE code='STANDARD');

INSERT INTO seat_types(code, name, description, base_price)
SELECT 'SLEEPER', 'Giường nằm', 'Giường nằm hai tầng', 280000
WHERE NOT EXISTS (SELECT 1 FROM seat_types WHERE code='SLEEPER');

INSERT INTO seat_types(code, name, description, base_price)
SELECT 'VIP', 'Limousine VIP', 'Ghế limousine cao cấp', 350000
WHERE NOT EXISTS (SELECT 1 FROM seat_types WHERE code='VIP');

-- ===== OPERATORS =====
INSERT INTO operators(name, hotline, address, city, email, website, description)
SELECT 'Nhà xe ABC', '19001234', '123 Lê Lợi, Quận 1', 'Ho Chi Minh', 'support@abc-bus.vn', 'https://abc-bus.vn', 'Nhà xe chuyên các tuyến miền Tây'
WHERE NOT EXISTS (SELECT 1 FROM operators WHERE name='Nhà xe ABC');

INSERT INTO operators(name, hotline, address, city, email, website, description)
SELECT 'Nhà xe XYZ', '19004321', '45 Trần Phú', 'Da Nang', 'contact@xyzbus.vn', 'https://xyzbus.vn', 'Dịch vụ limousine miền Trung'
WHERE NOT EXISTS (SELECT 1 FROM operators WHERE name='Nhà xe XYZ');

-- ===== ROUTES =====
INSERT INTO routes(from_station_id, to_station_id, distance_km, diem_di, diem_den, quang_duong, thoi_gian)
SELECT fs.id, ts.id, 170, 'Bến xe Miền Tây', 'Bến xe Cần Thơ', '170km', 180
FROM stations fs, stations ts
WHERE fs.name='Bến xe Miền Tây' AND ts.name='Bến xe Cần Thơ'
  AND NOT EXISTS (
    SELECT 1 FROM routes r
    WHERE r.from_station_id = fs.id AND r.to_station_id = ts.id
  );

INSERT INTO routes(from_station_id, to_station_id, distance_km, diem_di, diem_den, quang_duong, thoi_gian)
SELECT fs.id, ts.id, 960, 'Bến xe Miền Tây', 'Bến xe Đà Nẵng', '960km', 720
FROM stations fs, stations ts
WHERE fs.name='Bến xe Miền Tây' AND ts.name='Bến xe Đà Nẵng'
  AND NOT EXISTS (
    SELECT 1 FROM routes r
    WHERE r.from_station_id = fs.id AND r.to_station_id = ts.id
  );

-- ===== BUSES =====
INSERT INTO buses(operator_id, name, plate, bienso, loaixe, model, manufactured_year, floor_count, seat_count, soghe, tongchoghe, layout_name, amenities)
SELECT op.id, 'Giường nằm 40 chỗ', '51A-123.45', '51A-123.45', 'Giường nằm', 'Thaco Sleeper', 2022, 2, 40, 40, 40, 'Giường nằm 2 tầng', 'Wifi, nước uống'
FROM operators op
WHERE op.name='Nhà xe ABC'
  AND NOT EXISTS (SELECT 1 FROM buses WHERE plate='51A-123.45');

INSERT INTO buses(operator_id, name, plate, bienso, loaixe, model, manufactured_year, floor_count, seat_count, soghe, tongchoghe, layout_name, amenities)
SELECT op.id, 'Limousine 20 chỗ', '51B-678.90', '51B-678.90', 'Limousine', 'Fuso Limousine', 2023, 1, 20, 20, 20, 'Limousine VIP', 'Wifi, massage, nước uống'
FROM operators op
WHERE op.name='Nhà xe ABC'
  AND NOT EXISTS (SELECT 1 FROM buses WHERE plate='51B-678.90');

INSERT INTO buses(operator_id, name, plate, bienso, loaixe, model, manufactured_year, floor_count, seat_count, soghe, tongchoghe, layout_name, amenities)
SELECT op.id, 'Xe trung chuyển 16 chỗ', '43C-111.22', '43C-111.22', 'Xe ghế ngồi', 'Ford Transit', 2021, 1, 16, 16, 16, 'Ghế ngồi', 'Điều hòa'
FROM operators op
WHERE op.name='Nhà xe XYZ'
  AND NOT EXISTS (SELECT 1 FROM buses WHERE plate='43C-111.22');

-- ===== SEATS (mẫu mỗi xe vài ghế) =====
INSERT INTO seats(bus_id, seat_type_id, code, ten_ghe, deck_number, row_index, column_index, hang, trang_thai, available)
SELECT b.id, st.id, 'A01', 'A01', 1, 1, 1, 1, 0, true
FROM buses b, seat_types st
WHERE b.plate='51A-123.45' AND st.code='SLEEPER'
  AND NOT EXISTS (SELECT 1 FROM seats WHERE bus_id=b.id AND code='A01');

INSERT INTO seats(bus_id, seat_type_id, code, ten_ghe, deck_number, row_index, column_index, hang, trang_thai, available)
SELECT b.id, st.id, 'A02', 'A02', 1, 1, 2, 1, 0, true
FROM buses b, seat_types st
WHERE b.plate='51A-123.45' AND st.code='SLEEPER'
  AND NOT EXISTS (SELECT 1 FROM seats WHERE bus_id=b.id AND code='A02');

INSERT INTO seats(bus_id, seat_type_id, code, ten_ghe, deck_number, row_index, column_index, hang, trang_thai, available)
SELECT b.id, st.id, 'B01', 'B01', 2, 2, 1, 2, 0, true
FROM buses b, seat_types st
WHERE b.plate='51A-123.45' AND st.code='SLEEPER'
  AND NOT EXISTS (SELECT 1 FROM seats WHERE bus_id=b.id AND code='B01');

INSERT INTO seats(bus_id, seat_type_id, code, ten_ghe, deck_number, row_index, column_index, hang, trang_thai, available)
SELECT b.id, st.id, 'VIP01', 'VIP01', 1, 1, 1, 1, 0, true
FROM buses b, seat_types st
WHERE b.plate='51B-678.90' AND st.code='VIP'
  AND NOT EXISTS (SELECT 1 FROM seats WHERE bus_id=b.id AND code='VIP01');

INSERT INTO seats(bus_id, seat_type_id, code, ten_ghe, deck_number, row_index, column_index, hang, trang_thai, available)
SELECT b.id, st.id, 'VIP02', 'VIP02', 1, 1, 2, 1, 0, true
FROM buses b, seat_types st
WHERE b.plate='51B-678.90' AND st.code='VIP'
  AND NOT EXISTS (SELECT 1 FROM seats WHERE bus_id=b.id AND code='VIP02');

INSERT INTO seats(bus_id, seat_type_id, code, ten_ghe, deck_number, row_index, column_index, hang, trang_thai, available)
SELECT b.id, st.id, 'S01', 'S01', 1, 1, 1, 1, 0, true
FROM buses b, seat_types st
WHERE b.plate='43C-111.22' AND st.code='STANDARD'
  AND NOT EXISTS (SELECT 1 FROM seats WHERE bus_id=b.id AND code='S01');

-- ===== TRIPS =====
INSERT INTO trips(route_id, bus_id, departure_time, arrival_time, price, seats_total, seats_booked, diem_xuat_phat, trang_thai, tuyen_duong)
SELECT r.id, b.id,
       CONCAT(CURDATE(), ' 08:00:00'), CONCAT(CURDATE(), ' 11:00:00'),
       280000, 40, 5, 'Bến xe Miền Tây', 1, 1
FROM routes r, buses b, stations fs, stations ts
WHERE r.from_station_id = fs.id AND r.to_station_id = ts.id
  AND fs.name='Bến xe Miền Tây' AND ts.name='Bến xe Cần Thơ'
  AND b.plate='51A-123.45'
  AND NOT EXISTS (
    SELECT 1 FROM trips t
    WHERE t.route_id = r.id AND t.bus_id=b.id AND t.departure_time = CONCAT(CURDATE(), ' 08:00:00')
  );

INSERT INTO trips(route_id, bus_id, departure_time, arrival_time, price, seats_total, seats_booked, diem_xuat_phat, trang_thai, tuyen_duong)
SELECT r.id, b.id,
       CONCAT(CURDATE(), ' 14:00:00'), CONCAT(CURDATE(), ' 17:00:00'),
       350000, 20, 7, 'Bến xe Miền Tây', 1, 1
FROM routes r, buses b, stations fs, stations ts
WHERE r.from_station_id = fs.id AND r.to_station_id = ts.id
  AND fs.name='Bến xe Miền Tây' AND ts.name='Bến xe Cần Thơ'
  AND b.plate='51B-678.90'
  AND NOT EXISTS (
    SELECT 1 FROM trips t
    WHERE t.route_id = r.id AND t.bus_id=b.id AND t.departure_time = CONCAT(CURDATE(), ' 14:00:00')
  );

INSERT INTO trips(route_id, bus_id, departure_time, arrival_time, price, seats_total, seats_booked, diem_xuat_phat, trang_thai, tuyen_duong)
SELECT r.id, b.id,
       CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' 19:30:00'),
       CONCAT(DATE_ADD(CURDATE(), INTERVAL 2 DAY), ' 09:00:00'),
       900000, 40, 12, 'Bến xe Miền Tây', 1, 2
FROM routes r, buses b, stations fs, stations ts
WHERE r.from_station_id = fs.id AND r.to_station_id = ts.id
  AND fs.name='Bến xe Miền Tây' AND ts.name='Bến xe Đà Nẵng'
  AND b.plate='51A-123.45'
  AND NOT EXISTS (
    SELECT 1 FROM trips t
    WHERE t.route_id = r.id AND t.bus_id=b.id
      AND t.departure_time = CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' 19:30:00')
  );

-- ===== FARES =====
INSERT INTO fares(route_id, seat_type_id, operator_id, price, currency, active, note)
SELECT r.id, st.id, op.id, 290000, 'VND', true, 'Giường nằm tiêu chuẩn'
FROM routes r, seat_types st, operators op, stations fs, stations ts
WHERE r.from_station_id = fs.id AND r.to_station_id = ts.id
  AND fs.name='Bến xe Miền Tây' AND ts.name='Bến xe Cần Thơ'
  AND st.code='SLEEPER'
  AND op.name='Nhà xe ABC'
  AND NOT EXISTS (
    SELECT 1 FROM fares f
    WHERE f.route_id = r.id AND f.seat_type_id = st.id AND f.operator_id = op.id
  );

INSERT INTO fares(route_id, seat_type_id, operator_id, price, currency, active, note)
SELECT r.id, st.id, op.id, 360000, 'VND', true, 'Limousine VIP'
FROM routes r, seat_types st, operators op, stations fs, stations ts
WHERE r.from_station_id = fs.id AND r.to_station_id = ts.id
  AND fs.name='Bến xe Miền Tây' AND ts.name='Bến xe Cần Thơ'
  AND st.code='VIP'
  AND op.name='Nhà xe ABC'
  AND NOT EXISTS (
    SELECT 1 FROM fares f
    WHERE f.route_id = r.id AND f.seat_type_id = st.id AND f.operator_id = op.id
  );

INSERT INTO fares(route_id, seat_type_id, operator_id, price, currency, active, note)
SELECT r.id, st.id, NULL, 170000, 'VND', true, 'Ghế ngồi tiêu chuẩn'
FROM routes r, seat_types st, stations fs, stations ts
WHERE r.from_station_id = fs.id AND r.to_station_id = ts.id
  AND fs.name='Bến xe Miền Tây' AND ts.name='Bến xe Cần Thơ'
  AND st.code='STANDARD'
  AND NOT EXISTS (
    SELECT 1 FROM fares f
    WHERE f.route_id = r.id AND f.seat_type_id = st.id AND f.operator_id IS NULL
  );

-- ===== REVIEWS =====
INSERT INTO reviews(operator_id, bus_id, trip_id, rating, title, content, customer_name, created_at, source)
SELECT op.id, b.id, t.id, 5, 'Rất hài lòng', 'Tài xế thân thiện, xe sạch sẽ.', 'Nguyễn Văn A', NOW(), 'App'
FROM operators op, buses b, trips t
WHERE op.name='Nhà xe ABC' AND b.plate='51A-123.45' AND t.bus_id=b.id
  AND NOT EXISTS (SELECT 1 FROM reviews WHERE operator_id = op.id AND customer_name='Nguyễn Văn A');

INSERT INTO reviews(operator_id, bus_id, trip_id, rating, title, content, customer_name, created_at, source)
SELECT op.id, b.id, NULL, 4, 'Xe vip', 'Ghế VIP thoải mái nhưng giá hơi cao.', 'Trần Thị B', NOW(), 'Website'
FROM operators op, buses b
WHERE op.name='Nhà xe ABC' AND b.plate='51B-678.90'
  AND NOT EXISTS (SELECT 1 FROM reviews WHERE operator_id = op.id AND customer_name='Trần Thị B');
