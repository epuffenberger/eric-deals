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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-600">Loading opportunities...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Weekly Opportunities</h1>
          <p className="text-gray-600">Exclusive deals updated every week</p>
        </div>

        {/* Filter Buttons */}
        {properties.length > 0 && (
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                filterType === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              All ({properties.length})
            </button>
            <button
              onClick={() => setFilterType('single-family')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                filterType === 'single-family'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Single Family ({properties.filter(p => p.type === 'single-family' || !p.type).length})
            </button>
            <button
              onClick={() => setFilterType('multifamily')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                filterType === 'multifamily'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Multifamily ({properties.filter(p => p.type === 'multifamily').length})
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No opportunities available yet.</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for exclusive deals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
