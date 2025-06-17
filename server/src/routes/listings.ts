import express from 'express';
import { 
  getListings, 
  getListingById, 
  createListing, 
  updateListing, 
  deleteListing,
  getHostListings,
  createListingValidation 
} from '../controllers/listingController.js';
import { authenticateToken, requireHost } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getListings);
router.get('/:id', getListingById);

// Protected routes
router.post('/', authenticateToken, requireHost, createListingValidation, createListing);
router.put('/:id', authenticateToken, requireHost, updateListing);
router.delete('/:id', authenticateToken, requireHost, deleteListing);
router.get('/host/my-listings', authenticateToken, requireHost, getHostListings);

export default router;