import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js';
import { AuthRequest, ApiResponse } from '../types/index.js';

export const createBookingValidation = [
  body('listing').isMongoId().withMessage('Valid listing ID required'),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
  body('totalPrice').isFloat({ min: 0 }).withMessage('Valid total price required')
];

export const createBooking = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.array().map(err => err.msg).join(', ')
      });
    }

    const { listing: listingId, startDate, endDate, totalPrice } = req.body;
    const userId = req.user?.userId;

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if dates are valid
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past'
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      listing: listingId,
      status: { $ne: 'cancelled' },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Selected dates are not available'
      });
    }

    // Create booking
    const booking = new Booking({
      listing: listingId,
      user: userId,
      startDate: start,
      endDate: end,
      totalPrice,
      status: 'confirmed' // In real app, this would be 'pending' until payment
    });

    await booking.save();
    await booking.populate([
      { path: 'listing', select: 'title location price images' },
      { path: 'user', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getUserBookings = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const bookings = await Booking.find({ user: req.user?.userId })
      .populate('listing', 'title location price images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'User bookings retrieved successfully',
      data: { bookings }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getHostBookings = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    // Get all listings owned by the host
    const hostListings = await Listing.find({ host: req.user?.userId }).select('_id');
    const listingIds = hostListings.map(listing => listing._id);

    // Get bookings for host's listings
    const bookings = await Booking.find({ listing: { $in: listingIds } })
      .populate('listing', 'title location price')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Host bookings retrieved successfully',
      data: { bookings }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve host bookings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user.toString() !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};