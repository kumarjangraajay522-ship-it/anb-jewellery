import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, useLocation } from 'react-router-dom'

// --- 1. Yahan Humne ScrollToTop Component Banaya ---
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Jab bhi naya page khulega (pathname change hoga), ye top par le jayega
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// --- 2. Render Section ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      {/* ScrollToTop ko yahan App se pehle laga diya */}
      <ScrollToTop />
      <App />
  </BrowserRouter>
)