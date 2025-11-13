import React, { useEffect, useState } from 'react';

export default function CarsGrid() {
  const [vehicles, setVehicles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetch('/api/vehicles')
      .then((r) => {
        if (!r.ok) throw new Error(`Status ${r.status}`);
        return r.json();
      })
      .then((data) => {
        // API may return vehicleImages fallback object; normalize it
        if (Array.isArray(data)) {
          setVehicles(data);
        } else if (data.vehicleImages) {
          setVehicles([]); // vehicle list missing, but images exist
          // optional: map images back to vehicles if needed
        } else {
          setVehicles([]);
        }
      })
      .catch((e) => {
        console.error('fetch /api/vehicles failed', e);
        setErr(e.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading…</div>;
  if (err) return <div className="text-red-600">Error: {err}</div>;
  if (!vehicles || !vehicles.length) return <div>No vehicles found</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {vehicles.map((v) => (
        <div key={v.id} className="border p-3 rounded">
          <h3 className="font-bold">{v.make ?? v.brand ?? 'Unknown' } {v.model ?? ''}</h3>
          <p>{v.year ?? ''}</p>
          { (v.images && v.images.length > 0) || (v.vehicleImages && v.vehicleImages.length > 0) ? (
            <img
              src={(v.images && v.images[0]?.url) ?? (v.vehicleImages && v.vehicleImages[0]?.url)}
              alt=""
              className="w-full h-48 object-cover mt-2"
            />
          ) : null }
        </div>
      ))}
    </div>
  );
}