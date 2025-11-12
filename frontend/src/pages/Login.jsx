import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
      setErr(ex?.response?.data?.error || ex?.message || "Đăng nhập thất bại");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={onSubmit}>
        <label>Email/Phone</label>
        <input value={emailOrPhone} onChange={e=>setEmailOrPhone(e.target.value)} required />
        <label>Mật khẩu</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {err && <div style={{ color:"red" }}>{err}</div>}
        <button type="submit" disabled={busy}>{busy ? "Đang xử lý..." : "Đăng nhập"}</button>
      </form>
      <p>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
    </div>
  );
}

