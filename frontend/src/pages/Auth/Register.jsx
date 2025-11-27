import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");  // Số điện thoại
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);  // Kiểm tra nếu OTP đã được gửi

  // Kiểm tra số điện thoại hợp lệ
  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;  // Kiểm tra số điện thoại có 10 chữ số
    return regex.test(phone);
  };

  // Kiểm tra mật khẩu (tối thiểu 6 ký tự)
  const validatePassword = (password) => {
    return password.length >= 6;
  };

// Kiểm tra nếu chỉ nhập chữ cho họ tên
  const validateFullName = (fullName) => {
    const regex = /^[A-Za-z\s]+$/;  // Kiểm tra nếu chỉ có chữ và khoảng trắng
    return regex.test(fullName);
  };

  async function onSubmit(e) {
      e.preventDefault();
      setErr(null);
      setLoading(true);

      // Kiểm tra dữ liệu đầu vào
      if (!validatePhone(phone)) {
        setErr("Số điện thoại không hợp lệ");
        setLoading(false);
        return;
      }
      if (!validatePassword(password)) {
        setErr("Mật khẩu phải ít nhất 6 ký tự");
        setLoading(false);
        return;
      }
      if (!validateFullName(fullName)) {
        setErr("Họ tên không hợp lệ. Vui lòng chỉ nhập chữ.");
        setLoading(false);
        return;
      }

      try {
        // Gửi số điện thoại và mật khẩu
        const response = await register({ fullName, phone, password });

        // Nếu gửi mã OTP thành công
        if (response.status === 200) {
          setOtpSent(true);
          setErr(null);  // Reset lỗi
        } else {
          setErr(response?.message || "Đăng ký thất bại.");
        }
      } catch (error) {
        setErr(error?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }

  return (
    <div className="auth-page">
          <header className="auth-header">
            <div className="auth-brand">
              <div className="auth-logo-square">
                <Link to="/" className="auth-home">LD</Link>
              </div>
              <div>
                <div className="auth-brand-text-main">Long Distance Bus</div>
                <div className="auth-brand-text-sub">
                  Cùng bạn trên mọi nẻo đường
                </div>
              </div>
            </div>

            <div className="auth-header-right">
              <span className="auth-header-link">
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                  }}
                >
                  ⬇
                </span>
                Tải ứng dụng
              </span>
              <span className="auth-download-pill">Hỗ trợ 24/7</span>
            </div>
          </header>

          <main className="auth-main">
            {/* Bên trái: Hero */}
            <section className="auth-hero">
              <div className="auth-hero-eyebrow">Long Distance Bus Lines</div>
              <h1 className="auth-hero-title">
                Cùng bạn trên mọi nẻo đường dài
              </h1>
              <p className="auth-hero-sub">
                Đặt vé xe liên tỉnh, xe trung chuyển đón – trả tận nơi, an toàn và
                tiện lợi. Chỉ vài bước là bạn đã sẵn sàng cho chuyến đi mới.
              </p>

              <div className="auth-badge">
                <span role="img" aria-label="bus">
                  🚌
                </span>
                Xe trung chuyển đón – trả tận nơi
              </div>

              <ul className="auth-hero-list">
                <li>Đặt vé trực tuyến nhanh chóng</li>
                <li>Hỗ trợ khách hàng 24/7</li>
                <li>Thông tin lịch trình minh bạch</li>
                <li>Thanh toán linh hoạt, an toàn</li>
              </ul>

              <div className="auth-bus-illustration">
                <div className="auth-bus-road" />
                <div className="auth-bus-body">
                  <div className="auth-bus-window-row">
                    <div className="auth-bus-window" />
                    <div className="auth-bus-window" />
                    <div className="auth-bus-window" />
                  </div>
                  <div className="auth-bus-door" />
                  <div className="auth-bus-front" />
                  <div className="auth-bus-wheel left" />
                  <div className="auth-bus-wheel right" />
                </div>
              </div>
            </section>

        <section className="auth-card-wrapper">
          <div className="auth-card">
            <div className="auth-tabs">
              <Link to="/login" className="auth-tab">Đăng nhập</Link>
              <button type="button" className="auth-tab auth-tab--active">
                Đăng ký
              </button>
            </div>

            <h2 className="auth-title">Đăng ký tài khoản mới</h2>
            <p className="auth-subtitle">Điền đầy đủ thông tin bên dưới để tạo tài khoản Long Distance Bus.</p>

            <form className="auth-form" onSubmit={onSubmit}>
              <div>
                <div className="auth-label">Họ và tên</div>
                <input
                  className="auth-input"
                  placeholder="Nhập họ và tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="auth-label">Số điện thoại</div>
                <input
                  className="auth-input"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                {err && err.includes("Số điện thoại") && (
                  <div className="auth-error" style={{ color: "#FF4D4D" }}>
                    {err}
                  </div>
                )}
              </div>

              <div>
                <div className="auth-label">Mật khẩu</div>
                <input
                  className="auth-input"
                  type="password"
                  placeholder="Tạo mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {err && !err.includes("Số điện thoại") && (
                <div className="auth-error" style={{ color: "#FF4D4D" }}>
                  {err}
                </div>
              )}

              <button type="submit" disabled={loading} className="auth-primary-btn">
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </button>

              {otpSent && (
                <div className="otp-section">
                  <p>Mã xác thực đã được gửi về số {phone}</p>
                  {/* Giao diện mã OTP */}
                  <div>
                    <input type="text" maxLength="1" />
                    <input type="text" maxLength="1" />
                    <input type="text" maxLength="1" />
                    <input type="text" maxLength="1" />
                    <input type="text" maxLength="1" />
                    <input type="text" maxLength="1" />
                  </div>
                  <button className="otp-submit-btn">Tiếp tục</button>
                </div>
              )}
            </form>

            <div className="auth-bottom-text">
              Đã có tài khoản?{" "}
              <Link to="/login" className="auth-link">Đăng nhập</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
