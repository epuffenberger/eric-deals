import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import PropertyCard from '../components/PropertyCard';
import { Upload, Plus, X } from 'lucide-react';

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
    image: null,
    imagePreview: null,
    links: []
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '#f3f4f6';
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style.backgroundColor = '#ffffff';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '#ffffff';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { url: '', label: '' }]
    }));
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData(prev => ({
      ...prev,
      links: newLinks
    }));
  };

  const handleRemoveLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;

      // Upload image to Firebase Storage if provided
      if (formData.image) {
        const storageRef = ref(storage, `properties/${Date.now()}-${formData.image.name}`);
        await uploadBytes(storageRef, formData.image);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Filter out empty links
      const validLinks = formData.links.filter(link => link.url.trim() !== '');

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
        imageUrl: imageUrl,
        links: validLinks,
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
        image: null,
        imagePreview: null,
        links: []
      });
      setCsvMessage('✓ Property added successfully!');
      setTimeout(() => setCsvMessage(''), 3000);
    } catch (error) {
      console.error('Error adding property:', error);
      setCsvMessage('Error adding property');
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
            links: [],
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
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Add Property Section */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', padding: '2rem', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 600, color: '#111827', marginBottom: '1.5rem', margin: 0 }}>
            Add New Property
          </h2>

          <form onSubmit={handleAddProperty} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleInputChange} style={inputStyle} required />
            <select name="type" value={formData.type} onChange={handleInputChange} style={inputStyle}>
              <option value="single-family">Single Family</option>
              <option value="multifamily">Multifamily</option>
            </select>
            <input type="number" name="beds" placeholder="Bedrooms" value={formData.beds} onChange={handleInputChange} style={inputStyle} />
            <input type="number" name="baths" placeholder="Bathrooms" value={formData.baths} onChange={handleInputChange} style={inputStyle} />
            <input type="number" name="sqft" placeholder="Square Footage" value={formData.sqft} onChange={handleInputChange} style={inputStyle} />
            <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} style={inputStyle} />
            <input type="text" name="rentRate" placeholder="Monthly Rent Rate" value={formData.rentRate} onChange={handleInputChange} style={inputStyle} />
            <input type="number" name="taxes" placeholder="Annual Property Taxes" value={formData.taxes} onChange={handleInputChange} style={inputStyle} />
          </form>

          <textarea name="notes" placeholder="Your notes about this property" value={formData.notes} onChange={handleInputChange} style={{ ...inputStyle, marginBottom: '1.5rem', minHeight: '100px' }} />

          {/* Image Upload */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#111827', marginBottom: '0.5rem' }}>
              Property Image
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: '2px dashed #d1d5db',
                borderRadius: '0.5rem',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                marginBottom: '1rem'
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="imageInput"
              />
              <label htmlFor="imageInput" style={{ cursor: 'pointer', display: 'block' }}>
                <p style={{ color: '#6b7280', margin: '0 0 0.5rem 0' }}>Drag and drop an image here, or click to select</p>
                <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>

            {formData.imagePreview && (
              <div style={{ marginBottom: '1rem' }}>
                <img src={formData.imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '0.375rem', border: '1px solid #e5e7eb' }} />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image: null, imagePreview: null }))}
                  style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '0.375rem', cursor: 'pointer' }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          {/* Links Section */}
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#111827', marginBottom: '0.5rem' }}>
              Links (Zillow, MLS, Contact, etc.)
            </label>
            
            {formData.links.map((link, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'flex-end' }}>
                <input
                  type="text"
                  placeholder="Link label (e.g., Zillow, MLS, Contact)"
                  value={link.label}
                  onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                  style={{ ...inputStyle, flex: 2 }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveLink(index)}
                  style={{ padding: '0.75rem', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <X size={18} style={{ color: '#dc2626' }} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddLink}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#eff6ff', color: '#0052cc', border: '1px solid #bfdbfe', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
            >
              <Plus size={16} />
              Add Link
            </button>
          </div>

          <button type="submit" onClick={handleAddProperty} disabled={loading} style={{ ...buttonStyle, opacity: loading ? 0.5 : 1 }}>
            {loading ? 'Adding...' : 'Add Property'}
          </button>

          {csvMessage && <div style={{ marginTop: '1rem', fontSize: '14px', color: '#059669' }}>{csvMessage}</div>}

          {/* CSV Upload */}
          <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '2rem', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', marginBottom: '1rem', margin: 0 }}>
              Bulk Import from CSV
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 500, color: '#ffffff', backgroundColor: '#001a4a', cursor: 'pointer', transition: 'opacity 0.2s' }}>
                <Upload size={18} />
                Choose CSV File
                <input type="file" accept=".csv" onChange={handleCSVUpload} style={{ display: 'none' }} />
              </label>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                Format: address,beds,baths,sqft,price,rentrate,taxes,type,notes
              </span>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 600, color: '#111827', marginBottom: '1.5rem', margin: 0 }}>
            Current Properties ({properties.length})
          </h2>

          {properties.length === 0 ? (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: '#6b7280', margin: 0 }}>No properties yet. Add your first deal above!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} onDelete={handleDeleteProperty} isAdmin={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
