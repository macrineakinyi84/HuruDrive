import React, { useState } from 'react'
import LocationMap from './LocationMap'

const LOCATIONS = ['Nairobi', 'Nakuru', 'Mombasa', 'Kisumu', 'Eldoret'];

export default function Hero({ onSearch }) {
  const [filters, setFilters] = useState({
    location: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: ''
  });
  const [showMap, setShowMap] = useState(false);

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationFromMap = (result) => {
    handleChange('location', result.city);
    setShowMap(false);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(filters);
    }
  };

  return (
    <section className="bg-gradient-to-b from-teal-50 to-teal-100 py-16">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-dark mb-3">
          Find Your Best Car in Nairobi
        </h1>
        <p className="text-muted mb-8">
          Explore our wide range of rental cars and find the perfect vehicle for your
          journey across Kenya
        </p>

        <form 
          className="mx-auto max-w-5xl bg-white rounded-xlcard p-6 shadow-card flex flex-wrap gap-4 items-end"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
            <div className="flex gap-2">
              <select 
                className="flex-1 rounded-lg bg-gray-50 p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={filters.location}
                onChange={(e) => handleChange('location', e.target.value)}
              >
                <option value="">All Locations</option>
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="px-3 py-3 rounded-lg border border-teal-500 text-teal-700 hover:bg-teal-50 transition-colors whitespace-nowrap"
                title="Choose location on map"
              >
                📍 Map
              </button>
            </div>
          </div>

          <div className="w-48 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date</label>
            <input 
              type="date" 
              className="w-full rounded-lg bg-gray-50 p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={filters.pickupDate}
              onChange={(e) => handleChange('pickupDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="w-36 min-w-[140px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Time</label>
            <input 
              type="time" 
              className="w-full rounded-lg bg-gray-50 p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={filters.pickupTime}
              onChange={(e) => handleChange('pickupTime', e.target.value)}
            />
          </div>

          <div>
            <button 
              type="submit"
              className="bg-dark text-white px-6 py-3 rounded-xlcard flex items-center gap-2 hover:bg-gray-800 transition-colors font-medium"
            >
              <span>🔍</span>
              <span>Find Car</span>
            </button>
          </div>
        </form>

        {/* Location map modal */}
        {showMap && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" onClick={() => setShowMap(false)}>
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-4 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Select pickup location on map</h3>
                <button type="button" onClick={() => setShowMap(false)} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
              </div>
              <LocationMap
                center={[-1.2921, 36.8219]}
                zoom={6}
                height="350px"
                onLocationSelect={handleLocationFromMap}
                showMyLocation={true}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}