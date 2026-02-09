import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiUrl } from '../config';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchStats();
      if (activeTab === 'bookings') fetchBookings();
      if (activeTab === 'payments') fetchPayments();
      if (activeTab === 'feedback') fetchFeedbacks();
      if (activeTab === 'profile') {
        setProfileData({ name: user.name || '', phone: user.phone || '' });
      }
    }
  }, [user, activeTab]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(apiUrl('/api/auth/me'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Unauthorized');
      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl('/api/user/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl('/api/user/bookings'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl('/api/user/payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch payments');
      const data = await response.json();
      setPayments(data.payments || []);
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl('/api/user/feedback'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch feedback');
      const data = await response.json();
      setFeedbacks(data.feedbacks || []);
    } catch (err) {
      console.error('Error fetching feedback:', err);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl(`/api/user/bookings/${bookingId}/cancel`), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to cancel booking');
      fetchBookings();
      fetchStats();
      alert('Booking cancelled successfully');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking');
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl('/api/user/profile'), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) throw new Error('Failed to update profile');
      const data = await response.json();
      setUser(data.user);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl('/api/user/password', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to change password');
      }

      alert('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      console.error('Error changing password:', err);
      alert(err.message || 'Failed to change password');
    }
  };

  const submitFeedback = async (bookingId, rating, comment) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl('/api/feedback'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookingId, rating, comment })
      });

      if (!response.ok) throw new Error('Failed to submit feedback');
      fetchFeedbacks();
      fetchBookings();
      alert('Feedback submitted successfully!');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback');
    }
  };

  const formatCurrency = (amount) => `KSh ${amount?.toLocaleString() || '0'}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
      PAID: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-grow">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || user?.email}!</p>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex gap-4 flex-wrap">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'bookings'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'payments'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Payment History
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'feedback'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Feedback
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'profile'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Profile
              </button>
            </nav>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.stats.totalBookings}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📋</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Upcoming</p>
                      <p className="text-2xl font-bold text-teal-600">{stats.stats.upcomingBookings}</p>
                    </div>
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📅</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{stats.stats.completedBookings}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">✅</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                      <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.stats.totalSpent)}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              {stats.recentBookings && stats.recentBookings.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
                  <div className="space-y-4">
                    {stats.recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          {booking.vehicle?.images?.[0] && (
                            <img
                              src={booking.vehicle.images[0].url}
                              alt={booking.vehicle.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{booking.vehicle?.title}</h3>
                            <p className="text-sm text-gray-600">
                              {formatDate(booking.pickupAt)} - {formatDate(booking.returnAt)}
                            </p>
                            <p className="text-sm text-gray-500">{formatCurrency(booking.totalPrice)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <button
                            onClick={() => navigate(`/vehicles/${booking.vehicleId}`)}
                            className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                          >
                            View →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">My Bookings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {booking.vehicle?.images?.[0] && (
                              <img
                                src={booking.vehicle.images[0].url}
                                alt={booking.vehicle.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{booking.vehicle?.title}</div>
                              <div className="text-sm text-gray-500">{booking.pickupLocation}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(booking.pickupAt)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(booking.returnAt)}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(booking.totalPrice)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/vehicles/${booking.vehicleId}`)}
                              className="text-teal-600 hover:text-teal-700 font-medium"
                            >
                              View
                            </button>
                            {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                              <button
                                onClick={() => cancelBooking(booking.id)}
                                className="text-red-600 hover:text-red-700 font-medium"
                              >
                                Cancel
                              </button>
                            )}
                            {booking.status === 'COMPLETED' && booking.feedbacks?.length === 0 && (
                              <FeedbackModal booking={booking} onSubmit={submitFeedback} />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bookings.length === 0 && (
                  <div className="text-center py-12 text-gray-500">No bookings yet</div>
                )}
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(payment.createdAt)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{payment.booking?.vehicle?.title || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{payment.provider}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {payments.length === 0 && (
                  <div className="text-center py-12 text-gray-500">No payment history</div>
                )}
              </div>
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({feedback.rating}/5)</span>
                      </div>
                      {feedback.booking && (
                        <p className="text-sm text-gray-600 mb-2">
                          For: <span className="font-medium">{feedback.booking.vehicle?.title}</span>
                        </p>
                      )}
                      {feedback.comment && (
                        <p className="text-gray-700 mt-3">{feedback.comment}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">{formatDate(feedback.createdAt)}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(feedback.status)}`}>
                      {feedback.status}
                    </span>
                  </div>
                </div>
              ))}
              {feedbacks.length === 0 && (
                <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                  No feedback submitted yet
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h2>
                <form onSubmit={updateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                  >
                    Update Profile
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Change Password</h2>
                {!showPasswordForm ? (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Change Password
                  </button>
                ) : (
                  <form onSubmit={changePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                      >
                        Update Password
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Feedback Modal Component
function FeedbackModal({ booking, onSubmit }) {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(booking.id, rating, comment);
    setShowModal(false);
    setRating(5);
    setComment('');
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-blue-600 hover:text-blue-700 font-medium"
      >
        Review
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Submit Feedback</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Share your experience..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
