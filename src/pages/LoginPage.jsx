import React, { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await onLogin(password);
    if (!success) {
      setError('Invalid password');
      setPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1a472a] flex items-center justify-center p-4">
      <div className="bg-[#ffd700] border-8 border-black p-8 rounded-lg shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#0d2618] mb-2">ERIC'S DEALS</h1>
          <p className="text-[#0d2618] font-bold text-sm">Weekly Property Opportunities</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-[#0d2618] font-bold text-sm mb-2">
              Enter Password to Access Deals
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-[#0d2618] rounded font-bold text-center text-lg"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-500 text-white px-3 py-2 rounded mb-4 font-bold text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0d2618] text-[#ffd700] font-bold py-3 rounded border-2 border-[#0d2618] hover:bg-[#1a472a] transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Logging in...' : 'Enter'}
          </button>
        </form>

        <div className="mt-6 text-center text-[#0d2618] text-xs">
          <p>This is an exclusive marketplace.</p>
          <p>Check back weekly for new deals!</p>
        </div>
      </div>
    </div>
  );
}
