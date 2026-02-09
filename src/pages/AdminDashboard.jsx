import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiUrl } from '../config';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchStats();
      if (activeTab === 'bookings') fetchBookings();
      if (activeTab === 'feedback') fetchFeedbacks();
    }
  }, [user, activeTab, dateRange]);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(apiUrl('/api/auth/me'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      if (data.user.role !== 'ADMIN') {
        navigate('/');
        return;
      }

      setUser(data.user);
    } catch (err) {
      console.error('Auth error:', err);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);

      const response = await fetch(apiUrl(`/api/admin/stats?${params.toString()}`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);

      const response = await fetch(`/api/admin/bookings?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl('/api/admin/feedback'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch feedback');
      const data = await response.json();
      setFeedbacks(data.feedbacks || []);
    } catch (err) {
      console.error('Error fetching feedback:', err);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl(`/api/admin/bookings/${bookingId}`), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update booking');
      fetchBookings();
      fetchStats();
    } catch (err) {
      console.error('Error updating booking:', err);
      alert('Failed to update booking status');
    }
  };

  const updateFeedbackStatus = async (feedbackId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl(`/api/admin/feedback/${feedbackId}`), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update feedback');
      fetchFeedbacks();
    } catch (err) {
      console.error('Error updating feedback:', err);
      alert('Failed to update feedback status');
    }
  };

  const formatCurrency = (amount) => {
    return `KSh ${amount?.toLocaleString() || '0'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
      PAID: 'bg-green-100 text-green-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || user?.email}!</p>
          </div>

          {/* Date Range Filter */}
          <div className="mb-6 flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              onClick={() => {
                setDateRange({
                  startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0]
                });
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex gap-4">
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
                Bookings
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
                      <p className="text-2xl font-bold text-gray-900">{stats.overview.totalBookings}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📋</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Confirmed</p>
                      <p className="text-2xl font-bold text-green-600">{stats.overview.confirmedBookings}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">✅</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                      <p className="text-2xl font-bold text-teal-600">{formatCurrency(stats.overview.totalRevenue)}</p>
                    </div>
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.overview.totalUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bookings by Status */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Bookings by Status</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.bookingsByStatus.map((item) => (
                    <div key={item.status} className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">{item.status}</p>
                      <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Vehicles */}
              {stats.topVehicles && stats.topVehicles.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Most Booked Vehicles</h2>
                  <div className="space-y-3">
                    {stats.topVehicles.map((item, index) => (
                      <div key={item.vehicleId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.vehicle?.title || 'Unknown Vehicle'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.vehicle?.make} {item.vehicle?.model}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{item._count.vehicleId}</p>
                          <p className="text-xs text-gray-600">bookings</p>
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
                <h2 className="text-xl font-bold text-gray-900">All Bookings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                          {booking.id.slice(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.user?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{booking.user?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.vehicle?.title}</div>
                          <div className="text-sm text-gray-500">{booking.vehicle?.make} {booking.vehicle?.model}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(booking.pickupAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(booking.totalPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <select
                            value={booking.status}
                            onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="CANCELLED">CANCELLED</option>
                            <option value="COMPLETED">COMPLETED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bookings.length === 0 && (
                  <div className="text-center py-12 text-gray-500">No bookings found</div>
                )}
              </div>
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
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
                      <p className="text-sm text-gray-600 mb-2">
                        From: <span className="font-medium">{feedback.user?.name || feedback.user?.email}</span>
                      </p>
                      {feedback.booking && (
                        <p className="text-sm text-gray-600 mb-2">
                          Booking: <span className="font-medium">{feedback.booking.vehicle?.title}</span>
                        </p>
                      )}
                      {feedback.comment && (
                        <p className="text-gray-700 mt-3">{feedback.comment}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">{formatDate(feedback.createdAt)}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(feedback.status)}`}>
                        {feedback.status}
                      </span>
                      <select
                        value={feedback.status}
                        onChange={(e) => updateFeedbackStatus(feedback.id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>
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
        </div>
      </div>
      <Footer />
    </div>
  );
}
