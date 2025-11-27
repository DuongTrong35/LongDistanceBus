import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Busroute.css";
import logoweb from "../../assets/konoha.png";
import { Link, useNavigate } from "react-router-dom";

function Busroute() {
  const [diemDiInput, setDiemDiInput] = useState("");
  const [diemDenInput, setDiemDenInput] = useState("");

  const navigate = useNavigate();
  const handleFindTrip = (id) => {
      console.log("Gửi qua:", id);  // <-- kiểm tra lần 1

  navigate(`/trips`, {
    
    state: { id },  
  });
};

  const [dscd, setdscd] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchallschedule = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8087/api/schedule");
        setdscd(response.data);
            console.log("AR object:", response.data);  // <-- chạy đúng 100%

      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu nhân viên!");
      } finally {
        setLoading(false);
      }
    };

    fetchallschedule();
  }, []);
  const filteredData = dscd.filter((ar) => {
    const matchDiemDi =
      diemDiInput === "" ||
      ar.diemdi.toLowerCase().includes(diemDiInput.toLowerCase());

    const matchDiemDen =
      diemDenInput === "" ||
      ar.diemden.toLowerCase().includes(diemDenInput.toLowerCase());

    return matchDiemDi && matchDiemDen;
  });

  return (
    <>
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
            <span className="ld-nav-link ">Trang chủ</span>
            <span className="ld-nav-link ld-nav-link--active">Lịch trình</span>
            <span className="ld-nav-link">Tra cứu vé</span>
            <span className="ld-nav-link">Tin tức</span>
            <span className="ld-nav-link">Hóa đơn</span>
            <span className="ld-nav-link">Liên hệ</span>
            <span className="ld-nav-link">Về chúng tôi</span>
          </nav>

          <div className="ld-header-auth">
            <Link to="/login" className="ld-header-btn ld-header-btn--ghost">
              Đăng nhập
            </Link>
            <Link to="/register" className="ld-header-btn ld-header-btn--solid">
              Đăng ký
            </Link>
          </div>
        </div>
      </header>
<main className="ld-main">
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
      </main>
      <div className="page">
        <div className="container">
          {/* Search Bar */}
          <div className="search-box">
            <input
              placeholder="Nhập điểm đi"
              value={diemDiInput}
              onChange={(e) => setDiemDiInput(e.target.value)}
            />
            <span>⇄</span>
            <input
              placeholder="Nhập điểm đến"
              value={diemDenInput}
              onChange={(e) => setDiemDenInput(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="table">
            <div className="table-header">
              <div>Tuyến xe</div>
              {/* <div>Loại xe</div> */}
              <div style={{ textAlign: "center" }}>Quãng đường</div>
              <div style={{ textAlign: "center" }}>Thời gian hành trình</div>
              {/* <div>Giá vé</div> */}
              <div style={{ textAlign: "center" }}></div>
            </div>

            {filteredData.length > 0 ? (
              filteredData.map((ar, index) => (
                <React.Fragment key={index}>
                  <div className="table-row" key={index}>
                    <div className="route">
                      {ar.diemdi} <span>⇄</span> {ar.diemden}
                    </div>
                    {/* <div>{r.type}</div> */}
                    <div style={{ textAlign: "center" }}>
                      {ar.quangduong} km
                    </div>
                    <div style={{ textAlign: "center" }}>{ar.thoigian} giờ</div>
                    {/* <div></div> */}
                    <div style={{ textAlign: "center" }}>
                      <button
                        className="btn"
                        style={{
                          background: "rgba(239, 82, 34, .15)",
                          color: "#ef5222",
                          border: "none",
                          padding: "10px 20px",
                        }}
onClick={() => navigate("/trips", { state: { id: ar.id } })}                      >
                        Tìm chuyến xe
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div className="text-center">Không có dữ liệu nhân viên</div>
            )}
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
}

export default Busroute;
