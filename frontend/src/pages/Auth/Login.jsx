import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login: loginCtx } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await loginCtx(emailOrPhone, password);
      const redirect = loc.state?.from?.pathname || "/";
      nav(redirect, { replace: true });
    } catch (ex) {
      setErr(
        ex?.response?.data?.error ||
          ex?.message ||
          "Đăng nhập thất bại, vui lòng thử lại."
      );
    } finally {
      setBusy(false);
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

        {/* Bên phải: Form đăng nhập */}
        <section className="auth-card-wrapper">
          <div className="auth-card">
            <div className="auth-tabs">
              <button
                type="button"
                className="auth-tab auth-tab--active"
              >
                Đăng nhập
              </button>
              <Link to="/register" className="auth-tab">
                Đăng ký
              </Link>
            </div>

            <h2 className="auth-title">Đăng nhập tài khoản</h2>
            <p className="auth-subtitle">
              Nhập số điện thoại hoặc email và mật khẩu để tiếp tục đặt vé.
            </p>

            <form className="auth-form" onSubmit={onSubmit}>
              <div>
                <div className="auth-label">Số điện thoại / Email</div>
                <input
                  className="auth-input"
                  placeholder="Nhập số điện thoại hoặc email"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="auth-label">Mật khẩu</div>
                <input
                  className="auth-input"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {err && <div className="auth-error">{err}</div>}

              <button
                type="submit"
                disabled={busy}
                className="auth-primary-btn"
              >
                {busy ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              <div className="auth-forgot-row">
                <Link to="/forgot" className="auth-link" style={{ cursor: "pointer" }}>
                  Quên mật khẩu?
                </Link>
              </div>
            </form>

            <div className="auth-bottom-text">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="auth-link">
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
