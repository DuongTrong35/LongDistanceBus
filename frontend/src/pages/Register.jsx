import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      await register({ fullName, email, phone, password });
      nav('/'); // auto login sau đăng ký
    } catch (e) {
      setErr(e.message || 'Register failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2>Đăng ký</h2>
      <form onSubmit={onSubmit}>
        <label>Họ tên</label>
        <input value={fullName} onChange={e => setFullName(e.target.value)} required />
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>SĐT (tuỳ chọn)</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} />
        <label>Mật khẩu</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button disabled={loading} type="submit">{loading ? 'Đang đăng ký...' : 'Đăng ký'}</button>
      </form>
      {err && <p style={{color:'red'}}>{err}</p>}
      <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
    </div>
  );
}

