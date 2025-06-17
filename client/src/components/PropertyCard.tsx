import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Star } from 'lucide-react';
import { Listing } from '../types';

interface PropertyCardProps {
  listing: Listing;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ listing }) => {
  return (
    <Link to={`/listing/${listing._id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md shadow-sm">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs font-medium">4.9</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center space-x-1 text-gray-500 mb-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{listing.location}</span>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{listing.maxGuests} guests</span>
              </div>
              <span>•</span>
              <span>{listing.bedrooms} bed</span>
              <span>•</span>
              <span>{listing.bathrooms} bath</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {amenity}
              </span>
            ))}
            {listing.amenities.length > 3 && (
              <span className="text-xs text-gray-500">
                +{listing.amenities.length - 3} more
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">${listing.price}</span>
              <span className="text-gray-600 text-sm"> / night</span>
            </div>
            <span className="text-sm text-gray-500">
              By {listing.host?.name}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;