import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import './App.css';

const SESSION_KEY = 'txgov_auth';
const PASSWORD = process.env.REACT_APP_PASSWORD || 'signature2026';

export default function App() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const s = sessionStorage.getItem(SESSION_KEY);
    if (s === 'true') setAuthed(true);
  }, []);

  const handleLogin = (pw) => {
    if (pw === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setAuthed(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  if (!authed) return <Login onLogin={handleLogin} />;
  return <Dashboard onLogout={handleLogout} />;
}
