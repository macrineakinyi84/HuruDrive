import React, { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import CarsGrid from './components/CarsGrid'
import './index.css'

export default function App() {
  const [filters, setFilters] = useState({});

  const handleSearch = (searchFilters) => {
    // Extract only the filters that should be sent to the API
    const apiFilters = {
      location: searchFilters.location || undefined,
      // Add more filters as needed (make, category, minPrice, maxPrice, etc.)
    };
    
    // Remove undefined values
    Object.keys(apiFilters).forEach(key => 
      apiFilters[key] === undefined && delete apiFilters[key]
    );
    
    setFilters(apiFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero onSearch={handleSearch} />
      <main className="container mx-auto px-6 py-8">
        <CarsGrid filters={filters} />
      </main>
    </div>
  )
}