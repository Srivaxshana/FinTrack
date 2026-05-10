import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/',             icon: '📊', label: 'Dashboard' },
  { path: '/transactions', icon: '💸', label: 'Transactions' },
  { path: '/budgets',      icon: '🎯', label: 'Budgets' },
  { path: '/categories',   icon: '🏷️',  label: 'Categories' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a1628', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: '#0d1f3c', borderRight: '1px solid #1e3a5f', flexShrink: 0,
        display: 'flex', flexDirection: 'column', padding: '24px 0',
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.2s',
      }}>
        <div style={{ padding: '0 20px 28px', borderBottom: '1px solid #1e3a5f' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: '#10b981', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💳</div>
            <span style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>FinTrack</span>
          </div>
        </div>
        <nav style={{ padding: '20px 12px', flex: 1 }}>
          {navItems.map(item => (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10,
                color: location.pathname === item.path ? '#10b981' : '#8892b0',
                background: location.pathname === item.path ? 'rgba(16,185,129,0.1)' : 'transparent',
                textDecoration: 'none', fontSize: 15, fontWeight: 500, marginBottom: 4,
              }}>
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <header style={{ background: '#0d1f3c', borderBottom: '1px solid #1e3a5f', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: '#ccd6f6', fontSize: 22, cursor: 'pointer', padding: 4 }}>☰</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: '#10b981', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>{initials}</div>
            <button onClick={logout} style={{ background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
              🚪 Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: 28, maxWidth: 1100, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
