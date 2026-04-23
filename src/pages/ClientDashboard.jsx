import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import PropertyCard from '../components/PropertyCard';

export default function ClientDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-[#ffd700] text-2xl font-bold">Loading deals...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#ffd700] mb-2">This Week's Deals</h2>
        <p className="text-[#ffd700] text-lg">
          {properties.length === 0 
            ? 'No deals available yet. Check back soon!' 
            : `${properties.length} exclusive ${properties.length === 1 ? 'opportunity' : 'opportunities'} available`}
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="bg-[#0d2618] border-4 border-[#ffd700] rounded-lg p-8 text-center">
          <div className="text-[#ffd700] text-xl font-bold">Coming Soon</div>
          <p className="text-[#ffd700] mt-2">Eric will add new deals weekly. Stay tuned!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(property => (
            <div key={property.id} className="flex justify-center">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
