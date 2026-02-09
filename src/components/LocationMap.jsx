import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon in React/Webpack (Leaflet issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Kenya city centers (name, lat, lng) for nearest-city lookup
const CITIES = [
  { name: 'Nairobi', lat: -1.2921, lng: 36.8219 },
  { name: 'Mombasa', lat: -4.0437, lng: 39.6682 },
  { name: 'Kisumu', lat: -0.1022, lng: 34.7617 },
  { name: 'Nakuru', lat: -0.3031, lng: 36.08 },
  { name: 'Eldoret', lat: 0.5143, lng: 35.2698 },
];

function distance(lat1, lng1, lat2, lng2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function nearestCity(lat, lng) {
  let nearest = CITIES[0];
  let minD = distance(lat, lng, nearest.lat, nearest.lng);
  CITIES.forEach(city => {
    const d = distance(lat, lng, city.lat, city.lng);
    if (d < minD) {
      minD = d;
      nearest = city;
    }
  });
  return nearest.name;
}

// Inner component to capture map clicks
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const city = nearestCity(lat, lng);
      onLocationSelect({ lat, lng, city });
    },
  });
  return null;
}

export default function LocationMap({
  center = [-1.2921, 36.8219], // Nairobi
  zoom = 6,
  height = '300px',
  onLocationSelect,
  initialPosition = null, // { lat, lng } or null
  showMyLocation = true,
  className = '',
}) {
  const [selected, setSelected] = useState(initialPosition ? [initialPosition.lat, initialPosition.lng] : null);
  const [error, setError] = useState(null);

  const handleSelect = useCallback(
    (result) => {
      setSelected([result.lat, result.lng]);
      if (onLocationSelect) onLocationSelect(result);
    },
    [onLocationSelect]
  );

  const handleMyLocation = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const city = nearestCity(lat, lng);
        setSelected([lat, lng]);
        if (onLocationSelect) onLocationSelect({ lat, lng, city });
      },
      () => setError('Could not get your location. Please allow location access or pick on map.')
    );
  };

  return (
    <div className={className}>
      {showMyLocation && (
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={handleMyLocation}
            className="px-3 py-1.5 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Use my location
          </button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      )}
      <div style={{ height }} className="rounded-lg overflow-hidden border border-gray-200 z-0">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleSelect} />
          {selected && (
            <Marker position={selected}>
              <Popup>
                <span className="text-sm">
                  Selected: {selected[0].toFixed(4)}, {selected[1].toFixed(4)}
                  <br />
                  Nearest city: {selected.length && nearestCity(selected[0], selected[1])}
                </span>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      <p className="text-xs text-gray-500 mt-1">Click on the map to select pickup/return location.</p>
    </div>
  );
}

export { CITIES, nearestCity };
