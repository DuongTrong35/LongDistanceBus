import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  console.log('Rendering <Login />'); // để chắc chắn file này đang chạy
  const nav = useNavigate();
  const { setAuth } = useAuth();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setSubmitting(true);
      const res = await loginApi({ emailOrPhone, password });
      setAuth(res);
      nav('/');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '48px auto', padding: 24, border: '1px solid #eee', borderRadius: 12 }}>
      <h2>Đăng nhập</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          Email hoặc SĐT
          <input
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            placeholder="a@example.com hoặc 090..."
            style={{ width: '100%', padding: 10, marginTop: 6 }}
          />
        </label>

        <label>
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            style={{ width: '100%', padding: 10, marginTop: 6 }}
          />
        </label>

        {error && <div style={{ color: 'crimson' }}>{error}</div>}

        <button type="submit" disabled={submitting} style={{ padding: '10px 14px' }}>
          {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      <div style={{ marginTop: 12, fontSize: 14 }}>
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </div>
    </div>
  );
}
