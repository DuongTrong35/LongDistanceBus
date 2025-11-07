INSERT INTO stations(name, city, address) VALUES
 ('Bến xe Miền Tây','Ho Chi Minh','395 Kinh Dương Vương'),
 ('Bến xe An Sương','Ho Chi Minh','QL22, Hóc Môn'),
 ('Bến xe Cần Thơ','Can Tho','P. Hưng Thạnh, Cái Răng'),
 ('Bến xe Đà Nẵng','Da Nang','201 Tôn Đức Thắng');

-- ===== STATIONS (nếu chưa có) =====
INSERT INTO stations(name, city, address) SELECT 'Bến xe Miền Tây','Ho Chi Minh','395 Kinh Dương Vương'
WHERE NOT EXISTS (SELECT 1 FROM stations WHERE name='Bến xe Miền Tây');

INSERT INTO stations(name, city, address) SELECT 'Bến xe An Sương','Ho Chi Minh','QL22, Hóc Môn'
WHERE NOT EXISTS (SELECT 1 FROM stations WHERE name='Bến xe An Sương');

INSERT INTO stations(name, city, address) SELECT 'Bến xe Cần Thơ','Can Tho','P. Hưng Thạnh, Cái Răng'
WHERE NOT EXISTS (SELECT 1 FROM stations WHERE name='Bến xe Cần Thơ');

INSERT INTO stations(name, city, address) SELECT 'Bến xe Đà Nẵng','Da Nang','201 Tôn Đức Thắng'
WHERE NOT EXISTS (SELECT 1 FROM stations WHERE name='Bến xe Đà Nẵng');

-- ===== OPERATORS (nhà xe) =====
INSERT INTO operators(name, hotline) SELECT 'Nhà xe ABC', '19001234'
WHERE NOT EXISTS (SELECT 1 FROM operators WHERE name='Nhà xe ABC');

INSERT INTO operators(name, hotline) SELECT 'Nhà xe XYZ', '19004321'
WHERE NOT EXISTS (SELECT 1 FROM operators WHERE name='Nhà xe XYZ');

-- ===== BUSES (xe) =====
INSERT INTO buses(name, plate, seat_count) SELECT 'Giường nằm 40 chỗ', '51A-123.45', 40
WHERE NOT EXISTS (SELECT 1 FROM buses WHERE plate='51A-123.45');

INSERT INTO buses(name, plate, seat_count) SELECT 'Limousine 20 chỗ', '51B-678.90', 20
WHERE NOT EXISTS (SELECT 1 FROM buses WHERE plate='51B-678.90');

-- ===== ROUTES (tuyến) =====
INSERT INTO routes(from_station_id, to_station_id, distance_km)
SELECT fs.id, ts.id, 170
FROM stations fs, stations ts
WHERE fs.name='Bến xe Miền Tây' AND ts.name='Bến xe Cần Thơ'
  AND NOT EXISTS (
    SELECT 1 FROM routes r
    WHERE r.from_station_id = fs.id AND r.to_station_id = ts.id
  );

INSERT INTO routes(from_station_id, to_station_id, distance_km)
SELECT fs.id, ts.id, 960
FROM stations fs, stations ts
WHERE fs.name='Bến xe Miền Tây' AND ts.name='Bến xe Đà Nẵng'
  AND NOT EXISTS (
    SELECT 1 FROM routes r
    WHERE r.from_station_id = fs.id AND r.to_station_id = ts.id
  );

-- ===== TRIPS (chuyến) =====
-- HCM -> Cần Thơ hôm nay 08:00 (giường nằm)
INSERT INTO trips(route_id, bus_id, departure_time, arrival_time, price, seats_total, seats_booked)
SELECT r.id, b.id,
       CONCAT(CURDATE(), ' 08:00:00'), CONCAT(CURDATE(), ' 11:00:00'),
       180000, 40, 5
FROM routes r, buses b, stations fs, stations ts
WHERE r.from_station_id = fs.id AND r.to_station_id = ts.id
  AND fs.name='Bến xe Miền Tây' AND ts.name='Bến xe Cần Thơ'
  AND b.plate='51A-123.45'
  AND NOT EXISTS (
    SELECT 1 FROM trips t
    WHERE t.route_id = r.id AND t.bus_id=b.id AND t.departure_time = CONCAT(CURDATE(), ' 08:00:00')
  );

-- HCM -> Cần Thơ hôm nay 14:00 (limousine)
INSERT INTO trips(route_id, bus_id, departure_time, arrival_time, price, seats_total, seats_booked)
SELECT r.id, b.id,
       CONCAT(CURDATE(), ' 14:00:00'), CONCAT(CURDATE(), ' 17:00:00'),
       220000, 20, 7
FROM routes r, buses b, stations fs, stations ts
WHERE r.from_station_id = fs.id AND r.to_station_id = ts.id
  AND fs.name='Bến xe Miền Tây' AND ts.name='Bến xe Cần Thơ'
  AND b.plate='51B-678.90'
  AND NOT EXISTS (
    SELECT 1 FROM trips t
    WHERE t.route_id = r.id AND t.bus_id=b.id AND t.departure_time = CONCAT(CURDATE(), ' 14:00:00')
  );

-- HCM -> Đà Nẵng ngày mai 19:30 (giường nằm)
INSERT INTO trips(route_id, bus_id, departure_time, arrival_time, price, seats_total, seats_booked)
SELECT r.id, b.id,
       CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' 19:30:00'),
       CONCAT(DATE_ADD(CURDATE(), INTERVAL 2 DAY), ' 09:00:00'),
       900000, 40, 12
FROM routes r, buses b, stations fs, stations ts
WHERE r.from_station_id = fs.id AND r.to_station_id = ts.id
  AND fs.name='Bến xe Miền Tây' AND ts.name='Bến xe Đà Nẵng'
  AND b.plate='51A-123.45'
  AND NOT EXISTS (
    SELECT 1 FROM trips t
    WHERE t.route_id = r.id AND t.bus_id=b.id
      AND t.departure_time = CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 DAY), ' 19:30:00')
  );
