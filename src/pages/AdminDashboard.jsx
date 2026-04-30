import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import PropertyCard from '../components/PropertyCard';
import { Upload } from 'lucide-react';

const COLORS = ['blue', 'emerald'];

export default function AdminDashboard() {
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    address: '',
    beds: '',
    baths: '',
    sqft: '',
    price: '',
    rentRate: '',
    taxes: '',
    notes: '',
    type: 'single-family',
  });
  const [loading, setLoading] = useState(false);
  const [csvMessage, setCsvMessage] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const props = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProperties(props);
    });
    return unsubscribe;
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'properties'), {
        address: formData.address,
        beds: parseInt(formData.beds) || 0,
        baths: parseInt(formData.baths) || 0,
        sqft: parseInt(formData.sqft) || 0,
        price: parseInt(formData.price) || 0,
        rentRate: formData.rentRate,
        taxes: parseInt(formData.taxes) || 0,
        notes: formData.notes,
        type: formData.type,
        createdAt: new Date()
      });

      setFormData({
        address: '',
        beds: '',
        baths: '',
        sqft: '',
        price: '',
        rentRate: '',
        taxes: '',
        notes: '',
        type: 'single-family',
      });
      setCsvMessage('✓ Property added successfully!');
      setTimeout(() => setCsvMessage(''), 3000);
    } catch (error) {
      console.error('Error adding property:', error);
    }
    setLoading(false);
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Delete this property?')) {
      try {
        await deleteDoc(doc(db, 'properties', id));
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCsvMessage('Processing CSV...');
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const csv = event.target.result;
        const lines = csv.trim().split('\n');
        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());

        let count = 0;
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());

          if (values.filter(v => v).length === 0) continue;

          const property = {
            address: values[headers.indexOf('address')] || values[0],
            beds: parseInt(values[headers.indexOf('beds')]) || 0,
            baths: parseInt(values[headers.indexOf('baths')]) || 0,
            sqft: parseInt(values[headers.indexOf('sqft')]) || 0,
            price: parseInt(values[headers.indexOf('price')]) || 0,
            rentRate: values[headers.indexOf('rentrate')] || values[headers.indexOf('rent rate')] || '',
            taxes: parseInt(values[headers.indexOf('taxes')]) || 0,
            notes: values[headers.indexOf('notes')] || '',
            type: values[headers.indexOf('type')] === 'multifamily' ? 'multifamily' : 'single-family',
            createdAt: new Date()
          };

          await addDoc(collection(db, 'properties'), property);
          count++;
        }

        setCsvMessage(`✓ Successfully imported ${count} properties!`);
        setTimeout(() => setCsvMessage(''), 4000);
        e.target.value = '';
      } catch (error) {
        setCsvMessage('Error parsing CSV. Format: address,beds,baths,sqft,price,rentrate,taxes,type,notes');
        console.error('CSV Error:', error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Add Property Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Property</h2>

          <form onSubmit={handleAddProperty} className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleInputChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="single-family">Single Family</option>
                <option value="multifamily">Multifamily</option>
              </select>

              <input
                type="number"
                name="beds"
                placeholder="Bedrooms"
                value={formData.beds}
                onChange={handleInputChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                name="baths"
                placeholder="Bathrooms"
                value={formData.baths}
                onChange={handleInputChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                name="sqft"
                placeholder="Square Footage"
                value={formData.sqft}
                onChange={handleInputChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="rentRate"
                placeholder="Monthly Rent Rate"
                value={formData.rentRate}
                onChange={handleInputChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                name="taxes"
                placeholder="Annual Property Taxes"
                value={formData.taxes}
                onChange={handleInputChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <textarea
              name="notes"
              placeholder="Your notes about this property"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-medium text-white transition disabled:opacity-50"
              style={{ backgroundColor: '#001a4a' }}
            >
              {loading ? 'Adding...' : 'Add Property'}
            </button>
          </form>

          {/* CSV Upload */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Import from CSV</h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white cursor-pointer transition" style={{ backgroundColor: '#001a4a' }}>
                <Upload size={18} />
                Choose CSV File
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-600">Format: address,beds,baths,sqft,price,rentrate,taxes,type,notes</span>
            </div>
            {csvMessage && (
              <div className="mt-3 text-sm text-gray-700">
                {csvMessage}
              </div>
            )}
          </div>
        </div>

        {/* Properties List */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Current Properties ({properties.length})</h2>

          {properties.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-600">No properties yet. Add your first deal above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onDelete={handleDeleteProperty}
                  isAdmin={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
