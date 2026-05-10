import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Global reset
document.body.style.margin = '0';
document.body.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
// Initialize theme CSS variables for initial render (before Layout mounts)
const _theme = localStorage.getItem('theme') || 'dark';
const themeMap = {
  dark: {
    '--page-bg': '#0a1628',
    '--header-bg': '#0d1f3c',
    '--sidebar-bg': '#0d1f3c',
    '--border': '#1e3a5f',
    '--text-primary': '#ffffff',
    '--text-muted': '#ccd6f6',
    '--text-secondary': '#8892b0',
    '--accent': '#10b981',
    '--nav-bg-active': 'rgba(16,185,129,0.1)',
    '--initials-bg': '#10b981',
    '--card-bg': '#112240',
    '--input-bg': '#0a1628',
    '--input-border': '#233554',
    '--danger': '#ef4444',
  },
  light: {
    '--page-bg': '#f6f8fb',
    '--header-bg': '#ffffff',
    '--sidebar-bg': '#ffffff',
    '--border': '#e6eef8',
    '--text-primary': '#0b1220',
    '--text-muted': '#334155',
    '--text-secondary': '#55607a',
    '--accent': '#0ea5a4',
    '--nav-bg-active': 'rgba(14,165,164,0.08)',
    '--initials-bg': '#6ee7b7',
    '--card-bg': '#ffffff',
    '--input-bg': '#f0f4f8',
    '--input-border': '#e6eef8',
    '--danger': '#ef4444',
  }
};
Object.entries(themeMap[_theme]).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
document.body.style.background = themeMap[_theme]['--page-bg'];
document.body.style.color = themeMap[_theme]['--text-primary'];

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
