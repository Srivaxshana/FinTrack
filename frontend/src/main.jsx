import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Global reset
document.body.style.margin = '0';
document.body.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
document.body.style.background = '#0a1628';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
