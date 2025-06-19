import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { cspMiddleware, disableCSPForDevelopment } from './middleware/csp';
import { securityHeaders, corsWithCSP } from './middleware/security';
import authRoutes from './routes/auth';
import listingRoutes from './routes/listings';
import bookingRoutes from './routes/bookings';
import cspRoutes from './routes/csp';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Apply middleware in correct order
app.use(corsWithCSP);

// Optional: Disable CSP for development debugging
app.use(disableCSPForDevelopment);

// Apply CSP middleware BEFORE other security headers
app.use(cspMiddleware);

// Apply other security headers
app.use(securityHeaders);

// Body parsing middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api', cspRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'StayFinder API is running',
    environment: process.env.NODE_ENV || 'development',
    csp_disabled: process.env.DISABLE_CSP === 'true'
  });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CSP Disabled: ${process.env.DISABLE_CSP === 'true' ? 'YES' : 'NO'}`);
});