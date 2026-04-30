import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import PropertyCard from '../components/PropertyCard';

export default function ClientDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const props = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProperties(props);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filteredProperties = filterType === 'all' 
    ? properties 
    : properties.filter(p => p.type === filterType);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <div style={{ color: '#6b7280' }}>Loading opportunities...</div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      padding: '3rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 600,
            color: '#111827',
            marginBottom: '0.5rem',
            margin: 0
          }}>
            Weekly Opportunities
          </h1>
          <p style={{
            color: '#6b7280',
            margin: 0
          }}>
            Exclusive deals updated every week
          </p>
        </div>

        {/* Filter Buttons */}
        {properties.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            {[
              { label: 'All', value: 'all', count: properties.length },
              { label: 'Single Family', value: 'single-family', count: properties.filter(p => p.type === 'single-family' || !p.type).length },
              { label: 'Multifamily', value: 'multifamily', count: properties.filter(p => p.type === 'multifamily').length }
            ].map(btn => (
              <button
                key={btn.value}
                onClick={() => setFilterType(btn.value)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontWeight: 500,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: filterType === btn.value ? (btn.value === 'multifamily' ? '#059669' : btn.value === 'single-family' ? '#0052cc' : '#111827') : '#ffffff',
                  color: filterType === btn.value ? '#ffffff' : '#374151',
                  borderBottom: filterType !== btn.value ? '1px solid #d1d5db' : 'none'
                }}
              >
                {btn.label} ({btn.count})
              </button>
            ))}
          </div>
        )}

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            padding: '3rem',
            textAlign: 'center'
          }}>
            <p style={{ color: '#6b7280', margin: 0 }}>No opportunities available yet.</p>
            <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0.5rem 0 0 0' }}>Check back soon for exclusive deals!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
