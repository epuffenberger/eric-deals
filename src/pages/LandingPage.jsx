import React, { useState } from 'react';

export default function LandingPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password === 'Toledo2026') {
      onLogin();
    } else {
      setError('Invalid password');
      setPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left: Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-semibold mb-2" style={{ color: '#001a4a' }}>Eric's Deals</h1>
            <p className="text-gray-600">Exclusive weekly real estate opportunities</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Access Code
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-medium text-white transition disabled:opacity-50"
              style={{ backgroundColor: '#001a4a' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Don't have access? Contact Eric for an exclusive invite.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 flex-col justify-center px-12">
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Weekly deals from Eric</h2>
          <p className="text-gray-600 mb-12">Get exclusive access to hand-picked real estate opportunities before they hit the market.</p>

          {/* Preview Cards */}
          <div className="space-y-4">
            {/* Single Family Card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100"></div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">123 Main Street</h3>
                    <p className="text-xs text-gray-500">Single Family</p>
                  </div>
                  <span className="font-semibold text-gray-900">$450K</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><p className="text-gray-500">Beds</p><p className="font-medium text-gray-900">4</p></div>
                  <div><p className="text-gray-500">Baths</p><p className="font-medium text-gray-900">2</p></div>
                </div>
              </div>
            </div>

            {/* Multifamily Card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="h-32 bg-gradient-to-br from-emerald-50 to-emerald-100"></div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">456 Oak Avenue</h3>
                    <p className="text-xs text-gray-500">Multifamily</p>
                  </div>
                  <span className="font-semibold text-gray-900">$850K</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><p className="text-gray-500">Units</p><p className="font-medium text-gray-900">8</p></div>
                  <div><p className="text-gray-500">Cap Rate</p><p className="font-medium text-gray-900">6.2%</p></div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-6">Sign in above to view all available opportunities</p>
        </div>
      </div>
    </div>
  );
}
