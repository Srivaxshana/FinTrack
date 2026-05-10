import { useState, useEffect } from 'react';
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
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const themeTokens = {
      '--page-bg': t.pageBg,
      '--header-bg': t.headerBg,
      '--sidebar-bg': t.sidebarBg,
      '--border': t.border,
      '--text-primary': t.textPrimary,
      '--text-muted': t.textMuted,
      '--text-secondary': t.textSecondary,
      '--accent': t.accent,
      '--nav-bg-active': t.navBgActive,
      '--initials-bg': t.initialsBg,
      '--card-bg': t.cardBg,
      '--input-bg': t.inputBg,
      '--input-border': t.inputBorder,
      '--danger': t.danger,
    };
    const root = document.documentElement;
    Object.entries(themeTokens).forEach(([k, v]) => root.style.setProperty(k, v));
    document.body.style.background = t.pageBg;
    document.body.style.color = t.textPrimary;
  }, [theme]);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  const themes = {
    dark: {
      pageBg: '#0a1628',
      headerBg: '#0d1f3c',
      sidebarBg: '#0d1f3c',
      border: '#1e3a5f',
      textPrimary: '#ffffff',
      textMuted: '#ccd6f6',
      textSecondary: '#8892b0',
      accent: '#10b981',
      navBgActive: 'rgba(16,185,129,0.1)',
      initialsBg: '#10b981',
      cardBg: '#112240',
      inputBg: '#0a1628',
      inputBorder: '#233554',
      danger: '#ef4444',
    },
    light: {
      pageBg: '#f6f8fb',
      headerBg: '#ffffff',
      sidebarBg: '#ffffff',
      border: '#e6eef8',
      textPrimary: '#0b1220',
      textMuted: '#334155',
      textSecondary: '#55607a',
      accent: '#0ea5a4',
      navBgActive: 'rgba(14,165,164,0.08)',
      initialsBg: '#6ee7b7',
      cardBg: '#ffffff',
      inputBg: '#f0f4f8',
      inputBorder: '#e6eef8',
      danger: '#ef4444',
    }
  };

  const t = themes[theme] || themes.dark;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: t.pageBg, fontFamily: 'Inter, sans-serif', color: t.textPrimary }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: t.sidebarBg, borderRight: `1px solid ${t.border}`, flexShrink: 0,
        display: 'flex', flexDirection: 'column', padding: '24px 0',
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.2s',
      }}>
        <div style={{ padding: '0 20px 28px', borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: t.accent, borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💳</div>
            <span style={{ color: t.textPrimary, fontSize: 20, fontWeight: 700 }}>FinTrack</span>
          </div>
        </div>
        <nav style={{ padding: '20px 12px', flex: 1 }}>
          {navItems.map(item => (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10,
                color: location.pathname === item.path ? t.accent : t.textSecondary,
                background: location.pathname === item.path ? t.navBgActive : 'transparent',
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
        <header style={{ background: t.headerBg, borderBottom: `1px solid ${t.border}`, padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: t.textMuted, fontSize: 22, cursor: 'pointer', padding: 4 }}>☰</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: t.initialsBg, borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textPrimary, fontWeight: 700, fontSize: 14 }}>{initials}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme" title="Toggle theme" style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: 18 }}>
                {theme === 'dark' ? '🌞' : '🌙'}
              </button>
              <button onClick={logout} style={{ background: 'none', border: 'none', color: t.textSecondary, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                🚪 Logout
              </button>
            </div>
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
