import { Request } from 'express';
import { Document, Types } from 'mongoose';

// Booking status type
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  isHost: boolean;
  avatar?: string;
  firebaseUid?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
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
  host: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBooking extends Document {
  _id: string;
  listing: Types.ObjectId | string;
  guest: Types.ObjectId | string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: BookingStatus;
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