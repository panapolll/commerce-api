import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { register } from '../api/auth';

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password);
      navigate('/login', { state: { message: '✅ สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ' } });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'สมัครสมาชิกไม่สำเร็จ');
      } else {
        setError('สมัครสมาชิกไม่สำเร็จ');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <h1 style={{ color: '#fff', textAlign: 'center', marginBottom: 8 }}>🍎 สมัครสมาชิก</h1>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: 24 }}>สร้างบัญชีเพื่อเริ่มช้อปผลไม้</p>

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
            {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
          </button>
        </form>

        <p style={{ color: '#888', textAlign: 'center', marginTop: 16 }}>
          มีบัญชีแล้ว? <Link to="/login" style={{ color: '#4ade80' }}>เข้าสู่ระบบ</Link>
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

export default RegisterPage;
