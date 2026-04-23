import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInAnonymously, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import LoginPage from './pages/LoginPage';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async (password) => {
    if (password === 'Toledo2026') {
      try {
        const result = await signInAnonymously(auth);
        await updateProfile(result.user, { displayName: 'Client' });
        return true;
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    }
    return false;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a472a]">
        <div className="text-center">
          <div className="text-4xl font-bold text-[#ffd700] mb-2">ERIC'S DEALS</div>
          <div className="text-[#ffd700]">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#1a472a]">
      <nav className="bg-[#0d2618] border-b-4 border-[#ffd700]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#ffd700]">ERIC'S DEALS</h1>
          <div className="flex items-center gap-6">
            {isAdmin && <div className="text-[#ffd700] font-bold text-sm">ADMIN MODE</div>}
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className="text-[#ffd700] hover:text-white font-bold transition px-3 py-1 border border-[#ffd700] rounded hover:bg-[#ffd700] hover:text-[#0d2618]"
            >
              {isAdmin ? 'View as Client' : 'Admin'}
            </button>
            <button
              onClick={handleLogout}
              className="text-[#ffd700] hover:text-white font-bold transition px-3 py-1 border border-[#ffd700] rounded hover:bg-[#ffd700] hover:text-[#0d2618]"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
    </div>
  );
}
