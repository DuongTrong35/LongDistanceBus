import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Home/home.css";       // dùng lại header/footer + màu sắc
import "./Support.css";     // style riêng cho trang support

export default function Support() {
  const nav = useNavigate();

  return (
    <div className="ld-home support-page">
      {/* HEADER giống Home */}
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
            <span
              className="ld-nav-link"
              onClick={() => nav("/")}
              style={{ cursor: "pointer" }}
            >
              Trang chủ
            </span>
            <span className="ld-nav-link">Lịch trình</span>
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

      {/* MAIN */}
      <main className="support-main">
        {/* HERO */}
        <section className="support-hero">
          <div className="support-hero-inner">
            <div className="support-hero-left">
              <p className="support-hero-eyebrow">Hướng dẫn mua vé</p>
              <h1 className="support-hero-title">
                Đặt vé Long Distance Bus chỉ với vài bước đơn giản
              </h1>
              <p className="support-hero-sub">
                Trang này giúp bạn hiểu rõ quy trình đặt vé trực tuyến: từ bước
                chọn tuyến, lựa ghế, nhập thông tin hành khách cho đến thanh
                toán và nhận mã vé.
              </p>

              <div className="support-hero-actions">
                <button
                  type="button"
                  className="support-cta-btn"
                  onClick={() => nav("/")}
                >
                  Bắt đầu đặt vé
                </button>
                <button
                  type="button"
                  className="support-ghost-btn"
                  onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}
                >
                  Xem các bước chi tiết
                </button>
              </div>
            </div>

            <div className="support-hero-right">
              <ol className="support-steps">
                <li>
                  <h3>1. Chọn tuyến & ngày đi</h3>
                  <p>Nhập điểm đi, điểm đến, ngày đi (và ngày về nếu khứ hồi).</p>
                </li>
                <li>
                  <h3>2. Chọn chuyến & vị trí ghế</h3>
                  <p>
                    Xem danh sách chuyến, giờ xuất bến, giá vé và chọn ghế phù hợp.
                  </p>
                </li>
                <li>
                  <h3>3. Nhập thông tin hành khách</h3>
                  <p>Điền họ tên, số điện thoại liên hệ và thông tin nhận vé.</p>
                </li>
                <li>
                  <h3>4. Thanh toán & nhận mã vé</h3>
                  <p>
                    Chọn hình thức thanh toán, hoàn tất và kiểm tra mã vé qua SMS/email.
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* NỘI DUNG CHI TIẾT */}
        <section className="support-section">
          <div className="support-grid">
            <article className="support-card" id="step-1">
              <h2>1. Chọn tuyến xe và ngày khởi hành</h2>
              <ul>
                <li>
                  Tại trang <strong>Trang chủ</strong>, nhập{" "}
                  <strong>Điểm đi</strong> và <strong>Điểm đến</strong>.
                </li>
                <li>
                  Chọn <strong>Loại vé</strong>: <em>Một chiều</em> hoặc{" "}
                  <em>Khứ hồi</em>.
                </li>
                <li>
                  Với vé khứ hồi, chọn thêm <strong>Ngày về</strong> sau khi chọn
                  ngày đi.
                </li>
                <li>
                  Chọn <strong>Số vé</strong> (số lượng hành khách) và bấm{" "}
                  <strong>&quot;Tìm chuyến xe&quot;</strong>.
                </li>
              </ul>
            </article>

            <article className="support-card" id="step-2">
              <h2>2. Chọn chuyến xe và ghế ngồi</h2>
              <ul>
                <li>
                  Hệ thống hiển thị danh sách các chuyến xe phù hợp với thời gian
                  bạn đã chọn.
                </li>
                <li>
                  Kiểm tra thông tin: <strong>giờ xuất bến</strong>,{" "}
                  <strong>loại xe</strong>, <strong>giá vé</strong>,{" "}
                  <strong>thời gian di chuyển</strong>.
                </li>
                <li>
                  Chọn <strong>chuyến xe</strong> phù hợp, sau đó chọn{" "}
                  <strong>ghế</strong> trên sơ đồ ghế (nếu có).
                </li>
                <li>
                  Đối với vé khứ hồi, bạn sẽ lần lượt chọn chuyến đi và chuyến về.
                </li>
              </ul>
            </article>

            <article className="support-card" id="step-3">
              <h2>3. Nhập thông tin hành khách</h2>
              <ul>
                <li>
                  Điền <strong>Họ tên</strong> và <strong>Số điện thoại</strong>{" "}
                  của hành khách hoặc người nhận vé.
                </li>
                <li>
                  Kiểm tra lại <strong>tuyến xe</strong>,{" "}
                  <strong>thời gian khởi hành</strong> và <strong>ghế</strong> đã
                  chọn.
                </li>
                <li>
                  Nếu đi nhiều người, hãy đảm bảo thông tin từng hành khách đều
                  chính xác.
                </li>
                <li>
                  Xem trước <strong>tổng số tiền</strong> phải thanh toán.
                </li>
              </ul>
            </article>

            <article className="support-card" id="step-4">
              <h2>4. Thanh toán và nhận vé</h2>
              <ul>
                <li>
                  Chọn hình thức thanh toán: ví điện tử, thẻ ngân hàng hoặc các
                  phương thức khác (tuỳ hệ thống tích hợp).
                </li>
                <li>
                  Sau khi thanh toán thành công, hệ thống sẽ gửi{" "}
                  <strong>mã vé / mã đặt chỗ</strong> qua SMS hoặc email.
                </li>
                <li>
                  Khi lên xe, bạn chỉ cần cung cấp <strong>mã vé</strong> hoặc{" "}
                  <strong>số điện thoại</strong> để nhân viên kiểm tra.
                </li>
                <li>
                  Giữ lại tin nhắn hoặc email mã vé cho đến khi kết thúc hành
                  trình.
                </li>
              </ul>
            </article>
          </div>

          {/* CỘT LƯU Ý / FAQ NHANH */}
          <aside className="support-aside">
            <h3>Một số lưu ý khi đặt vé</h3>
            <ul>
              <li>
                Nên đến bến trước <strong>30 phút</strong> để làm thủ tục và lên
                xe.
              </li>
              <li>
                Nếu cần đổi giờ hoặc đổi ngày, vui lòng liên hệ tổng đài càng
                sớm càng tốt.
              </li>
              <li>
                Kiểm tra kỹ <strong>biển số xe</strong> và <strong>tuyến xe</strong>{" "}
                khi lên xe.
              </li>
              <li>
                Giữ điện thoại bên mình để nhận cuộc gọi từ tổng đài trong
                trường hợp có thay đổi lịch trình.
              </li>
            </ul>

            <div className="support-contact-box">
              <p className="support-contact-title">Cần hỗ trợ thêm?</p>
              <p className="support-contact-phone">1900 0000</p>
              <p className="support-contact-sub">
                Tổng đài Long Distance Bus hỗ trợ 24/7.
              </p>
            </div>
          </aside>
        </section>
      </main>

      {/* FOOTER dùng lại của Home */}
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
              Email:{" "}
              <a href="mailto:support@longdistancebus.vn">
                support@longdistancebus.vn
              </a>
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
              <li>Hướng dẫn đặt vé trên Web</li>
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
