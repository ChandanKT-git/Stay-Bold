import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import { Listing, SearchFilters } from '../types';
import api from '../utils/api';

const HomePage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});

  const fetchListings = async (searchFilters: SearchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      let response;
      try {
        response = await api.get(`/api/listings?${params.toString()}`);
      } catch (apiError: any) {
        // If main API fails, try mock data
        if (apiError.response?.status === 500 || apiError.response?.status === 503) {
          console.log('Main API failed, using mock data');
          response = await api.get('/api/listings-mock');
        } else {
          throw apiError;
        }
      }
      
      if (response.data.success) {
        setListings(response.data.data.listings);
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
    fetchListings(searchFilters);
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen transition-colors">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 dark:from-orange-800 dark:via-red-800 dark:to-pink-800 text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Discover
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Incredible India
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 dark:text-orange-200 max-w-3xl mx-auto leading-relaxed">
              From the majestic Himalayas to serene backwaters, from royal palaces to modern cities - 
              find your perfect stay across India's diverse landscapes
            </p>
            <div className="flex justify-center items-center space-x-6 mt-8">
              <div className="flex items-center space-x-2 text-orange-200">
                <span className="text-2xl">🏔️</span>
                <span>Mountains</span>
              </div>
              <div className="flex items-center space-x-2 text-orange-200">
                <span className="text-2xl">🏖️</span>
                <span>Beaches</span>
              </div>
              <div className="flex items-center space-x-2 text-orange-200">
                <span className="text-2xl">🏰</span>
                <span>Heritage</span>
              </div>
              <div className="flex items-center space-x-2 text-orange-200">
                <span className="text-2xl">🌿</span>
                <span>Nature</span>
              </div>
            </div>
          </div>
          
          <SearchBar onSearch={handleSearch} initialFilters={filters} />
        </div>
      </div>

      {/* Listings Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg mb-8 shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Discovering amazing stays...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {Object.keys(filters).length > 0 ? 'Search Results' : 'Featured Properties'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {listings.length} incredible {listings.length === 1 ? 'property' : 'properties'} found across India
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                  <span>Popular</span>
                </div>
              </div>
            </div>

            {listings.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-6">🏠</div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  No properties found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
                  Try adjusting your search criteria or explore different destinations across India.
                </p>
                <button
                  onClick={() => {
                    setFilters({});
                    fetchListings();
                  }}
                  className="mt-6 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg"
                >
                  Show All Properties
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {listings.map((listing) => (
                  <PropertyCard key={listing._id} listing={listing} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Featured Destinations */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Explore India's Incredible Destinations
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              From bustling cities to serene landscapes, discover the diversity of India
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Rajasthan', emoji: '🏰', description: 'Royal Palaces' },
              { name: 'Kerala', emoji: '🌴', description: 'Backwaters' },
              { name: 'Himalayas', emoji: '🏔️', description: 'Mountain Retreats' },
              { name: 'Goa', emoji: '🏖️', description: 'Beach Paradise' },
              { name: 'Mumbai', emoji: '🏙️', description: 'City of Dreams' },
              { name: 'Agra', emoji: '🕌', description: 'Taj Mahal' },
              { name: 'Rishikesh', emoji: '🧘', description: 'Yoga Capital' },
              { name: 'Darjeeling', emoji: '🍃', description: 'Tea Gardens' }
            ].map((destination, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl text-center hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
                onClick={() => handleSearch({ location: destination.name })}
              >
                <div className="text-4xl mb-3">{destination.emoji}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{destination.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{destination.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;