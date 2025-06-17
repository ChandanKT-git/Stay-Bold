import mongoose, { Schema, Document } from 'mongoose';
import { IListing } from '../types/index.js';

interface IListingDocument extends Omit<IListing, '_id'>, Document {}

const listingSchema = new Schema<IListingDocument>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amenities: [{
    type: String
  }],
  maxGuests: {
    type: Number,
    required: true,
    min: 1
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  }
}, {
  timestamps: true
});

listingSchema.index({ location: 'text', title: 'text', description: 'text' });
listingSchema.index({ price: 1 });
listingSchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });

export default mongoose.model<IListingDocument>('Listing', listingSchema);