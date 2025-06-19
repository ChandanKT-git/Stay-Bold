import mongoose, { Schema } from 'mongoose';
import { IBooking, BookingStatus } from '../types';

const bookingSchema = new Schema<IBooking>({
  listing: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  guest: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(this: IBooking, value: Date) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'] as BookingStatus[],
    default: 'pending'
  }
}, {
  timestamps: true
});

bookingSchema.index({ listing: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ guest: 1 });

export default mongoose.model<IBooking>('Booking', bookingSchema);