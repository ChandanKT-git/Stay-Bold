import { Request } from 'express';

export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  isHost: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IListing {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  host: string | IUser;
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IBooking {
  _id: string;
  listing: string | IListing;
  user: string | IUser;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    isHost: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface SearchFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  guests?: number;
}