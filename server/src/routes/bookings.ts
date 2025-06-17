import express from 'express';
import {
  createBooking,
  getUserBookings,
  getHostBookings,
  cancelBooking,
  createBookingValidation
} from '../controllers/bookingController.js';
import { authenticateToken, requireHost } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createBookingValidation, createBooking);
router.get('/user', authenticateToken, getUserBookings);
router.get('/host', authenticateToken, requireHost, getHostBookings);
router.patch('/:id/cancel', authenticateToken, cancelBooking);

export default router;