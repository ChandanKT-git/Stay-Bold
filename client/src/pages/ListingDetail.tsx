import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, Bed, Bath, Star, Calendar, ArrowLeft } from 'lucide-react';
import { Listing, Booking } from '../types';
import { useAuth } from '../contexts/AuthContext';
import GoogleMapComponent from '../components/GoogleMap';
import api from '../utils/api';
import { differenceInDays, format } from 'date-fns';

const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [bookedDates, setBookedDates] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    guests: 1
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/listings/${id}`);
      
      if (response.data.success) {
        setListing(response.data.data.listing);
        setBookedDates(response.data.data.bookedDates || []);
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch listing');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!bookingData.startDate || !bookingData.endDate || !listing) return 0;
    
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const nights = differenceInDays(end, start);
    
    return nights * listing.price;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setBookingLoading(true);
      
      const totalPrice = calculateTotalPrice();
      
      const response = await api.post('/api/bookings', {
        listing: id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalPrice
      });

      if (response.data.success) {
        alert('Booking successful! You can view your bookings in the My Bookings section.');
        navigate('/bookings');
      } else {
        alert(response.data.message);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Listing not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();
  const nights = bookingData.startDate && bookingData.endDate 
    ? differenceInDays(new Date(bookingData.endDate), new Date(bookingData.startDate))
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
        <div className="flex items-center space-x-4 text-gray-600">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span>4.9</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{listing.location}</span>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-8 h-96">
        <div className="md:col-span-2 lg:col-span-2">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          {listing.images.slice(1, 3).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${listing.title} ${index + 2}`}
              className="w-full h-full object-cover rounded-lg"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-2">
          {listing.images.slice(3, 5).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${listing.title} ${index + 4}`}
              className="w-full h-full object-cover rounded-lg"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Info */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Hosted by {listing.host.name}</h2>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{listing.maxGuests} guests</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bed className="h-4 w-4" />
                  <span>{listing.bedrooms} bedrooms</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bath className="h-4 w-4" />
                  <span>{listing.bathrooms} bathrooms</span>
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{listing.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {listing.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-700">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Location</h3>
            <GoogleMapComponent 
              coordinates={listing.coordinates} 
              title={listing.title}
              className="h-64 w-full" 
            />
          </div>
        </div>

        {/* Booking Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-lg border sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-2xl font-bold">${listing.price}</span>
                <span className="text-gray-600"> / night</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-medium">4.9</span>
              </div>
            </div>

            {!showBookingForm ? (
              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Check Availability
              </button>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.startDate}
                      onChange={(e) => setBookingData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.endDate}
                      onChange={(e) => setBookingData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guests
                  </label>
                  <select
                    value={bookingData.guests}
                    onChange={(e) => setBookingData(prev => ({ ...prev, guests: Number(e.target.value) }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: listing.maxGuests }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'guest' : 'guests'}
                      </option>
                    ))}
                  </select>
                </div>

                {totalPrice > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span>${listing.price} × {nights} nights</span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold text-lg">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <button
                    type="submit"
                    disabled={bookingLoading || totalPrice === 0}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingLoading ? 'Processing...' : 'Book Now'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="w-full text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {!isAuthenticated && (
              <p className="text-sm text-gray-600 mt-4 text-center">
                Please <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">login</button> to book this property
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;