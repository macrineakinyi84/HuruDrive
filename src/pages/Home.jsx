import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CarsGrid from '../components/CarsGrid';
import Footer from '../components/Footer';

export default function Home() {
  const [filters, setFilters] = useState({});
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = (searchFilters) => {
    // Extract only the filters that should be sent to the API
    const apiFilters = {
      location: searchFilters.location || undefined,
    };
    
    // Remove undefined values
    Object.keys(apiFilters).forEach(key => 
      apiFilters[key] === undefined && delete apiFilters[key]
    );
    
    setFilters(apiFilters);
    setSearchPerformed(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero onSearch={handleSearch} />
      <main className="container mx-auto px-6 py-8">
        {searchPerformed && (
          <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <p className="text-teal-800 font-medium">
              {Object.keys(filters).length > 0 
                ? `🔍 Showing results for: ${Object.entries(filters).map(([k, v]) => `${k}: ${v}`).join(', ')}`
                : '📋 Showing all available vehicles'
              }
            </p>
            {Object.keys(filters).length > 0 && (
              <button
                onClick={() => {
                  setFilters({});
                  setSearchPerformed(false);
                }}
                className="mt-2 text-sm text-teal-600 hover:text-teal-700 underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
        <CarsGrid filters={filters} />
      </main>
      <Footer />
    </div>
  );
}
