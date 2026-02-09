import React, { useState } from 'react';
import LocationMap from './LocationMap';

export default function PaymentModal({ isOpen, onClose, vehicle, bookingDetails, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [airtelNumber, setAirtelNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('Nairobi CBD');
  const [returnLocation, setReturnLocation] = useState('Nairobi CBD');
  const [showLocationMap, setShowLocationMap] = useState(false);

  if (!isOpen) return null;

  // Calculate total price (demo: 3 days rental)
  const days = bookingDetails?.days || 3;
  const dailyPrice = vehicle?.dailyPrice || 0;
  const subtotal = dailyPrice * days;
  const serviceFee = Math.round(subtotal * 0.05); // 5% service fee
  const total = subtotal + serviceFee;

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Get auth token
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to complete payment');
        setIsProcessing(false);
        return;
      }

      // First create a booking (if not already created)
      // For demo, we'll create a booking and then process payment
      const bookingResponse = await fetch(apiUrl('/api/bookings'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vehicleId: vehicle?.id,
          pickupLocation: pickupLocation,
          returnLocation: returnLocation,
          pickupAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          returnAt: new Date(Date.now() + (bookingDetails?.days || 3) * 24 * 60 * 60 * 1000).toISOString()
        })
      });

      if (!bookingResponse.ok) {
        throw new Error('Failed to create booking');
      }

      const bookingData = await bookingResponse.json();
      const bookingId = bookingData.booking.id;

      // Process payment
      const paymentResponse = await fetch(apiUrl('/api/payments'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: bookingId,
          provider: paymentMethod,
          amount: total
        })
      });

      if (!paymentResponse.ok) {
        throw new Error('Payment processing failed');
      }

      const paymentData = await paymentResponse.json();

      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Trigger success notification callback
      if (onPaymentSuccess) {
        onPaymentSuccess({
          vehicle: vehicle?.title,
          amount: total,
          method: paymentMethod,
          bookingId: bookingId
        });
      }
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
        setPaymentSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      alert('Payment failed: ' + (error.message || 'Please try again'));
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      setPaymentSuccess(false);
      // Reset form
      setPhoneNumber('');
      setCardNumber('');
      setCardName('');
      setCardExpiry('');
      setCardCVC('');
      setAirtelNumber('');
      setBankAccount('');
      setBankName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentSuccess ? (
            // Success Message
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
              <p className="text-sm text-gray-500">You will receive a confirmation email shortly.</p>
            </div>
          ) : (
            <>
              {/* Pickup & return location */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Pickup & return location</h3>
                <div className="flex flex-wrap gap-2 items-center">
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Pickup location"
                    className="flex-1 min-w-[120px] rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    placeholder="Return location"
                    className="flex-1 min-w-[120px] rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLocationMap(true)}
                    className="px-3 py-2 rounded-lg border border-teal-500 text-teal-700 hover:bg-teal-50 text-sm whitespace-nowrap"
                  >
                    📍 Choose on map
                  </button>
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-medium">{vehicle?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{days} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Rate:</span>
                    <span className="font-medium">KSh {dailyPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">KSh {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee:</span>
                    <span className="font-medium">KSh {serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-gray-300 font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-teal-600">KSh {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      paymentMethod === 'mpesa'
                        ? 'border-teal-600 bg-teal-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center text-white font-bold text-lg">
                        M
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">M-Pesa</div>
                        <div className="text-xs text-gray-500">Mobile Money</div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      paymentMethod === 'card'
                        ? 'border-teal-600 bg-teal-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white text-xl">
                        💳
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Credit/Debit Card</div>
                        <div className="text-xs text-gray-500">Visa, Mastercard</div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('airtelmoney')}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      paymentMethod === 'airtelmoney'
                        ? 'border-teal-600 bg-teal-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center text-white font-bold text-lg">
                        A
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Airtel Money</div>
                        <div className="text-xs text-gray-500">Mobile Money</div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-teal-600 bg-teal-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center text-white text-xl">
                        🏦
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Bank Transfer</div>
                        <div className="text-xs text-gray-500">Direct Deposit</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePayment}>
                {paymentMethod === 'mpesa' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        M-Pesa Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="07XX XXX XXX"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        You will receive an M-Pesa prompt on this number
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'airtelmoney' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Airtel Money Phone Number
                      </label>
                      <input
                        type="tel"
                        value={airtelNumber}
                        onChange={(e) => setAirtelNumber(e.target.value)}
                        placeholder="07XX XXX XXX"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        You will receive an Airtel Money prompt on this number
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name
                      </label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Select Bank</option>
                        <option value="equity">Equity Bank</option>
                        <option value="kcb">KCB Bank</option>
                        <option value="cooperative">Cooperative Bank</option>
                        <option value="stanbic">Stanbic Bank</option>
                        <option value="absa">Absa Bank</option>
                        <option value="standard">Standard Chartered</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        placeholder="Enter account number"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        We will send payment instructions to your email
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '').slice(0, 16);
                          // Format with spaces every 4 digits
                          value = value.match(/.{1,4}/g)?.join(' ') || value;
                          setCardNumber(value);
                        }}
                        placeholder="1234 5678 9012 3456"
                        required
                        maxLength={19}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setCardExpiry(value.slice(0, 5));
                          }}
                          placeholder="MM/YY"
                          required
                          maxLength={5}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          value={cardCVC}
                          onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          placeholder="123"
                          required
                          maxLength={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-teal-600 text-white py-4 rounded-lg font-semibold hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Pay KSh {total.toLocaleString()}
                      </>
                    )}
                  </button>
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </div>
              </form>

              {/* Location map modal */}
              {showLocationMap && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" onClick={() => setShowLocationMap(false)}>
                  <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-4 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">Select pickup & return location</h3>
                      <button type="button" onClick={() => setShowLocationMap(false)} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
                    </div>
                    <LocationMap
                      center={[-1.2921, 36.8219]}
                      zoom={6}
                      height="320px"
                      onLocationSelect={(result) => {
                        const name = result.city + (result.city === 'Nairobi' ? ' CBD' : '');
                        setPickupLocation(name);
                        setReturnLocation(name);
                        setShowLocationMap(false);
                      }}
                      showMyLocation={true}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
