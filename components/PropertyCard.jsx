import React from 'react';
import { Trash2 } from 'lucide-react';

export default function PropertyCard({ property, onDelete, isAdmin }) {
  const colors = {
    'brown': '#8B4513',
    'lightblue': '#87CEEB',
    'purple': '#800080',
    'orange': '#FF8C00',
    'red': '#DC143C',
    'yellow': '#FFD700',
    'green': '#228B22',
    'darkblue': '#00008B',
  };

  const cardColor = colors[property.color] || colors.lightblue;

  return (
    <div className="transform hover:scale-105 transition-transform duration-200 w-full max-w-sm">
      <div className="border-4 border-black rounded-lg overflow-hidden shadow-lg bg-white">
        {/* Color Bar */}
        <div
          className="h-8 border-b-4 border-black font-bold text-center flex items-center justify-center text-xs text-white"
          style={{ background: cardColor }}
        >
          FEATURED PROPERTY
        </div>

        {/* Property Address */}
        <div className="p-3 border-b-4 border-black bg-white">
          <h2 className="font-bold text-lg text-center text-black leading-tight">
            {property.address}
          </h2>
        </div>

        {/* Card Body */}
        <div className="p-4 bg-white">
          {/* Price Box */}
          <div className="bg-black text-white rounded p-2 mb-3 text-center">
            <div className="text-xs font-bold">ASKING PRICE</div>
            <div className="text-2xl font-bold text-[#ffd700]">
              ${property.price ? property.price.toLocaleString() : 'N/A'}
            </div>
          </div>

          {/* Property Details Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="border-2 border-black p-2 text-center">
              <div className="text-xs font-bold">BEDROOMS</div>
              <div className="text-2xl font-bold text-black">{property.beds}</div>
            </div>
            <div className="border-2 border-black p-2 text-center">
              <div className="text-xs font-bold">BATHROOMS</div>
              <div className="text-2xl font-bold text-black">{property.baths}</div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div className="border border-black p-1.5 text-center">
              <div className="font-bold">SQ FT</div>
              <div className="font-bold text-black">{property.sqft ? property.sqft.toLocaleString() : 'N/A'}</div>
            </div>
            <div className="border border-black p-1.5 text-center">
              <div className="font-bold">RENT RATE</div>
              <div className="font-bold text-black">${property.rentRate || 'N/A'}</div>
            </div>
          </div>

          {property.taxes && (
            <div className="border border-black p-1.5 text-center text-xs mb-3">
              <div className="font-bold">ANNUAL TAXES</div>
              <div className="font-bold text-black">${property.taxes.toLocaleString()}</div>
            </div>
          )}

          {/* Notes Section */}
          {property.notes && (
            <div className="border-2 border-black p-2 mb-3 bg-[#fffacd] rounded">
              <div className="text-xs font-bold mb-1">ERIC'S NOTES</div>
              <p className="text-xs font-bold text-black">{property.notes}</p>
            </div>
          )}

          {/* Admin Delete Button */}
          {isAdmin && (
            <button
              onClick={() => onDelete(property.id)}
              className="w-full bg-red-600 text-white font-bold py-2 rounded border-2 border-black hover:bg-red-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="bg-black text-white text-xs text-center py-2 border-t-4 border-black font-bold">
          ERIC'S EXCLUSIVE DEAL
        </div>
      </div>
    </div>
  );
}
