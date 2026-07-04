import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserIdFromToken, login } from '../api/auth';

interface LoginPageProps {
  onLogin: (accessToken: string, refresh: string, userId: string) => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = (location.state as { message?: string } | null)?.message;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      const userId = getUserIdFromToken(data.access_token);
      if (!userId) {
        setError('ไม่สามารถอ่าน user id จาก token ได้');
        return;
      }
      onLogin(data.access_token, data.refresh_token, userId);
      navigate('/products');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'เข้าสู่ระบบไม่สำเร็จ');
      } else {
        setError('เข้าสู่ระบบไม่สำเร็จ');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: 8 }}>🍎 Fruit Shop</h1>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: 24 }}>เข้าสู่ระบบเพื่อช้อปผลไม้</p>

        {successMessage && (
          <p style={{ color: '#4ade80', textAlign: 'center', marginBottom: 16 }}>{successMessage}</p>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          {error && <p style={{ color: '#ff4d4d', margin: 0 }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#4ade80',
              border: 'none',
              color: '#000',
              padding: '12px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <p style={{ color: '#888', textAlign: 'center', marginTop: 16 }}>
          ยังไม่มีบัญชี? <Link to="/register" style={{ color: '#4ade80' }}>สมัครสมาชิก</Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid #333',
  color: '#fff',
  padding: '10px 14px',
  borderRadius: 8,
  fontSize: 14,
};

export default LoginPage;
