import React, { useState } from 'react'

const LOCATIONS = ['Nairobi', 'Nakuru', 'Mombasa', 'Kisumu', 'Eldoret'];

export default function Hero({ onSearch }) {
  const [filters, setFilters] = useState({
    location: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: ''
  });

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
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
            <select 
              className="w-full rounded-lg bg-gray-50 p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={filters.location}
              onChange={(e) => handleChange('location', e.target.value)}
            >
              <option value="">All Locations</option>
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
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
      </div>
    </section>
  )
}