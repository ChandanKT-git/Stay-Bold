import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  isHost: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IListing extends Document {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: [number, number];
  };
  images: string[];
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  host: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBooking extends Document {
  _id: string;
  listing: string;
  guest: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    isHost: boolean;
  };
}