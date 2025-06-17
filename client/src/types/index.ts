export interface User {
  id: string;
  email: string;
  name: string;
  isHost: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  host: {
    _id: string;
    name: string;
    email: string;
  };
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  listing: Listing;
  user: User;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  guests?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}