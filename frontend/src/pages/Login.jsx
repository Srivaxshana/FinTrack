import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #0a1628 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ background: '#10b981', borderRadius: 10, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>💳</div>
          <span style={{ color: '#fff', fontSize: 26, fontWeight: 700 }}>FinTrack</span>
        </div>
        <div style={{ background: '#112240', borderRadius: 16, padding: '36px 40px', width: 380, boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
          <h2 style={{ color: '#fff', margin: '0 0 8px', fontSize: 24 }}>Welcome back</h2>
          <p style={{ color: '#8892b0', marginBottom: 28, fontSize: 14 }}>Sign in to continue managing your finances.</p>
          {error && <div style={{ background: '#2d1b1b', color: '#f87171', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16, textAlign: 'left' }}>
              <label style={{ color: '#ccd6f6', fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 6 }}>Email</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ width: '100%', background: '#0a1628', border: '1px solid #233554', borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 14, boxSizing: 'border-box' }} required />
            </div>
            <div style={{ marginBottom: 8, textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ color: '#ccd6f6', fontSize: 14, fontWeight: 600 }}>Password</label>
                <span style={{ color: '#10b981', fontSize: 13, cursor: 'pointer' }}>Forgot?</span>
              </div>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ width: '100%', background: '#0a1628', border: '1px solid #233554', borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 14, boxSizing: 'border-box' }} required />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', background: '#10b981', border: 'none', borderRadius: 8, padding: '13px', color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer', marginTop: 20, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
        <p style={{ color: '#8892b0', marginTop: 24, fontSize: 14 }}>
          Don't have an account? <Link to="/register" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
