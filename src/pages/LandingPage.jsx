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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      display: 'flex',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Left Side - Login Form */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        '@media (min-width: 1024px)': {
          width: '50%'
        }
      }}>
        <div style={{
          width: '100%',
          maxWidth: '28rem',
          margin: '0 auto'
        }}>
          <div style={{ marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: 600,
              color: '#001a4a',
              margin: '0 0 0.5rem 0'
            }}>
              Eric's Deals
            </h1>
            <p style={{
              color: '#6b7280',
              margin: 0,
              fontSize: '16px'
            }}>
              Exclusive weekly real estate opportunities
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                Access Code
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access code"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#b91c1c',
                  margin: 0
                }}>
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: 500,
                color: '#ffffff',
                backgroundColor: '#001a4a',
                border: 'none',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'opacity 0.2s'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid #e5e7eb'
          }}>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              textAlign: 'center',
              margin: 0
            }}>
              Don't have access? Contact Eric for an exclusive invite.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Preview (Hidden on mobile) */}
      <div style={{
        display: 'none',
        width: '50%',
        background: 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem',
        '@media (min-width: 1024px)': {
          display: 'flex'
        }
      }}>
        <div style={{ maxWidth: '28rem' }}>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: 600,
            color: '#111827',
            marginBottom: '1.5rem'
          }}>
            Weekly deals from Eric
          </h2>
          
          <p style={{
            color: '#4b5563',
            marginBottom: '3rem',
            lineHeight: '1.6'
          }}>
            Get exclusive access to hand-picked real estate opportunities before they hit the market.
          </p>

          {/* Preview Card 1 */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db',
            overflow: 'hidden',
            marginBottom: '1rem',
            transition: 'box-shadow 0.2s'
          }}>
            <div style={{
              height: '128px',
              background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}></div>
            <div style={{ padding: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.75rem'
              }}>
                <div>
                  <h3 style={{
                    fontWeight: 600,
                    color: '#111827',
                    fontSize: '14px',
                    margin: '0 0 0.25rem 0'
                  }}>
                    123 Main Street
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    Single Family
                  </p>
                </div>
                <span style={{
                  fontWeight: 600,
                  color: '#111827',
                  fontSize: '14px'
                }}>
                  $450K
                </span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                fontSize: '12px'
              }}>
                <div>
                  <p style={{ color: '#6b7280', margin: 0 }}>Beds</p>
                  <p style={{ fontWeight: 600, color: '#111827', margin: '0.25rem 0 0 0' }}>4</p>
                </div>
                <div>
                  <p style={{ color: '#6b7280', margin: 0 }}>Baths</p>
                  <p style={{ fontWeight: 600, color: '#111827', margin: '0.25rem 0 0 0' }}>2</p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Card 2 */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db',
            overflow: 'hidden',
            marginBottom: '1.5rem',
            transition: 'box-shadow 0.2s'
          }}>
            <div style={{
              height: '128px',
              background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}></div>
            <div style={{ padding: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.75rem'
              }}>
                <div>
                  <h3 style={{
                    fontWeight: 600,
                    color: '#111827',
                    fontSize: '14px',
                    margin: '0 0 0.25rem 0'
                  }}>
                    456 Oak Avenue
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    Multifamily
                  </p>
                </div>
                <span style={{
                  fontWeight: 600,
                  color: '#111827',
                  fontSize: '14px'
                }}>
                  $850K
                </span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                fontSize: '12px'
              }}>
                <div>
                  <p style={{ color: '#6b7280', margin: 0 }}>Units</p>
                  <p style={{ fontWeight: 600, color: '#111827', margin: '0.25rem 0 0 0' }}>8</p>
                </div>
                <div>
                  <p style={{ color: '#6b7280', margin: 0 }}>Cap Rate</p>
                  <p style={{ fontWeight: 600, color: '#111827', margin: '0.25rem 0 0 0' }}>6.2%</p>
                </div>
              </div>
            </div>
          </div>

          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: 0
          }}>
            Sign in above to view all available opportunities
          </p>
        </div>
      </div>
    </div>
  );
}
