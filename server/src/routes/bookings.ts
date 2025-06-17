import { Router } from 'express';
import {
  createBooking,
  getUserBookings,
  getHostBookings,
  cancelBooking,
  createBookingValidation
} from '../controllers/bookingController';
import { authenticateToken, requireHost } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createBookingValidation, createBooking);
router.get('/user', authenticateToken, getUserBookings);
router.get('/host', authenticateToken, requireHost, getHostBookings);
router.patch('/:id/cancel', authenticateToken, cancelBooking);

export default router;