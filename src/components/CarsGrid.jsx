import React, { useEffect, useState } from 'react';
import CarCard from './CarCard';

export default function CarsGrid({ filters = {} }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Build query string from filters
    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.make) params.append('make', filters.make);
    if (filters.category) params.append('category', filters.category);
    if (filters.minSeats) params.append('minSeats', filters.minSeats);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

    const queryString = params.toString();
    const url = `/api/vehicles${queryString ? `?${queryString}` : ''}`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load vehicles: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setVehicles(data);
        } else {
          setVehicles([]);
        }
      })
      .catch((e) => {
        console.error('Error fetching vehicles:', e);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [filters.location, filters.make, filters.category, filters.minSeats, filters.minPrice, filters.maxPrice]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-8">
        <p className="text-red-800 font-semibold mb-2">Error loading vehicles</p>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg mb-2">No vehicles found</p>
        <p className="text-gray-500 text-sm">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <CarCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
}