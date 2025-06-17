import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Listing from '../models/Listing.js';
import Booking from '../models/Booking.js';
import { AuthRequest, ApiResponse, SearchFilters } from '../types/index.js';

export const createListingValidation = [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('price').isFloat({ min: 1 }).withMessage('Price must be a positive number'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('maxGuests').isInt({ min: 1 }).withMessage('Max guests must be at least 1'),
  body('bedrooms').isInt({ min: 0 }).withMessage('Bedrooms must be a non-negative number'),
  body('bathrooms').isFloat({ min: 0 }).withMessage('Bathrooms must be a non-negative number')
];

export const getListings = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      guests,
      page = 1,
      limit = 12
    } = req.query as SearchFilters & { page?: string; limit?: string };

    const query: any = {};
    const priceFilter: any = {};

    // Location search
    if (location) {
      query.$text = { $search: location };
    }

    // Price filters
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);
    if (Object.keys(priceFilter).length > 0) {
      query.price = priceFilter;
    }

    // Guest capacity
    if (guests) {
      query.maxGuests = { $gte: Number(guests) };
    }

    const skip = (Number(page) - 1) * Number(limit);

    let listings = await Listing.find(query)
      .populate('host', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Filter out listings that are booked for the requested dates
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const bookedListings = await Booking.find({
        listing: { $in: listings.map(l => l._id) },
        status: { $ne: 'cancelled' },
        $or: [
          { startDate: { $lte: end }, endDate: { $gte: start } }
        ]
      }).distinct('listing');

      listings = listings.filter(listing => 
        !bookedListings.some(bookedId => bookedId.toString() === listing._id.toString())
      );
    }

    const total = await Listing.countDocuments(query);

    res.json({
      success: true,
      message: 'Listings retrieved successfully',
      data: {
        listings,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalListings: total,
          hasNext: Number(page) * Number(limit) < total,
          hasPrev: Number(page) > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve listings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getListingById = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id).populate('host', 'name email');
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Get existing bookings for calendar
    const bookings = await Booking.find({
      listing: id,
      status: { $ne: 'cancelled' }
    }).select('startDate endDate');

    res.json({
      success: true,
      message: 'Listing retrieved successfully',
      data: {
        listing,
        bookedDates: bookings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve listing',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createListing = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.array().map(err => err.msg).join(', ')
      });
    }

    const listingData = {
      ...req.body,
      host: req.user?.userId
    };

    const listing = new Listing(listingData);
    await listing.save();
    await listing.populate('host', 'name email');

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      data: { listing }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create listing',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateListing = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    if (listing.host.toString() !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing'
      });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('host', 'name email');

    res.json({
      success: true,
      message: 'Listing updated successfully',
      data: { listing: updatedListing }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update listing',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteListing = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    if (listing.host.toString() !== req.user?.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing'
      });
    }

    await Listing.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete listing',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getHostListings = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const listings = await Listing.find({ host: req.user?.userId })
      .populate('host', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Host listings retrieved successfully',
      data: { listings }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve host listings',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};