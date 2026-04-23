import React, { useState } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import './App.css';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

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
          </div>
        </div>
      </nav>
      {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
    </div>
  );
}
