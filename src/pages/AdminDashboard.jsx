import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import PropertyCard from '../components/PropertyCard';
import { Upload } from 'lucide-react';

const COLORS = ['lightblue', 'brown', 'purple', 'orange', 'red', 'yellow', 'green', 'darkblue'];

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
    color: 'lightblue'
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
        color: formData.color,
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
        color: 'lightblue'
      });
      setCsvMessage('Property added successfully!');
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
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            createdAt: new Date()
          };

          await addDoc(collection(db, 'properties'), property);
          count++;
        }

        setCsvMessage(`✓ Successfully imported ${count} properties!`);
        setTimeout(() => setCsvMessage(''), 4000);
        e.target.value = '';
      } catch (error) {
        setCsvMessage('Error parsing CSV. Format: address,beds,baths,sqft,price,rentrate,taxes,notes');
        console.error('CSV Error:', error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 bg-[#0d2618] border-4 border-[#ffd700] rounded-lg p-6">
        <h2 className="text-2xl font-bold text-[#ffd700] mb-6">Add New Property</h2>

        <form onSubmit={handleAddProperty} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            value={formData.address}
            onChange={handleInputChange}
            className="px-3 py-2 border-2 border-[#ffd700] bg-white text-black rounded font-bold"
            required
          />

          <input
            type="number"
            name="beds"
            placeholder="Bedrooms"
            value={formData.beds}
            onChange={handleInputChange}
            className="px-3 py-2 border-2 border-[#ffd700] bg-white text-black rounded font-bold"
          />

          <input
            type="number"
            name="baths"
            placeholder="Bathrooms"
            value={formData.baths}
            onChange={handleInputChange}
            className="px-3 py-2 border-2 border-[#ffd700] bg-white text-black rounded font-bold"
          />

          <input
            type="number"
            name="sqft"
            placeholder="Square Footage"
            value={formData.sqft}
            onChange={handleInputChange}
            className="px-3 py-2 border-2 border-[#ffd700] bg-white text-black rounded font-bold"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleInputChange}
            className="px-3 py-2 border-2 border-[#ffd700] bg-white text-black rounded font-bold"
          />

          <input
            type="text"
            name="rentRate"
            placeholder="Monthly Rent Rate"
            value={formData.rentRate}
            onChange={handleInputChange}
            className="px-3 py-2 border-2 border-[#ffd700] bg-white text-black rounded font-bold"
          />

          <input
            type="number"
            name="taxes"
            placeholder="Annual Property Taxes"
            value={formData.taxes}
            onChange={handleInputChange}
            className="px-3 py-2 border-2 border-[#ffd700] bg-white text-black rounded font-bold"
          />

          <select
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            className="px-3 py-2 border-2 border-[#ffd700] bg-white text-black rounded font-bold"
          >
            {COLORS.map(color => (
              <option key={color} value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>
            ))}
          </select>

          <textarea
            name="notes"
            placeholder="Your notes about this property"
            value={formData.notes}
            onChange={handleInputChange}
            className="px-3 py-2 border-2 border-[#ffd700] bg-white text-black rounded font-bold md:col-span-2"
            rows="2"
          />

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-[#ffd700] text-[#0d2618] font-bold py-3 rounded border-2 border-[#ffd700] hover:bg-white transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Adding...' : 'Add Property'}
          </button>
        </form>

        <div className="border-t-2 border-[#ffd700] pt-6">
          <h3 className="text-xl font-bold text-[#ffd700] mb-4">Import from CSV (MLS)</h3>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 px-4 py-2 bg-[#ffd700] text-[#0d2618] font-bold rounded border-2 border-[#ffd700] cursor-pointer hover:bg-white transition">
              <Upload size={20} />
              Choose CSV File
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
            </label>
            <span className="text-[#ffd700] text-sm">Format: address,beds,baths,sqft,price,rentrate,taxes,notes</span>
          </div>
          {csvMessage && (
            <div className="mt-2 text-sm text-[#ffd700] font-bold">
              {csvMessage}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#ffd700] mb-4">Current Properties ({properties.length})</h2>
      </div>

      {properties.length === 0 ? (
        <div className="bg-[#0d2618] border-4 border-[#ffd700] rounded-lg p-8 text-center">
          <p className="text-[#ffd700] text-lg font-bold">No properties yet. Add your first deal above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(property => (
            <div key={property.id} className="flex justify-center">
              <PropertyCard
                property={property}
                onDelete={handleDeleteProperty}
                isAdmin={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
