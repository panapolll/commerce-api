import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { register } from '../api/auth';
import {
  formatApiError,
  validateEmail,
  validatePassword,
} from '../utils/authValidation';

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const nextEmailError = validateEmail(email) ?? '';
    const nextPasswordError = validatePassword(password) ?? '';
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) return;

    setLoading(true);

    try {
      await register(email.trim(), password);
      navigate('/login', { state: { message: '✅ สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ' } });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(formatApiError(err.response?.data?.message, 'สมัครสมาชิกไม่สำเร็จ'));
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

        <form onSubmit={handleSubmit} noValidate style={{ display: 'grid', gap: 12 }}>
          <div>
            <input
              type="text"
              inputMode="email"
              autoComplete="email"
              placeholder="อีเมล"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              style={inputStyle(emailError)}
            />
            {emailError && <p style={fieldErrorStyle}>{emailError}</p>}
          </div>
          <div>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              style={inputStyle(passwordError)}
            />
            {passwordError && <p style={fieldErrorStyle}>{passwordError}</p>}
          </div>
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

function inputStyle(hasError: string): React.CSSProperties {
  return {
    background: '#1a1a1a',
    border: `1px solid ${hasError ? '#ff4d4d' : '#333'}`,
    color: '#fff',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 14,
    width: '100%',
    boxSizing: 'border-box',
  };
}

const fieldErrorStyle: React.CSSProperties = {
  color: '#ff4d4d',
  margin: '6px 0 0',
  fontSize: 13,
};

export default RegisterPage;
