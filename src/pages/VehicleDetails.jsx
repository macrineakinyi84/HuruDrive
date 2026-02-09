import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PaymentModal from '../components/PaymentModal';
import Notification from '../components/Notification';
import { apiUrl, API_BASE } from '../config';

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetch(apiUrl(`/api/vehicles/${id}`))
      .then((r) => {
        if (!r.ok) throw new Error('Vehicle not found');
        return r.json();
      })
      .then((data) => {
        setVehicle(data);
      })
      .catch((e) => {
        console.error('Error fetching vehicle:', e);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const getImageUrl = (url) => {
    if (!url) return 'https://placehold.co/600x400?text=No+Image';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const path = url.startsWith('/images') ? url : `/images${url}`;
    return API_BASE ? `${API_BASE}${path}` : path;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Vehicle not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const mainImage = vehicle.images && vehicle.images.length > 0 
    ? getImageUrl(vehicle.images[0].url)
    : 'https://placehold.co/800x600?text=No+Image';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-6 py-8 flex-grow">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-teal-600 hover:text-teal-700 flex items-center gap-2"
        >
          ← Back to Vehicles
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image Section */}
            <div>
              <img
                src={mainImage}
                alt={vehicle.title}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/800x600?text=No+Image';
                }}
              />
              {vehicle.images && vehicle.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {vehicle.images.slice(1, 5).map((img, idx) => (
                    <img
                      key={idx}
                      src={getImageUrl(img.url)}
                      alt={`${vehicle.title} ${idx + 2}`}
                      className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicle.title}</h1>
              <p className="text-gray-600 mb-6">
                {vehicle.year && `${vehicle.year} • `}
                {vehicle.make} {vehicle.model} • {vehicle.category}
              </p>

              <div className="text-teal text-3xl font-bold mb-6">
                KSh {vehicle.dailyPrice?.toLocaleString()}/day
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-sm mb-1">Seats</div>
                  <div className="text-lg font-semibold">{vehicle.seats} Passengers</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-sm mb-1">Transmission</div>
                  <div className="text-lg font-semibold">{vehicle.transmission}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-sm mb-1">Fuel Type</div>
                  <div className="text-lg font-semibold">{vehicle.fuelType}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-600 text-sm mb-1">Location</div>
                  <div className="text-lg font-semibold">{vehicle.location}</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-gray-600 text-sm mb-2">Status</div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  vehicle.status === 'AVAILABLE' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {vehicle.status}
                </span>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    // TODO: Open booking form
                    alert('Booking functionality coming soon!');
                  }}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Book This Vehicle
                </button>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-dark text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Demonstrate Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        vehicle={vehicle}
        bookingDetails={{ days: 3 }}
        onPaymentSuccess={(paymentData) => {
          setNotification({
            message: `Payment successful! KSh ${paymentData.amount.toLocaleString()} paid for ${paymentData.vehicle}`,
            type: 'success'
          });
        }}
      />

      {/* Success Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
          duration={5000}
        />
      )}
    </div>
  );
}
