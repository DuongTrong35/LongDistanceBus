import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

axios.defaults.withCredentials = true;

export default function Register() {
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Validate ---
  const validatePhone = (phone) => {
    const regex = /^0\d{9}$/; // bắt buộc 10 số và bắt đầu bằng 0
    return regex.test(phone);
  };

  const validatePassword = (password) => {
    // tối thiểu 8 ký tự, có ít nhất 1 chữ hoa và 1 ký tự đặc biệt
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password);
  };

  const validateFullName = (fullName) => {
    const trimmed = fullName.trim();
    if (!trimmed) return false;
    const regex = /^(?!.*\d)[\p{L}\s]+$/u; // chỉ cho chữ (có dấu) và khoảng trắng
    return regex.test(trimmed);
  };

  // --- Gửi request đăng ký (bước 1: gửi OTP) ---
  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setSuccessMessage("");
    setLoading(true);

    // Kiểm tra dữ liệu đầu vào
    if (!validateFullName(fullName)) {
      setErr("Họ tên không hợp lệ. Vui lòng chỉ nhập chữ.");
      setLoading(false);
      return;
    }
    if (!validatePhone(phone)) {
      setErr("Số điện thoại phải có 10 chữ số và bắt đầu bằng 0.");
      setLoading(false);
      return;
    }
    if (!validatePassword(password)) {
      setErr("Mật khẩu tối thiểu 8 ký tự, có chữ hoa và ký tự đặc biệt.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8085/api/auth/register",
        { fullName, phone, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data?.success) {
        setOtpSent(true);
        setErr(null);
        setSuccessMessage(res.data?.message || "Đã gửi mã OTP.");
        if (res.data?.otp) {
          setOtp(res.data.otp);
          setAutoFilled(true);
        } else {
          setAutoFilled(false);
        }
      } else {
        setErr(res.data?.message || "Đăng ký thất bại.");
      }
    } catch (error) {
      setErr(
        error.response?.data?.message ||
          error.message ||
          "Đã xảy ra lỗi, vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  }

  // --- Xác thực OTP (bước 2) ---
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setErr(null);
    setVerifying(true);

    if (!otp || otp.length < 4) {
      setErr("Vui lòng nhập đầy đủ mã OTP.");
      setVerifying(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8085/api/auth/verify-otp",
        {
          phone,
          otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data?.success) {
        setSuccessMessage("Xác thực thành công! Đang chuyển hướng...");
        setTimeout(() => {
          nav("/login", { state: { registrationSuccess: true } });
        }, 1500);
      } else {
        setErr(res.data?.message || "Xác thực OTP thất bại.");
      }
    } catch (error) {
      setErr(
        error.response?.data?.message ||
          error.message ||
          "Xác thực OTP thất bại."
      );
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="auth-brand">
          <div className="auth-logo-square">
            <Link to="/" className="auth-home">
              LD
            </Link>
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
          <h1 className="auth-hero-title">Cùng bạn trên mọi nẻo đường dài</h1>
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
              <Link to="/login" className="auth-tab">
                Đăng nhập
              </Link>
              <button type="button" className="auth-tab auth-tab--active">
                Đăng ký
              </button>
            </div>

            <h2 className="auth-title">Đăng ký tài khoản mới</h2>
            <p className="auth-subtitle">
              Điền đầy đủ thông tin bên dưới để tạo tài khoản Long Distance Bus.
            </p>

            {successMessage && (
              <div className="auth-success-message">{successMessage}</div>
            )}

            {/* Form bước 1: Đăng ký + gửi OTP */}
            {!otpSent && (
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
                </div>

                <div>
                  <div className="auth-label">Mật khẩu</div>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="auth-input"
                      placeholder="Tạo mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {err && <div className="auth-error">{err}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="auth-primary-btn"
                >
                  {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>
              </form>
            )}

            {/* Form bước 2: Nhập OTP */}
            {otpSent && (
              <form className="auth-form" onSubmit={handleOtpVerification}>
                <p>Mã xác thực đã được gửi về số {phone}</p>
                <div>
                  <div className="auth-label">Nhập mã OTP</div>
                  <input
                    className="auth-input"
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    autoFocus
                  />
                  {autoFilled && (
                    <div className="otp-hint">
                      Mã OTP đã được tự động điền. Vui lòng nhấn Tiếp tục để xác nhận.
                    </div>
                  )}
                </div>

                {err && <div className="auth-error">{err}</div>}

                <button type="submit" className="auth-primary-btn" disabled={verifying}>
                  {verifying ? "Đang xác thực..." : "Tiếp tục"}
                </button>
              </form>
            )}

            <div className="auth-bottom-text">
              Đã có tài khoản?{" "}
              <Link to="/login" className="auth-link">
                Đăng nhập
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
