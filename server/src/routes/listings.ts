import { Router } from 'express';
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getHostListings,
  createListingValidation
} from '../controllers/listingController';
import { authenticateToken, requireHost } from '../middleware/auth';

const router = Router();

router.get('/', getListings);
router.get('/host/my-listings', authenticateToken, requireHost, getHostListings);
router.get('/:id', getListingById);
router.post('/', authenticateToken, requireHost, createListingValidation, createListing);
router.put('/:id', authenticateToken, requireHost, updateListing);
router.delete('/:id', authenticateToken, requireHost, deleteListing);

export default router;