import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import PropertyCard from '../components/PropertyCard';
import { Upload } from 'lucide-react';

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

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    fontWeight: 500,
    color: '#ffffff',
    backgroundColor: '#001a4a',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'opacity 0.2s'
  };

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
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
          padding: '2rem',
          marginBottom: '3rem'
        }}>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: 600,
            color: '#111827',
            marginBottom: '1.5rem',
            margin: 0
          }}>
            Add New Property
          </h2>

          <form onSubmit={handleAddProperty} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <input
              type="text"
              name="address"
              placeholder="Street Address"
              value={formData.address}
              onChange={handleInputChange}
              style={inputStyle}
              required
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              style={inputStyle}
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
              style={inputStyle}
            />

            <input
              type="number"
              name="baths"
              placeholder="Bathrooms"
              value={formData.baths}
              onChange={handleInputChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="sqft"
              placeholder="Square Footage"
              value={formData.sqft}
              onChange={handleInputChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="rentRate"
              placeholder="Monthly Rent Rate"
              value={formData.rentRate}
              onChange={handleInputChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="taxes"
              placeholder="Annual Property Taxes"
              value={formData.taxes}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </form>

          <textarea
            name="notes"
            placeholder="Your notes about this property"
            value={formData.notes}
            onChange={handleInputChange}
            style={{
              ...inputStyle,
              marginBottom: '1.5rem',
              minHeight: '100px'
            }}
          />

          <button
            type="button"
            onClick={handleAddProperty}
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? 'Adding...' : 'Add Property'}
          </button>

          {csvMessage && (
            <div style={{
              marginTop: '1rem',
              fontSize: '14px',
              color: '#059669'
            }}>
              {csvMessage}
            </div>
          )}

          <div style={{
            borderTop: '1px solid #e5e7eb',
            marginTop: '2rem',
            paddingTop: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#111827',
              marginBottom: '1rem',
              margin: 0
            }}>
              Bulk Import from CSV
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                fontWeight: 500,
                color: '#ffffff',
                backgroundColor: '#001a4a',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}>
                <Upload size={18} />
                Choose CSV File
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  style={{ display: 'none' }}
                />
              </label>
              <span style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Format: address,beds,baths,sqft,price,rentrate,taxes,type,notes
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: 600,
            color: '#111827',
            marginBottom: '1.5rem',
            margin: 0
          }}>
            Current Properties ({properties.length})
          </h2>

          {properties.length === 0 ? (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              padding: '3rem',
              textAlign: 'center'
            }}>
              <p style={{ color: '#6b7280', margin: 0 }}>No properties yet. Add your first deal above!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
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
