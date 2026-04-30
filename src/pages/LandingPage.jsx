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
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '28rem', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 600, color: '#001a4a', margin: '0 0 0.5rem 0' }}>
              Eric's Deals
            </h1>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '16px' }}>
              Exclusive weekly real estate opportunities
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#111827', marginBottom: '0.5rem' }}>
                Access Code
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access code"
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '16px', boxSizing: 'border-box' }}
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '14px', color: '#b91c1c', margin: 0 }}>
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontWeight: 500, color: '#ffffff', backgroundColor: '#001a4a', border: 'none', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', margin: 0 }}>
              Don't have access? Contact Eric for an exclusive invite.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
