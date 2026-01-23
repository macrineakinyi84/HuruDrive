import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CarCard({ vehicle }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get the first image from the images array, or use a placeholder
  // Handle both local paths and full URLs
  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format&q=80';
    // If it's already a full URL (like unsplash.com), use it directly
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

  // Get all available images
  const availableImages = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images.map(img => getImageUrl(img.url))
    : [];

  // Get current image URL with fallback
  const imageUrl = availableImages.length > 0 
    ? availableImages[currentImageIndex] 
    : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format&q=80';

  // Format vehicle title: use title if available, otherwise combine make + model
  const displayTitle = vehicle.title || `${vehicle.make || ''} ${vehicle.model || ''}`.trim() || 'Vehicle';

  const handleImageError = (e) => {
    console.error('Image failed to load:', imageUrl);
    setImageError(true);
    
    // Try next image if available
    if (currentImageIndex < availableImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setImageError(false);
    } else {
      // Use fallback placeholder
      e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&auto=format&q=80';
    }
  };

  return (
    <article className="bg-white rounded-xlcard border border-gray-100 overflow-hidden shadow-card hover:shadow-lg transition-shadow duration-200">
      <div className="h-48 bg-gray-200 overflow-hidden relative">
        {imageUrl && !imageError ? (
          <img
            key={`${vehicle.id}-${currentImageIndex}`}
            src={imageUrl}
            alt={displayTitle}
            className="w-full h-full object-cover"
            onError={handleImageError}
            onLoad={() => {
              console.log('Image loaded successfully:', imageUrl);
            }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">🚗</div>
              <div className="text-sm">Loading image...</div>
            </div>
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