import mongoose, { Schema } from 'mongoose';
import { IListing } from '../types';

const listingSchema = new Schema<IListing>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(v: number[]) {
          return v.length === 2;
        },
        message: 'Coordinates must be an array of [longitude, latitude]'
      }
    }
  },
  images: [{
    type: String,
    required: true
  }],
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
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

listingSchema.index({ 'location.coordinates': '2dsphere' });
listingSchema.index({ price: 1 });
listingSchema.index({ maxGuests: 1 });

export default mongoose.model<IListing>('Listing', listingSchema);