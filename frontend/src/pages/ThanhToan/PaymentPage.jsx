// PaymentPage.jsx
import React from "react";
import "./PaymentPage.css"; // file css riêng

const methods = [
  { id: "vietqr", name: "Thanh toán VietQR", logo: "G" },
  { id: "futa", name: "FUTAPay", logo: "F", selected: true },
  { id: "zalopay", name: "ZaloPay" },
  { id: "vnpay", name: "VNPay" },
  { id: "shopeepay", name: "ShopeePay" },
  { id: "momo", name: "MoMo" },
  { id: "viettel", name: "Viettel Money" },
  { id: "mb", name: "MB Bank" },
  { id: "atm", name: "Thẻ ATM nội địa" },
  { id: "visa", name: "Thẻ Visa/Master/JCB" },
];

const PaymentPage = () => {
  const total = 294000;
  const ticketPrice = 300000;
  const discount = 6000;

  return (
    <div className="pay-container">
      {/* Cột trái – phương thức thanh toán */}
      <div className="pay-left">
        <h3>Chọn phương thức thanh toán</h3>
        <ul className="pay-method-list">
          {methods.map((m) => (
            <li
              key={m.id}
              className={`pay-method-item ${
                m.selected ? "pay-method-item--active" : ""
              }`}
            >
              <input
                type="radio"
                name="method"
                defaultChecked={m.selected}
              />
              <div className="pay-method-logo">{m.logo}</div>
              <div className="pay-method-text">
                <div className="pay-method-name">{m.name}</div>
                {/* Có thể thêm mô tả nhỏ bên dưới */}
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

      {/* Cột giữa – QR + tổng tiền */}
      <div className="pay-center">
        <div className="pay-total">Tổng thanh toán</div>
        <div className="pay-total-amount">
          {total.toLocaleString("vi-VN")}đ
        </div>

        <div className="pay-qr-card">
          <div className="pay-qr-timer">
            Thời gian giữ chỗ còn lại 20:13
          </div>
          <div className="pay-qr-box">
            {/* Chỗ này bạn render ảnh QR thật từ backend */}
            <img
              src="https://via.placeholder.com/230x230?text=QR+Code"
              alt="QR"
            />
          </div>
          <div className="pay-qr-guide">
            <h4>Hướng dẫn thanh toán bằng FUTAPay</h4>
            <ol>
              <li>Mở ứng dụng FUTAPay trên điện thoại</li>
              <li>Dùng biểu tượng camera để quét mã QR</li>
              <li>Quét mã ở trang này và thanh toán</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Cột phải – thông tin hành khách + chuyến đi + giá */}
      <div className="pay-right">
        <div className="pay-card">
          <h4>Thông tin hành khách</h4>
          <div className="pay-card-row">
            <span>Họ và tên</span>
            <span>Trương Giang</span>
          </div>
          <div className="pay-card-row">
            <span>Số điện thoại</span>
            <span>0923467812</span>
          </div>
          <div className="pay-card-row">
            <span>Email</span>
            <span>muoikho7@gmail.com</span>
          </div>
        </div>

        <div className="pay-card">
          <h4>Thông tin lượt đi</h4>
          <div className="pay-card-row">
            <span>Tuyến xe</span>
            <span>Buon Ma Thuot - An Sương</span>
          </div>
          <div className="pay-card-row">
            <span>Thời gian xuất bến</span>
            <span>22:15 26/11/2025</span>
          </div>
          <div className="pay-card-row">
            <span>Số lượng ghế</span>
            <span>1 Ghế</span>
          </div>
          <div className="pay-card-row">
            <span>Số ghế</span>
            <span>B11</span>
          </div>
          <div className="pay-card-row">
            <span>Điểm lên xe</span>
            <span>172 Lê Duẩn - Đắk Lắk</span>
          </div>
          <div className="pay-card-row">
            <span>Điểm trả khách</span>
            <span>BX An Sương</span>
          </div>
          <div className="pay-card-row">
            <span>Tổng tiền lượt đi</span>
            <span className="text-bold">
              {ticketPrice.toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>

        <div className="pay-card">
          <h4>Chi tiết giá</h4>
          <div className="pay-card-row">
            <span>Giá vé lượt đi</span>
            <span>{ticketPrice.toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="pay-card-row">
            <span>Phí thanh toán</span>
            <span>0đ</span>
          </div>
          <div className="pay-card-row">
            <span>Ưu đãi thanh toán Online (2%)</span>
            <span>-{discount.toLocaleString("vi-VN")}đ</span>
          </div>
          <hr />
          <div className="pay-card-row pay-card-row--total">
            <span>Tổng tiền</span>
            <span>{total.toLocaleString("vi-VN")}đ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
