import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";
import { useAuth } from "../../context/AuthContext";


function DepartDateField({ value, onChange, min }) {
  return (
    <label className="ld-field">
      <span className="ld-field-label">Ngày đi</span>
      <input
        type="date"
        className="ld-field-input"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function ReturnDateField({ value, onChange, min }) {
  return (
    <label className="ld-field">
      <span className="ld-field-label">Ngày về</span>
      <input
        type="date"
        className="ld-field-input"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export default function Home() {
    const navigate = useNavigate();
const handlelt = () => {
  navigate("/cd", {});
};
  const [tripType, setTripType] = useState("oneway");   // "oneway" | "roundtrip"
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [seats, setSeats] = useState(1);
  const { isAuthed, fullName, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!from || !to || !departDate) {
      alert("Vui lòng nhập điểm đi, điểm đến và ngày đi.");
      return;
    }

    if (tripType === "roundtrip" && !returnDate) {
      alert("Vui lòng chọn ngày về cho vé khứ hồi.");
      return;
    }

    const params = new URLSearchParams({
      from,
      to,
      type: tripType,
      departDate,
      seats: String(seats),
    });

    if (tripType === "roundtrip") {
      params.set("returnDate", returnDate);
    }

    nav(`/find-ride?${params.toString()}`);
  };


  return (
    <div className="ld-home">
      {/* HEADER / NAVBAR */}
      <header className="ld-header">
        <div className="ld-header-inner">
          <Link to="/" className="ld-logo">
            <div className="ld-logo-square">LD</div>
            <div className="ld-logo-text">
              <div className="ld-logo-title">Long Distance Bus</div>
              <div className="ld-logo-subtitle">
                Cùng bạn trên mọi nẻo đường dài
              </div>
            </div>
          </Link>

          <nav className="ld-nav">
            <span className="ld-nav-link ld-nav-link--active">Trang chủ</span>
            <span className="ld-nav-link" onClick={handlelt}>Lịch trình</span>
            <span className="ld-nav-link">Tra cứu vé</span>
            <Link to="/news" className="ld-nav-link">
              Tin tức
            </Link>
            <span className="ld-nav-link">Hóa đơn</span>
            <span className="ld-nav-link">Liên hệ</span>
            <span className="ld-nav-link">Về chúng tôi</span>
          </nav>

          <div className="ld-header-auth">
            {isAuthed ? (
              <div className="ld-user-chip">
                <div className="ld-user-avatar">
                  {fullName ? fullName.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="ld-user-info">
                  <div className="ld-user-name">{fullName || "Người dùng"}</div>
                  <button type="button" className="ld-user-logout" onClick={logout}>
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="ld-header-btn ld-header-btn--ghost">
                  Đăng nhập
                </Link>
                <Link to="/register" className="ld-header-btn ld-header-btn--solid">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="ld-main">
        {/* HERO BANNER */}
        <section className="ld-hero">
          <div className="ld-hero-banner">
            <div className="ld-hero-left">
              <div className="ld-hero-eyebrow">Long Distance Bus Lines</div>
              <h1 className="ld-hero-title">
                Vững tin trên mọi chặng đường dài
              </h1>
              <p className="ld-hero-sub">
                Mạng lưới xe khách liên tỉnh, trung chuyển tận nơi và dịch vụ
                chăm sóc khách hàng tận tâm, giúp hành trình của bạn luôn an
                toàn và thoải mái.
              </p>
              <div className="ld-hero-pill">
                <span className="ld-hero-pill-number">24</span>
                <span className="ld-hero-pill-text">
                  Tuyến xe hoạt động mỗi ngày
                </span>
              </div>
            </div>

            <div className="ld-hero-right">
              <div className="ld-hero-city" />
              <div className="ld-hero-bus-shadow" />
              <div className="ld-hero-bus">
                <div className="ld-hero-bus-top">
                  <div className="ld-hero-bus-window-row">
                    <div className="ld-hero-bus-window" />
                    <div className="ld-hero-bus-window" />
                    <div className="ld-hero-bus-window" />
                  </div>
                </div>
                <div className="ld-hero-bus-door" />
                <div className="ld-hero-bus-wheel ld-hero-bus-wheel--front" />
                <div className="ld-hero-bus-wheel ld-hero-bus-wheel--back" />
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH CARD */}
        <section className="ld-search">
          <div className="ld-search-card">
            <div className="ld-search-header">
              <div className="ld-search-type">
                <button
                  type="button"
                  className={
                    tripType === "oneway"
                      ? "ld-chip ld-chip--active"
                      : "ld-chip"
                  }
                  onClick={() => setTripType("oneway")}
                >
                  Một chiều
                </button>
                <button
                  type="button"
                  className={
                    tripType === "roundtrip"
                      ? "ld-chip ld-chip--active"
                      : "ld-chip"
                  }
                  onClick={() => setTripType("roundtrip")}
                >
                  Khứ hồi
                </button>
              </div>

              <Link to="/support" className="ld-link-inline">
                Hướng dẫn mua vé
              </Link>

            </div>

            <form className="ld-search-body" onSubmit={handleSearch}>
              <div className="ld-search-row">
                {/* Điểm đi */}
                <label className="ld-field">
                  <span className="ld-field-label">Điểm đi</span>
                  <input
                    className="ld-field-input"
                    placeholder="Chọn điểm đi"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </label>

                {/* Nút đổi chiều */}
                <div className="ld-field-swap">
                  <button
                    type="button"
                    className="ld-swap-btn"
                    onClick={() => {
                      setFrom(to);
                      setTo(from);
                    }}
                  >
                    ⇄
                  </button>
                </div>

                {/* Điểm đến */}
                <label className="ld-field">
                  <span className="ld-field-label">Điểm đến</span>
                  <input
                    className="ld-field-input"
                    placeholder="Chọn điểm đến"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </label>

                {/* Ngày đi – luôn có */}
                <DepartDateField
                  value={departDate}
                  onChange={setDepartDate}
                  min={new Date().toISOString().slice(0, 10)}
                />

                {/* Ngày về – CHỈ HIỆN KHI KHỨ HỒI */}
                {tripType === "roundtrip" && (
                  <ReturnDateField
                    value={returnDate}
                    onChange={setReturnDate}
                    min={departDate || new Date().toISOString().slice(0, 10)}
                  />
                )}

                {/* Số vé */}
                <label className="ld-field ld-field--narrow">
                  <span className="ld-field-label">Số vé</span>
                  <select
                    className="ld-field-input"
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                  >
                    {Array.from({ length: 10 }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="ld-search-footer">
                <button type="submit" className="ld-primary-btn">
                  Tìm chuyến xe
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* PROMOTIONS */}
        <section className="ld-section">
          <h2 className="ld-section-title">Khuyến mãi nổi bật</h2>
          <div className="ld-section-subtitle">
            Ưu đãi hấp dẫn cho khách hàng đặt vé trên Long Distance Bus
          </div>

          <div className="ld-promo-grid">
            <div className="ld-promo-card">
              <div className="ld-promo-badge">Ví điện tử</div>
              <h3>Giảm 20% khi thanh toán bằng eWallet</h3>
              <p>Áp dụng cho khách hàng mới, tối đa 50.000đ/chuyến.</p>
              <span className="ld-promo-foot">Hết hạn: 31/12/2025</span>
            </div>

            <div className="ld-promo-card">
              <div className="ld-promo-badge ld-promo-badge--green">
                Combo
              </div>
              <h3>Combo khứ hồi siêu tiết kiệm</h3>
              <p>Giảm thêm 10% cho vé khứ hồi cùng tuyến trong 7 ngày.</p>
              <span className="ld-promo-foot">Áp dụng cho tất cả tuyến</span>
            </div>

            <div className="ld-promo-card">
              <div className="ld-promo-badge ld-promo-badge--purple">
                Thành viên
              </div>
              <h3>Tích điểm đổi quà</h3>
              <p>Mỗi 10.000đ chi tiêu được 1 điểm, đổi quà hấp dẫn.</p>
              <span className="ld-promo-foot">
                Ưu đãi dành cho khách hàng thân thiết
              </span>
            </div>
          </div>
        </section>

        {/* POPULAR ROUTES */}
        <section className="ld-section ld-section--alt">
          <h2 className="ld-section-title">Tuyến phổ biến</h2>
          <div className="ld-section-subtitle">
            Được khách hàng tin tưởng và lựa chọn nhiều
          </div>

          <div className="ld-route-grid">
            <article className="ld-route-card">
              <div className="ld-route-img ld-route-img--hcm-dalat" />
              <div className="ld-route-body">
                <div className="ld-route-label">Tuyến xe từ</div>
                <div className="ld-route-from">TP. Hồ Chí Minh</div>
                <div className="ld-route-to">Đà Lạt</div>
                <div className="ld-route-meta">
                  310km • 8 giờ • Khởi hành hằng ngày
                </div>
                <div className="ld-route-bottom">
                  <span className="ld-route-price">290.000đ</span>
                  <button
                    type="button"
                    className="ld-route-btn"
                    onClick={() => nav("/find-ride")}
                  >
                    Đặt vé
                  </button>
                </div>
              </div>
            </article>

            <article className="ld-route-card">
              <div className="ld-route-img ld-route-img--hcm-ct" />
              <div className="ld-route-body">
                <div className="ld-route-label">Tuyến xe từ</div>
                <div className="ld-route-from">TP. Hồ Chí Minh</div>
                <div className="ld-route-to">Cần Thơ</div>
                <div className="ld-route-meta">
                  170km • 4 giờ • Nhiều chuyến trong ngày
                </div>
                <div className="ld-route-bottom">
                  <span className="ld-route-price">160.000đ</span>
                  <button
                    type="button"
                    className="ld-route-btn"
                    onClick={() => nav("/find-ride")}
                  >
                    Đặt vé
                  </button>
                </div>
              </div>
            </article>

            <article className="ld-route-card">
              <div className="ld-route-img ld-route-img--hcm-dn" />
              <div className="ld-route-body">
                <div className="ld-route-label">Tuyến xe từ</div>
                <div className="ld-route-from">TP. Hồ Chí Minh</div>
                <div className="ld-route-to">Đà Nẵng</div>
                <div className="ld-route-meta">
                  930km • 18 giờ • Giường nằm cao cấp
                </div>
                <div className="ld-route-bottom">
                  <span className="ld-route-price">430.000đ</span>
                  <button
                    type="button"
                    className="ld-route-btn"
                    onClick={() => nav("/find-ride")}
                  >
                    Đặt vé
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      {/* FOOTER */}
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
    </div>
  );
}
