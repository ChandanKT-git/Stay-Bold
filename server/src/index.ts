import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, quickConnectionTest } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { cspMiddleware, disableCSPForDevelopment, cspReportHandler } from './middleware/csp';
import { securityHeaders, corsWithCSP } from './middleware/security';
import authRoutes from './routes/auth';
import listingRoutes from './routes/listings';
import bookingRoutes from './routes/bookings';
import cspRoutes from './routes/csp';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB with proper error handling
const startServer = async () => {
  try {
    // Quick connection test first
    await quickConnectionTest();
    
    // Connect to database first
    await connectDB();
    
    // Apply middleware in correct order for security
    // 1. CORS configuration (must be first)
    app.use(corsWithCSP);

    // 2. Optional: Disable CSP for development debugging (use sparingly)
    app.use(disableCSPForDevelopment);

    // 3. Apply CSP middleware BEFORE other security headers
    app.use(cspMiddleware);

    // 4. Apply other security headers
    app.use(securityHeaders);

    // 5. Body parsing middleware
    app.use(express.json());

    // CSP violation reporting (before other routes)
    app.post('/api/csp-report', cspReportHandler);

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
        database: 'Connected',
        csp_disabled: process.env.DISABLE_CSP === 'true',
        nonce: res.locals.nonce ? res.locals.nonce.substring(0, 8) + '...' : 'Not available',
        timestamp: new Date().toISOString()
      });
    });

    // Error handling middleware
    app.use(errorHandler);

    // Start the server
    app.listen(PORT, () => {
      console.log('\n🚀 Server Status:');
      console.log(`   ✅ Server running on port ${PORT}`);
      console.log(`   ✅ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   ✅ CSP Disabled: ${process.env.DISABLE_CSP === 'true' ? 'YES' : 'NO'}`);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('\n🔧 Development URLs:');
        console.log(`   🌐 API Health: http://localhost:${PORT}/api/health`);
        console.log(`   🛡️  CSP Test: http://localhost:${PORT}/api/csp-test`);
        console.log(`   📋 CSP Policy: http://localhost:${PORT}/api/csp-policy`);
      }
      
      console.log('\n📊 Ready to accept connections!\n');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();