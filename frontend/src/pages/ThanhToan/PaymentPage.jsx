import { useEffect, useState } from "react";
import { useNavigate,useLocation  } from "react-router-dom";
import "./PaymentPage.css"; // file css riêng

import avavietqr from "../../assets/vietQR.png";
import avavnpay from "../../assets/VNPAY.png";
import avazalopay from "../../assets/zalopay.svg";
import avashopee from "../../assets/shopee.png";
import avamomo from "../../assets/momo.svg";
import avavietel from "../../assets/viettelpay.svg";
import logoweb from "../../assets/konoha.png";
import qrviet from "../../assets/q2.jpg"
import qrzalo from "../../assets/q6.jpg"
import qrvnpay from "../../assets/q5.jpg"
import qrshopee from "../../assets/q4.jpg"
import qrmomo from "../../assets/q1.jpg"
import qrvittle from "../../assets/q3.jpg"

// Danh sách phương thức thanh toán
const methods = [
  { id: "vietqr", name: "Thanh toán VietQR", logo: avavietqr,qr:qrviet, selected: true },
  { id: "zalopay", name: "ZaloPay", logo: avazalopay,qr:qrzalo},
  { id: "vnpay", name: "VNPay", logo: avavnpay ,qr:qrvnpay},
  { id: "shopeepay", name: "ShopeePay", logo: avashopee,qr:qrshopee },
  { id: "momo", name: "MoMo", logo: avamomo,qr:qrmomo },
  { id: "viettel", name: "Viettel Money", logo: avavietel,qr:qrvittle },
];

const PaymentPage = () => {
  
  const navigate = useNavigate();
  const { state } = useLocation();
  const { customer, departureInfo } = state;
const [selectedMethod, setSelectedMethod] = useState(methods.find(m => m.selected));

  // TIMER — phải đặt trong component
  const [timeLeft, setTimeLeft] = useState(120); // 15 phút

  useEffect(() => {
    if (timeLeft <= 0) {
      navigate("/"); // chuyển trang khi hết giờ
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const total = 294000;
  const ticketPrice = 300000;
  const discount = 6000;

  return (
    <>
     <div className="header-wrapper">
        <div className="header-inner">
          {/* LEFT */}
          <div className="header-left">
            <div className="lang">
              <span className="flag">🇻🇳</span>
              <span className="text">VI</span>
              <span className="arrow">▼</span>
            </div>

            <div className="app-download">
              <span className="icon">●</span>
              <span className="text">Tải ứng dụng</span>
              <span className="arrow">▼</span>
            </div>
          </div>

          {/* CENTER */}
          <div className="header-center">
            <img src={logoweb} alt="futa-logo" className="futa-logo" />
            <h2 className="route">{departureInfo.from} →  {departureInfo.to}</h2>
            <p className="date">{departureInfo.time}</p>
          </div>

          {/* RIGHT */}
          <div className="header-right">
            <div className="profile">
              <span className="avatar">🧑</span>
              <span className="name">Dương Trọng Tân</span>
              <span className="arrow">▼</span>
            </div>
          </div>
        </div>
      </div>
    <div className="pay-container">
      {/* Cột trái – phương thức thanh toán */}
      <div className="pay-left">
        <h3>Chọn phương thức thanh toán</h3>
        <ul className="pay-method-list">
          {methods.map((m) => (
            <li
              key={m.id}
              // className={`pay-method-item ${
              //   m.selected ? "pay-method-item--active" : ""
              // }`}
               onClick={() => setSelectedMethod(m)}
      className={`pay-method-item ${
        selectedMethod.id === m.id ? "pay-method-item--active" : ""
      }`}
            >
              {/* <input type="radio" name="method" defaultChecked={m.selected} /> */}
              <div className="pay-method-logo">
                <img src={m.logo} style={{ width: "100%" }} alt="" />
              </div>
              <div className="pay-method-text">
                <div className="pay-method-name">{m.name}</div>

                {m.id === "shopeepay" && (
                  <p className="pay-method-desc">
                    Giảm đến 20% tối đa 50k cho khách lần đầu thanh toán.
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="pay-center">
        <div className="pay-total">Tổng thanh toán</div>
        <div className="pay-total-amount">
          {departureInfo.totalPrice} đồng
        </div>

        <div className="pay-qr-card">
          <div className="pay-qr-timer">
            Thời gian giữ chỗ còn lại {formatTime(timeLeft)}
          </div>

          {/* <div className="pay-qr-box">
            <img
              src="https://via.placeholder.com/230x230?text=QR+Code"
              alt="QR"
            />
          </div> */}
 <div className="pay-qr-box">
      <img
        src={selectedMethod.qr}
        alt={selectedMethod.name}
        style={{ width: "230px" }}
      />
    </div>
          <div className="pay-qr-guide">
            <h4>Hướng dẫn thanh toán bằng  {selectedMethod.name}</h4>
            <ol>
              <li>Mở ứng dụng  {selectedMethod.name} trên điện thoại</li>
              <li>Dùng biểu tượng camera để quét mã QR</li>
              <li>Quét mã ở trang này và thanh toán</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="pay-right">
        <div className="pay-card">
          <h4>Thông tin hành khách</h4>
          <div className="pay-card-row">
            <span>Họ và tên</span>
            <span>{customer.name}</span>
          </div>
          <div className="pay-card-row">
            <span>Số điện thoại</span>
            <span>{customer.phone}</span>
          </div>
          <div className="pay-card-row">
            <span>Email</span>
            <span>{customer.email}</span>
          </div>
        </div>

        <div className="pay-card">
          <h4>Thông tin lượt đi</h4>
          <div className="pay-card-row">
            <span>Tuyến xe</span>
            <span>BX {departureInfo.from} → BX {departureInfo.to}</span>
          </div>
          <div className="pay-card-row">
            <span>Thời gian xuất bến</span>
            <span>22:15 26/11/2025</span>
          </div>
          <div className="pay-card-row">
            <span>Số lượng ghế</span>
            <span>{departureInfo.seatCount} ghế</span>
          </div>
          <div className="pay-card-row">
            <span>Số ghế</span>
            <span>{departureInfo.seats.join(", ")}</span>
          </div>
          <div className="pay-card-row">
            <span>Điểm lên xe</span>
            <span>{departureInfo.from}</span>
          </div>
          <div className="pay-card-row">
            <span>Điểm trả khách</span>
            <span>{departureInfo.to}</span>
          </div>
          <div className="pay-card-row">
            <span>Tổng tiền lượt đi</span>
            <span className="text-bold">
              {departureInfo.totalPrice}đ
            </span>
          </div>
        </div>

        <div className="pay-card">
          <h4>Chi tiết giá</h4>
          <div className="pay-card-row">
            <span>Giá vé lượt đi</span>
            <span>{departureInfo.totalPrice}đ</span>
          </div>
          <div className="pay-card-row">
            <span>Phí thanh toán</span>
            <span>0đ</span>
          </div>
          {/* <div className="pay-card-row">
            <span>Ưu đãi thanh toán Online (2%)</span>
            <span>-{discount.toLocaleString("vi-VN")}đ</span>
          </div> */}
          <hr />
          <div className="pay-card-row pay-card-row--total">
            <span>Tổng tiền</span>
            <span>{departureInfo.totalPrice}đ</span>
          </div>
        </div>
      </div>
    </div>
    <footer className="ld-footer">
        <div className="ld-footer-inner">
          <div className="ld-footer-col">
            <h4>Trung tâm tổng đài & CSKH</h4>
            <div className="ld-footer-phone">1900 0000</div>
            <p className="ld-footer-text">
              CÔNG TY CỔ PHẦN XE KHÁCH LONG DISTANCE BUS
            </p>
            <p className="ld-footer-text">
              Địa chỉ: 123 Đường Quốc Lộ, Quận 7, TP. Hồ Chí Minh, Việt Nam
            </p>
            <p className="ld-footer-text">
              Email: <a href="mailto:support@longdistancebus.vn">support@longdistancebus.vn</a>
            </p>
          </div>

          <div className="ld-footer-col">
            <h4>Long Distance Bus</h4>
            <ul>
              <li>Về chúng tôi</li>
              <li>Lịch trình</li>
              <li>Tuyển dụng</li>
              <li>Tin tức & sự kiện</li>
            </ul>
          </div>

          <div className="ld-footer-col">
            <h4>Hỗ trợ</h4>
            <ul>
              <li>Tra cứu thông tin đặt vé</li>
              <li>Điều khoản sử dụng</li>
              <li>Câu hỏi thường gặp</li>
              <li>Hướng dẫn đặt vé trên web</li>
            </ul>
          </div>

          <div className="ld-footer-col">
            <h4>Tải app Long Distance Bus</h4>
            <div className="ld-footer-apps">
              <button className="ld-app-btn">CH Play</button>
              <button className="ld-app-btn">App Store</button>
            </div>
            <p className="ld-footer-text">Kết nối với chúng tôi</p>
            <div className="ld-footer-social">
              <span>𝕗</span>
              <span>▶</span>
              <span>📷</span>
            </div>
          </div>
        </div>

        <div className="ld-footer-bottom">
          © {new Date().getFullYear()} Long Distance Bus — Chất lượng là danh dự
        </div>
      </footer>
    </>
  );
};

export default PaymentPage;
