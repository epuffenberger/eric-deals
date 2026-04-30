import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <nav style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#001a4a',
            margin: 0
          }}>
            Eric's Deals
          </h1>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {isAdmin && (
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                padding: '0.5rem 0.75rem',
                backgroundColor: '#dbeafe',
                color: '#0052cc',
                borderRadius: '4px'
              }}>
                Admin Mode
              </span>
            )}
            
            <button
              onClick={handleLogout}
              style={{
                fontSize: '14px',
                fontWeight: 500,
                padding: '0.5rem 1rem',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      
      {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
    </div>
  );
}
