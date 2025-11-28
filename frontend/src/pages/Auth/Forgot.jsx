import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Forgot.css";
import { forgotPasswordApi, resetPasswordApi } from "../../lib/api";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Forgot() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const validatePhone = (value) => /^0\d{9}$/.test(value);
  const validatePassword = (value) =>
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(value);

  async function handleRequestOtp(e) {
    e.preventDefault();
    setError(null);
    setSuccess("");

    if (!validatePhone(phone)) {
      setError("Số điện thoại phải có 10 chữ số và bắt đầu bằng 0.");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordApi(phone.trim());
    if (res?.success) {
      setSent(true);
      setSuccess(res?.message || "Đã gửi mã OTP đặt lại mật khẩu.");

      if (res?.otp) {
        setOtp(res.otp);        // auto-fill input
        setAutoFilled(true);    // bật hint
      } else {
        setAutoFilled(false);
      }
    } else {
      setError(res?.message || "Không thể gửi mã OTP, vui lòng thử lại.");
    }

    } catch (err) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra khi gửi mã OTP."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setError(null);
    setSuccess("");

    if (!otp.trim()) {
      setError("Vui lòng nhập mã OTP.");
      return;
    }
    if (!validatePassword(newPassword)) {
      setError("Mật khẩu tối thiểu 8 ký tự, có chữ hoa và ký tự đặc biệt.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    setVerifying(true);
    try {
      const res = await resetPasswordApi({
        phone: phone.trim(),
        otp: otp.trim(),
        newPassword,
      });

      if (res?.success) {
        setSuccess(res?.message || "Đặt lại mật khẩu thành công.");
        setTimeout(() => navigate("/login", { replace: true }), 1500);
      } else {
        setError(res?.message || "Không thể đặt lại mật khẩu.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Đặt lại mật khẩu thất bại."
      );
    } finally {
      setVerifying(false);
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
            Quên mật khẩu? Đừng lo, có chúng tôi!
          </h1>
          <p className="auth-hero-sub">
            Chỉ cần nhập số điện thoại đã đăng ký, chúng tôi sẽ gửi mã xác thực
            để bạn đặt lại mật khẩu một cách nhanh chóng và an toàn.
          </p>

          <div className="auth-badge">
            <span role="img" aria-label="shield">
              🔐
            </span>
            Bảo mật tài khoản, an tâm mỗi chuyến đi
          </div>

          <ul className="auth-hero-list">
            <li>Gửi mã xác thực qua số điện thoại</li>
            <li>Hướng dẫn đặt lại mật khẩu từng bước</li>
            <li>Bảo mật thông tin khách hàng</li>
            <li>Hỗ trợ 24/7 khi có vấn đề</li>
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

        {/* Bên phải: Form quên mật khẩu */}
        <section className="auth-card-wrapper">
          <div className="auth-card">
            <h2 className="auth-title">Quên mật khẩu</h2>
            <p className="auth-subtitle">
              Nhập số điện thoại đã đăng ký để nhận mã OTP và đặt lại mật khẩu.
            </p>

            {!sent && (
              <form className="auth-form" onSubmit={handleRequestOtp}>
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

                {error && <div className="auth-error">{error}</div>}
                {success && !error && <div className="auth-success">{success}</div>}

                <button
                  type="submit"
                  disabled={loading || !phone.trim()}
                  className="auth-primary-btn"
                >
                  {loading ? "Đang gửi mã..." : "Gửi mã xác thực"}
                </button>
              </form>
            )}

            {sent && (
              <form className="auth-form" onSubmit={handleResetPassword}>
                <div>
                  <div className="auth-label">Mã OTP</div>
                  <input
                    className="auth-input"
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                  {autoFilled && (
                    <div className="otp-hint">
                      Mã OTP đã được tự động điền. Vui lòng nhấn "Đặt lại mật khẩu" để tiếp tục.
                    </div>
                  )}
                </div>

                <div>
                  <div className="auth-label">Mật khẩu mới</div>
                  <div className="password-input-container">
                    <input
                      className="auth-input"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Ít nhất 8 ký tự, có chữ hoa & ký tự đặc biệt"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="auth-label">Xác nhận mật khẩu mới</div>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="auth-input"
                      placeholder="Nhập lại mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {error && <div className="auth-error">{error}</div>}
                {success && !error && <div className="auth-success">{success}</div>}

                <button type="submit" className="auth-primary-btn" disabled={verifying}>
                  {verifying ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                </button>
              </form>
            )}

            <div className="auth-bottom-text">
              <Link to="/login" className="auth-link">
                ⟵ Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
