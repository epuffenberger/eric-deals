import React from 'react';
import { Trash2 } from 'lucide-react';

export default function PropertyCard({ property, onDelete, isAdmin }) {
  const isMultifamily = property.type === 'multifamily';
  
  // Colors: Blue for single family, Emerald for multifamily
  const colors = {
    accent: isMultifamily ? '#059669' : '#0052cc',
    bg: isMultifamily ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    badge: isMultifamily ? '#10b981' : '#0052cc',
    badgeBg: isMultifamily ? '#f0fdf4' : '#eff6ff',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header Image Placeholder */}
      <div style={{ background: colors.bg }} className="h-40 flex items-center justify-center border-b border-gray-200">
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-2">Property Image</div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Top Section: Address + Price */}
        <div className="mb-4 pb-4 border-b border-gray-100">
          <div className="flex justify-between items-start gap-3 mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{property.address}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs font-medium px-2 py-1 rounded"
                  style={{
                    backgroundColor: colors.badgeBg,
                    color: colors.badge,
                  }}
                >
                  {property.type === 'multifamily' ? 'Multifamily' : 'Single Family'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-gray-900">
                ${property.price ? (property.price / 1000).toFixed(0) : 0}K
              </p>
              <p className="text-xs text-gray-500">List price</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Beds</p>
            <p className="text-lg font-semibold text-gray-900">{property.beds}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Baths</p>
            <p className="text-lg font-semibold text-gray-900">{property.baths}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Sqft</p>
            <p className="text-lg font-semibold text-gray-900">{property.sqft ? property.sqft.toLocaleString() : 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Rent/Mo</p>
            <p className="text-lg font-semibold text-gray-900">${property.rentRate || '—'}</p>
          </div>
        </div>

        {/* Additional Details */}
        {property.taxes && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Annual Taxes</p>
            <p className="font-semibold text-gray-900">${property.taxes.toLocaleString()}</p>
          </div>
        )}

        {/* Notes */}
        {property.notes && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-600 mb-2">Eric's Notes</p>
            <p className="text-sm text-gray-600 leading-relaxed">{property.notes}</p>
          </div>
        )}

        {/* Admin Delete Button */}
        {isAdmin && (
          <button
            onClick={() => onDelete(property.id)}
            className="w-full py-2 px-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded border border-red-200 flex items-center justify-center gap-2 transition"
          >
            <Trash2 size={16} />
            Delete Property
          </button>
        )}
      </div>
    </div>
  );
}
