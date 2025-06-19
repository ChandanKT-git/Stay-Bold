import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
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

// Start server function with proper error handling
const startServer = async () => {
  try {
    console.log('🚀 Starting StayFinder Server...\n');
    
    // Quick database connection test (non-blocking)
    console.log('🔍 Testing database connection...');
    try {
      await quickConnectionTest();
    } catch (error) {
      console.log('⚠️  Database test completed with issues (server will continue)');
    }
    
    // Start database connection (non-blocking)
    connectDB().catch(error => {
      console.log('⚠️  Database connection will retry in background');
    });
    
    // Apply middleware in correct order for security
    console.log('🛡️  Applying security middleware...');
    
    // 1. CORS configuration (must be first)
    app.use(corsWithCSP);

    // 2. Optional: Disable CSP for development debugging (use sparingly)
    app.use(disableCSPForDevelopment);

    // 3. Apply CSP middleware BEFORE other security headers
    app.use(cspMiddleware);

    // 4. Apply other security headers
    app.use(securityHeaders);

    // 5. Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    console.log('🔗 Setting up routes...');

    // CSP violation reporting (before other routes)
    app.post('/api/csp-report', cspReportHandler);

    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/listings', listingRoutes);
    app.use('/api/bookings', bookingRoutes);
    app.use('/api', cspRoutes);

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      const dbState = mongoose.connection.readyState;
      const dbStatus = dbState === 1 ? 'Connected' : dbState === 2 ? 'Connecting' : dbState === 3 ? 'Disconnecting' : 'Disconnected';
      
      res.json({ 
        status: 'OK', 
        message: 'StayFinder API is running',
        environment: process.env.NODE_ENV || 'development',
        database: {
          status: dbStatus,
          state: dbState
        },
        security: {
          csp_disabled: process.env.DISABLE_CSP === 'true',
          nonce: res.locals.nonce ? res.locals.nonce.substring(0, 8) + '...' : 'Not available'
        },
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // Catch-all route for undefined endpoints
    app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Endpoint not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableEndpoints: [
          'GET /api/health',
          'POST /api/auth/register',
          'POST /api/auth/login',
          'GET /api/listings',
          'GET /api/listings/:id',
          'POST /api/bookings'
        ]
      });
    });

    // Error handling middleware (must be last)
    app.use(errorHandler);

    // Start the HTTP server
    const server = app.listen(PORT, () => {
      console.log('\n🎉 SERVER STARTED SUCCESSFULLY!');
      console.log('═'.repeat(50));
      console.log(`   ✅ Port: ${PORT}`);
      console.log(`   ✅ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   ✅ CSP: ${process.env.DISABLE_CSP === 'true' ? 'DISABLED' : 'ENABLED'}`);
      
      // Check database connection status
      const dbStatus = mongoose.connection.readyState;
      const dbStatusText = dbStatus === 1 ? 'Connected' : dbStatus === 2 ? 'Connecting' : dbStatus === 3 ? 'Disconnecting' : 'Disconnected';
      console.log(`   ${dbStatus === 1 ? '✅' : '⚠️ '} Database: ${dbStatusText}`);
      
      console.log('\n🔧 DEVELOPMENT URLS:');
      console.log(`   🌐 API Health: http://localhost:${PORT}/api/health`);
      console.log(`   🛡️  CSP Test: http://localhost:${PORT}/api/csp-test`);
      console.log(`   📋 CSP Policy: http://localhost:${PORT}/api/csp-policy`);
      
      if (dbStatus !== 1) {
        console.log('\n⚠️  DATABASE CONNECTION ISSUE:');
        console.log('   🎯 Most likely cause: IP not whitelisted in MongoDB Atlas');
        console.log('   🚀 Quick fix: Add 0.0.0.0/0 to Network Access in MongoDB Atlas');
        console.log('   📖 Server is running - fix database and restart when ready');
      }
      
      console.log('\n📊 SERVER READY TO ACCEPT CONNECTIONS!');
      console.log('═'.repeat(50));
      console.log('');
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      console.log('🔄 SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('✅ HTTP server closed');
        mongoose.connection.close(false, () => {
          console.log('✅ MongoDB connection closed');
          process.exit(0);
        });
      });
    });

    process.on('SIGINT', () => {
      console.log('\n🔄 SIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('✅ HTTP server closed');
        mongoose.connection.close(false, () => {
          console.log('✅ MongoDB connection closed');
          process.exit(0);
        });
      });
    });
    
  } catch (error) {
    console.error('❌ CRITICAL ERROR - Failed to start server:', error);
    console.error('⚠️  This is a server startup issue, not a database issue');
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();