import { useState } from "react";
import { Link } from "react-router-dom";
import "./Forgot.css";

export default function Forgot() {
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSent(false);
    setLoading(true);

    try {
      // TODO: Gọi API gửi mã xác thực quên mật khẩu tại đây
      // ví dụ: await authApi.forgotPassword(phone);
      await new Promise((resolve) => setTimeout(resolve, 600)); // giả lập delay

      setSent(true);
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
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
              Nhập <b>số điện thoại đã đăng ký</b> để nhận mã xác thực đặt lại
              mật khẩu.
            </p>

            <form className="auth-form" onSubmit={onSubmit}>
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

              {sent && !error && (
                <div className="auth-success">
                  Nếu số điện thoại đã được đăng ký, mã xác thực sẽ được gửi đến
                  điện thoại của bạn.
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !phone.trim()}
                className="auth-primary-btn"
              >
                {loading ? "Đang gửi mã..." : "Gửi mã xác thực"}
              </button>
            </form>

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
