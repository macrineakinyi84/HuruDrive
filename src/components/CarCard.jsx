import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function CarCard({ vehicle }) {
  const navigate = useNavigate();
  
  // Get the first image from the images array, or use a placeholder
  // Handle both local paths and full URLs
  const getImageUrl = (url) => {
    if (!url) return 'https://placehold.co/600x400?text=No+Image';
    // If it's already a full URL (like placehold.co), use it directly
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // If it's a local path starting with /images, use it directly (Vite proxy handles it)
    if (url.startsWith('/images')) {
      return url;
    }
    // Default: assume it's a relative path, prepend /images
    return `/images${url}`;
  };

  const imageUrl = vehicle.images && vehicle.images.length > 0 
    ? getImageUrl(vehicle.images[0].url)
    : 'https://placehold.co/600x400?text=No+Image';

  // Format vehicle title: use title if available, otherwise combine make + model
  const displayTitle = vehicle.title || `${vehicle.make || ''} ${vehicle.model || ''}`.trim() || 'Vehicle';

  return (
    <article className="bg-white rounded-xlcard border border-gray-100 overflow-hidden shadow-card hover:shadow-lg transition-shadow duration-200">
      <div className="h-48 bg-gray-200 overflow-hidden relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={displayTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
              e.target.src = 'https://via.placeholder.com/600x400/cccccc/666666?text=No+Image';
            }}
            onLoad={() => {
              console.log('Image loaded:', imageUrl);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{displayTitle}</h3>
        <p className="text-sm text-gray-500 mb-4">
          {vehicle.year && `${vehicle.year} • `}
          {vehicle.category || 'Vehicle'}
        </p>

        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-6">
          {vehicle.seats && (
            <div className="flex items-center gap-1">
              <span>👥</span>
              <span>{vehicle.seats} Seats</span>
            </div>
          )}
          {vehicle.transmission && (
            <div className="flex items-center gap-1">
              <span>⚙️</span>
              <span>{vehicle.transmission}</span>
            </div>
          )}
          {vehicle.fuelType && (
            <div className="flex items-center gap-1">
              <span>⛽</span>
              <span>{vehicle.fuelType}</span>
            </div>
          )}
          {vehicle.location && (
            <div className="flex items-center gap-1">
              <span>📍</span>
              <span>{vehicle.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-teal text-xl font-semibold">
            KSh {vehicle.dailyPrice?.toLocaleString() || '0'}/day
          </div>
          <button 
            className="bg-dark text-white px-4 py-2 rounded-xlcard hover:bg-gray-800 transition-colors text-sm font-medium"
            onClick={() => {
              navigate(`/vehicles/${vehicle.id}`);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  )
}