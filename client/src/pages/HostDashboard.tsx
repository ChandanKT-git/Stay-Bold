import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { Listing, Booking } from '../types';
import api from '../utils/api';

const HostDashboard: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHostData();
  }, []);

  const fetchHostData = async () => {
    try {
      setLoading(true);
      const [listingsResponse, bookingsResponse] = await Promise.all([
        api.get('/api/listings/host/my-listings'),
        api.get('/api/bookings/host')
      ]);

      if (listingsResponse.data.success) {
        setListings(listingsResponse.data.data.listings);
      }
      if (bookingsResponse.data.success) {
        setBookings(bookingsResponse.data.data.bookings);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const response = await api.delete(`/api/listings/${id}`);
      if (response.data.success) {
        setListings(prev => prev.filter(listing => listing._id !== id));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete listing');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
        <Link
          to="/host/create-listing"
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Listing</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Listings</h3>
          <p className="text-3xl font-bold text-blue-600">{listings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-green-600">{bookings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">
            ${bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Listings */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Listings</h2>
          <div className="space-y-4">
            {listings.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-500 mb-4">You haven't created any listings yet.</p>
                <Link
                  to="/host/create-listing"
                  className="text-blue-600 hover:underline"
                >
                  Create your first listing
                </Link>
              </div>
            ) : (
              listings.map((listing) => (
                <div key={listing._id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center space-x-4">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                      <p className="text-gray-600">{listing.location}</p>
                      <p className="text-lg font-bold text-green-600">${listing.price}/night</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/listing/${listing._id}`}
                        className="p-2 text-gray-600 hover:text-blue-600"
                        title="View Listing"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/host/edit-listing/${listing._id}`}
                        className="p-2 text-gray-600 hover:text-green-600"
                        title="Edit Listing"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(listing._id)}
                        className="p-2 text-gray-600 hover:text-red-600"
                        title="Delete Listing"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">No bookings yet.</p>
              </div>
            ) : (
              bookings.slice(0, 5).map((booking) => (
                <div key={booking._id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {typeof booking.listing === 'object' ? booking.listing.title : 'Unknown Listing'}
                      </h3>
                      <p className="text-gray-600">
                        {typeof booking.user === 'object' ? booking.user.name : 'Unknown Guest'}
                      </p>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">${booking.totalPrice}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;