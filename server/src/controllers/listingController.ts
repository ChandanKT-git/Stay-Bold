import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Listing from '../models/Listing';
import { AuthRequest } from '../types';

export const createListingValidation = [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('price').isNumeric().isFloat({ min: 1 }).withMessage('Price must be a positive number'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.country').notEmpty().withMessage('Country is required'),
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Coordinates must be [longitude, latitude]'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('maxGuests').isInt({ min: 1 }).withMessage('Max guests must be at least 1'),
  body('bedrooms').isInt({ min: 0 }).withMessage('Bedrooms must be 0 or more'),
  body('bathrooms').isNumeric().isFloat({ min: 0 }).withMessage('Bathrooms must be 0 or more'),
];

export const getListings = async (req: AuthRequest, res: Response) => {
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
    } = req.query;

    const query: any = {};

    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } },
        { 'location.address': { $regex: location, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (guests) {
      query.maxGuests = { $gte: Number(guests) };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const listings = await Listing.find(query)
      .populate('host', 'name avatar')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Listing.countDocuments(query);

    res.json({
      listings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ message: 'Server error fetching listings' });
  }
};

export const getListingById = async (req: AuthRequest, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('host', 'name avatar email');
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ message: 'Server error fetching listing' });
  }
};

export const createListing = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const listing = new Listing({
      ...req.body,
      host: req.user!.id
    });

    await listing.save();
    await listing.populate('host', 'name avatar');

    res.status(201).json({
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Server error creating listing' });
  }
};

export const updateListing = async (req: AuthRequest, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.host.toString() !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('host', 'name avatar');

    res.json({
      message: 'Listing updated successfully',
      listing: updatedListing
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ message: 'Server error updating listing' });
  }
};

export const deleteListing = async (req: AuthRequest, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.host.toString() !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Server error deleting listing' });
  }
};

export const getHostListings = async (req: AuthRequest, res: Response) => {
  try {
    const listings = await Listing.find({ host: req.user!.id })
      .populate('host', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    console.error('Get host listings error:', error);
    res.status(500).json({ message: 'Server error fetching host listings' });
  }
};