import React from 'react';
import { Trash2, ExternalLink } from 'lucide-react';

export default function PropertyCard({ property, onDelete, isAdmin }) {
  const isMultifamily = property.type === 'multifamily';
  const accentColor = isMultifamily ? '#059669' : '#0052cc';
  const bgGradient = isMultifamily ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : 'linear-gradient(135deg, #eff6ff, #dbeafe)';
  const badgeBg = isMultifamily ? '#f0fdf4' : '#eff6ff';

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s' }} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'}>
      
      {/* Image */}
      {property.imageUrl ? (
        <img src={property.imageUrl} alt={property.address} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
      ) : (
        <div style={{ height: '160px', background: bgGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            Property Image
          </div>
        </div>
      )}

      <div style={{ padding: '1.25rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 600, color: '#111827', margin: '0 0 0.25rem 0', fontSize: '16px' }}>
                {property.address}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '12px', fontWeight: 500, padding: '0.25rem 0.5rem', borderRadius: '0.25rem', backgroundColor: badgeBg, color: accentColor }}>
                  {property.type === 'multifamily' ? 'Multifamily' : 'Single Family'}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: 0 }}>
                ${property.price ? (property.price / 1000).toFixed(0) : 0}K
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                List price
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Beds</p>
            <p style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>{property.beds}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Baths</p>
            <p style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>{property.baths}</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Sqft</p>
            <p style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>
              {property.sqft ? property.sqft.toLocaleString() : 'N/A'}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Rent/Mo</p>
            <p style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>
              ${property.rentRate || '—'}
            </p>
          </div>
        </div>

        {/* Taxes */}
        {property.taxes && (
          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Annual Taxes</p>
            <p style={{ fontWeight: 600, color: '#111827', margin: 0 }}>${property.taxes.toLocaleString()}</p>
          </div>
        )}

        {/* Notes */}
        {property.notes && (
          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
            <p style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', margin: '0 0 0.5rem 0' }}>
              Eric's Notes
            </p>
            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5', margin: 0 }}>
              {property.notes}
            </p>
          </div>
        )}

        {/* Links */}
        {property.links && property.links.length > 0 && (
          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
            <p style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', margin: '0 0 0.5rem 0' }}>
              Quick Links
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {property.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#eff6ff',
                    color: '#0052cc',
                    textDecoration: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '13px',
                    fontWeight: 500,
                    border: '1px solid #bfdbfe',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                >
                  {link.label || 'Link'}
                  <ExternalLink size={12} />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Delete Button (Admin Only) */}
        {isAdmin && (
          <button onClick={() => onDelete(property.id)} style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '14px', fontWeight: 500, color: '#dc2626', backgroundColor: '#ffffff', border: '1px solid #fecaca', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}>
            <Trash2 size={16} />
            Delete Property
          </button>
        )}
      </div>
    </div>
  );
}
