import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold" style={{ color: '#001a4a' }}>Eric's Deals</h1>
          <div className="flex items-center gap-4">
            {isAdmin && <span className="text-xs font-medium px-3 py-1 bg-blue-50 text-blue-700 rounded">Admin Mode</span>}
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className="text-sm font-medium px-4 py-2 rounded border border-gray-200 hover:bg-gray-50 transition"
            >
              {isAdmin ? 'View as Client' : 'Admin'}
            </button>
            <button
              onClick={handleLogout}
              className="text-sm font-medium px-4 py-2 rounded border border-gray-200 hover:bg-gray-50 transition"
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
