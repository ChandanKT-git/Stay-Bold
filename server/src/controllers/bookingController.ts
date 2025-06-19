import mongoose from 'mongoose';
import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking';
import Listing from '../models/Listing';
import { AuthRequest, BookingStatus } from '../types';

export const createBookingValidation = [
  body('listing').isMongoId().withMessage('Valid listing ID is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
];

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { listing: listingId, startDate, endDate } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.host.toString() === req.user!.id) {
      return res.status(400).json({ message: 'Cannot book your own listing' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    if (start < new Date()) {
      return res.status(400).json({ message: 'Cannot book dates in the past' });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      listing: listingId,
      status: { $ne: 'cancelled' },
      $or: [
        { startDate: { $lte: start }, endDate: { $gt: start } },
        { startDate: { $lt: end }, endDate: { $gte: end } },
        { startDate: { $gte: start }, endDate: { $lte: end } }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Listing is not available for selected dates' });
    }

    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * listing.price;

    const booking = new Booking({
      listing: listingId,
      guest: req.user!.id,
      startDate: start,
      endDate: end,
      totalPrice,
      status: 'confirmed'
    });

    await booking.save();
    await booking.populate([
      { path: 'listing', select: 'title images location price' },
      { path: 'guest', select: 'name email' }
    ]);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
};

export const getUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected',
        error: 'Service temporarily unavailable'
      });
    }

    const bookings = await Booking.find({ guest: req.user!.id })
      .populate('listing', 'title images location price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Bookings fetched successfully',
      data: {
        bookings
      }
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching bookings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getHostBookings = async (req: AuthRequest, res: Response) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected',
        error: 'Service temporarily unavailable'
      });
    }

    const bookings = await Booking.find()
      .populate({
        path: 'listing',
        match: { host: req.user!.id },
        select: 'title images location price'
      })
      .populate('guest', 'name email')
      .sort({ createdAt: -1 });

    const filteredBookings = bookings.filter(booking => booking.listing);

    res.json({
      success: true,
      message: 'Host bookings fetched successfully',
      data: {
        bookings: filteredBookings
      }
    });
  } catch (error) {
    console.error('Get host bookings error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching host bookings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing', 'host');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isGuest = booking.guest.toString() === req.user!.id;
    const isHost = booking.listing && (booking.listing as any).host.toString() === req.user!.id;

    if (!isGuest && !isHost) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled' as BookingStatus;
    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error cancelling booking' });
  }
};