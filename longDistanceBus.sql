-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3366
-- Generation Time: Oct 07, 2025 at 05:12 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `longdistancebus`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id` varchar(10) NOT NULL,
  `taikhoan` varchar(25) NOT NULL,
  `matkhau` varchar(25) NOT NULL,
  `maquyen` varchar(10) NOT NULL,
  `ngaytao` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bus`
--

CREATE TABLE `bus` (
  `id` varchar(10) NOT NULL,
  `ten` varchar(50) NOT NULL,
  `bienso` varchar(25) NOT NULL,
  `loaixe` varchar(25) NOT NULL,
  `tongsoghe` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `id` varchar(10) NOT NULL,
  `userid` int(10) NOT NULL,
  `honv` varchar(25) NOT NULL,
  `tennv` varchar(25) NOT NULL,
  `gioitinh` varchar(3) NOT NULL,
  `ngaysinh` date NOT NULL,
  `cmnd` varchar(13) NOT NULL,
  `sdt` varchar(10) NOT NULL,
  `email` varchar(50) NOT NULL,
  `ngayvaolam` date NOT NULL,
  `chucvu` varchar(10) NOT NULL,
  `tinhtrang` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `function`
--

CREATE TABLE `function` (
  `machucnang` varchar(10) NOT NULL,
  `tenchucnang` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `functionpermission`
--

CREATE TABLE `functionpermission` (
  `machucnang` varchar(10) NOT NULL,
  `maquyen` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(10) NOT NULL,
  `manv` varchar(10) NOT NULL,
  `tieude` varchar(50) NOT NULL,
  `noidung` varchar(1000) NOT NULL,
  `ngaydang` date NOT NULL,
  `trangthai` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` varchar(10) NOT NULL,
  `ngaytao` date NOT NULL,
  `thanhtien` varchar(10) NOT NULL,
  `trangthai` int(2) NOT NULL,
  `userid` varchar(10) NOT NULL,
  `employeeid` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paymentdetails`
--

CREATE TABLE `paymentdetails` (
  `mahd` varchar(10) NOT NULL,
  `ticketid` varchar(10) NOT NULL,
  `tongtien` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `maquyen` varchar(10) NOT NULL,
  `tenquyen` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `promotion`
--

CREATE TABLE `promotion` (
  `id` varchar(10) NOT NULL,
  `tripid` varchar(10) NOT NULL,
  `magiamgia` varchar(10) NOT NULL,
  `giambaonhieu` int(2) NOT NULL,
  `ngaybatdau` date NOT NULL,
  `ngayketthuc` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `route`
--

CREATE TABLE `route` (
  `id` varchar(10) NOT NULL,
  `diemdi` varchar(50) NOT NULL,
  `diemden` varchar(50) NOT NULL,
  `quanduong` int(10) NOT NULL,
  `thoigian` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seat`
--

CREATE TABLE `seat` (
  `id` varchar(10) NOT NULL,
  `busid` varchar(10) NOT NULL,
  `soghe` int(3) NOT NULL,
  `loai` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supportchat`
--

CREATE TABLE `supportchat` (
  `id` int(11) NOT NULL,
  `userid` varchar(10) NOT NULL,
  `employeeid` varchar(10) NOT NULL,
  `tinnhan` varchar(500) NOT NULL,
  `thoigian` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `id` varchar(10) NOT NULL,
  `tripid` varchar(10) NOT NULL,
  `userid` varchar(10) NOT NULL,
  `seatid` varchar(10) NOT NULL,
  `ngaydat` date NOT NULL,
  `tinhtrang` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trip`
--

CREATE TABLE `trip` (
  `id` varchar(10) NOT NULL,
  `routeid` varchar(10) NOT NULL,
  `busid` varchar(10) NOT NULL,
  `giokhoihanh` time NOT NULL,
  `gioden` time NOT NULL,
  `giave` int(25) NOT NULL,
  `tinhtrang` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tripstop`
--

CREATE TABLE `tripstop` (
  `id` varchar(10) NOT NULL,
  `tripid` varchar(10) NOT NULL,
  `thutudung` int(3) NOT NULL,
  `tendiemdung` varchar(50) NOT NULL,
  `diachi` varchar(50) NOT NULL,
  `gioden` time NOT NULL,
  `giodi` time NOT NULL,
  `ghichu` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(10) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `sdt` varchar(10) NOT NULL,
  `email` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `operators`
--

CREATE TABLE `operators` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `hotline` varchar(30) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_operators_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD KEY `fk_account_permission` (`maquyen`),
  ADD KEY `fk_account_employee` (`id`);

--
-- Indexes for table `bus`
--
ALTER TABLE `bus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_employee_user` (`userid`);

--
-- Indexes for table `function`
--
ALTER TABLE `function`
  ADD PRIMARY KEY (`machucnang`);

--
-- Indexes for table `functionpermission`
--
ALTER TABLE `functionpermission`
  ADD KEY `fk_functionpermission_function` (`machucnang`),
  ADD KEY `fk_functionpermission_permission` (`maquyen`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_news_employee` (`manv`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_Payment_User` (`userid`),
  ADD KEY `fk_Payment_Employee` (`employeeid`);

--
-- Indexes for table `paymentdetails`
--
ALTER TABLE `paymentdetails`
  ADD KEY `fk_Paymentdetails_Payment` (`mahd`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`maquyen`);

--
-- Indexes for table `promotion`
--
ALTER TABLE `promotion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_promotion_trip` (`tripid`);

--
-- Indexes for table `route`
--
ALTER TABLE `route`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `seat`
--
ALTER TABLE `seat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_seat_bus` (`busid`);

--
-- Indexes for table `supportchat`
--
ALTER TABLE `supportchat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_SupportChat_Employee` (`employeeid`),
  ADD KEY `fk_SupportChat_User` (`userid`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ticket_trip` (`tripid`),
  ADD KEY `fk_ticket_seat` (`seatid`),
  ADD KEY `fk_ticket_user` (`userid`);

--
-- Indexes for table `trip`
--
ALTER TABLE `trip`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_trip_route` (`routeid`),
  ADD KEY `fk_trip_bus` (`busid`);

--
-- Indexes for table `tripstop`
--
ALTER TABLE `tripstop`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tripstop_trip` (`tripid`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);


--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supportchat`
--
ALTER TABLE `supportchat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `operators`
--
ALTER TABLE `operators`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `fk_account_employee` FOREIGN KEY (`id`) REFERENCES `employee` (`id`),
  ADD CONSTRAINT `fk_account_permission` FOREIGN KEY (`maquyen`) REFERENCES `permission` (`maquyen`),
  ADD CONSTRAINT `fk_account_user` FOREIGN KEY (`id`) REFERENCES `user` (`id`);

--
-- Constraints for table `functionpermission`
--
ALTER TABLE `functionpermission`
  ADD CONSTRAINT `fk_functionpermission_function` FOREIGN KEY (`machucnang`) REFERENCES `function` (`machucnang`),
  ADD CONSTRAINT `fk_functionpermission_permission` FOREIGN KEY (`maquyen`) REFERENCES `permission` (`maquyen`);

--
-- Constraints for table `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `fk_news_employee` FOREIGN KEY (`manv`) REFERENCES `employee` (`id`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `fk_Payment_Employee` FOREIGN KEY (`employeeid`) REFERENCES `employee` (`id`),
  ADD CONSTRAINT `fk_Payment_User` FOREIGN KEY (`userid`) REFERENCES `user` (`id`);

--
-- Constraints for table `paymentdetails`
--
ALTER TABLE `paymentdetails`
  ADD CONSTRAINT `fk_Paymentdetails_Payment` FOREIGN KEY (`mahd`) REFERENCES `payment` (`id`);

--
-- Constraints for table `promotion`
--
ALTER TABLE `promotion`
  ADD CONSTRAINT `fk_promotion_trip` FOREIGN KEY (`tripid`) REFERENCES `trip` (`id`);

--
-- Constraints for table `seat`
--
ALTER TABLE `seat`
  ADD CONSTRAINT `fk_seat_bus` FOREIGN KEY (`busid`) REFERENCES `bus` (`id`);

--
-- Constraints for table `supportchat`
--
ALTER TABLE `supportchat`
  ADD CONSTRAINT `fk_SupportChat_Employee` FOREIGN KEY (`employeeid`) REFERENCES `employee` (`id`),
  ADD CONSTRAINT `fk_SupportChat_User` FOREIGN KEY (`userid`) REFERENCES `user` (`id`);

--
-- Constraints for table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `fk_ticket_seat` FOREIGN KEY (`seatid`) REFERENCES `seat` (`id`),
  ADD CONSTRAINT `fk_ticket_trip` FOREIGN KEY (`tripid`) REFERENCES `trip` (`id`),
  ADD CONSTRAINT `fk_ticket_user` FOREIGN KEY (`userid`) REFERENCES `user` (`id`);

--
-- Constraints for table `trip`
--
ALTER TABLE `trip`
  ADD CONSTRAINT `fk_trip_bus` FOREIGN KEY (`busid`) REFERENCES `bus` (`id`),
  ADD CONSTRAINT `fk_trip_route` FOREIGN KEY (`routeid`) REFERENCES `route` (`id`);

--
-- Constraints for table `tripstop`
--
ALTER TABLE `tripstop`
  ADD CONSTRAINT `fk_tripstop_trip` FOREIGN KEY (`tripid`) REFERENCES `trip` (`id`);

--
-- Dumping data for table `operators`
--

INSERT INTO `operators` (`name`, `hotline`, `address`, `description`, `status`) VALUES
('Xe Khách Phương Trang', '1900 6067', '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh', 'Nhà xe uy tín với hơn 20 năm kinh nghiệm, chuyên phục vụ các tuyến đường dài liên tỉnh. Đội ngũ lái xe chuyên nghiệp, xe đời mới, tiện nghi hiện đại.', 'ACTIVE'),
('Xe Khách Hoàng Long', '1900 6068', '456 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', 'Nhà xe hàng đầu với hệ thống xe giường nằm cao cấp, phục vụ các tuyến đường dài. Cam kết an toàn và chất lượng phục vụ tốt nhất.', 'ACTIVE'),
('Xe Khách Mai Linh', '1900 6069', '789 Đường Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh', 'Thương hiệu xe khách nổi tiếng với dịch vụ chất lượng cao, xe đời mới, ghế ngồi thoải mái. Phục vụ đa dạng các tuyến đường trong và ngoài thành phố.', 'ACTIVE'),
('Xe Khách Thành Bưởi', '1900 6070', '321 Đường Cách Mạng Tháng 8, Quận 10, TP. Hồ Chí Minh', 'Nhà xe chuyên các tuyến miền Tây, miền Đông. Xe sạch sẽ, đúng giờ, giá cả hợp lý. Được nhiều khách hàng tin tưởng và lựa chọn.', 'ACTIVE'),
('Xe Khách Kumho Samco', '1900 6071', '654 Đường Võ Văn Tần, Quận 3, TP. Hồ Chí Minh', 'Nhà xe quốc tế với tiêu chuẩn chất lượng cao. Xe giường nằm đời mới, có wifi, sạc điện thoại. Phục vụ các tuyến đường dài với đội ngũ nhân viên chuyên nghiệp.', 'ACTIVE'),
('Xe Khách Phúc Xuyên', '1900 6072', '987 Đường Lý Tự Trọng, Quận 1, TP. Hồ Chí Minh', 'Nhà xe chuyên tuyến miền Trung và miền Bắc. Xe đời mới, an toàn, giá cả cạnh tranh. Được đánh giá cao về chất lượng phục vụ và đúng giờ.', 'ACTIVE'),
('Xe Khách Đồng Phước', '1900 6073', '147 Đường Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh', 'Nhà xe uy tín với nhiều năm kinh nghiệm. Chuyên các tuyến đường nội thành và liên tỉnh. Xe sạch sẽ, lái xe có kinh nghiệm, phục vụ tận tình.', 'ACTIVE'),
('Xe Khách Thanh Thủy', '1900 6074', '258 Đường Hùng Vương, Quận 5, TP. Hồ Chí Minh', 'Nhà xe chuyên tuyến miền Tây. Xe đời mới, tiện nghi đầy đủ. Giá vé hợp lý, phục vụ chu đáo. Được khách hàng đánh giá cao về chất lượng.', 'ACTIVE'),
('Xe Khách Hải Âu', '1900 6075', '369 Đường Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh', 'Nhà xe chuyên tuyến biển và miền Trung. Xe giường nằm cao cấp, có điều hòa, wifi miễn phí. Đội ngũ nhân viên nhiệt tình, chuyên nghiệp.', 'ACTIVE'),
('Xe Khách Sài Gòn', '1900 6076', '741 Đường Điện Biên Phủ, Quận Bình Thạnh, TP. Hồ Chí Minh', 'Nhà xe địa phương với nhiều năm phục vụ khách hàng. Chuyên các tuyến nội thành và ngoại thành. Xe sạch sẽ, giá cả phải chăng, phục vụ tận tâm.', 'ACTIVE');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
