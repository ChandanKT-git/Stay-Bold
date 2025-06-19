import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/database';
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

// Start server function with immediate startup
const startServer = async () => {
  try {
    console.log('🚀 Starting StayFinder Server...\n');
    
    // Start database connection in background (non-blocking)
    console.log('🔄 Initializing database connection...');
    
    // Run connection diagnostics first
    const { runConnectionDiagnostics } = await import('./config/database');
    await runConnectionDiagnostics();
    
    // Attempt database connection
    connectDB().catch(error => {
      console.log('⚠️  Database connection failed - server continues without DB');
      console.log('💡 Check the diagnostics above for specific solutions');
    });
    
    // Apply middleware in correct order for security
    console.log('🛡️  Applying security middleware...');
    
    // 1. CORS configuration (must be first)
    app.use(corsWithCSP);

    // 2. Optional: Disable CSP for development debugging
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

    // Mock data endpoint for when database is not connected
    app.get('/api/listings-mock', (req, res) => {
      const mockListings = [
        {
          _id: '1',
          title: 'Luxury Sea View Apartment in Bandra West',
          description: 'Experience Mumbai\'s glamour from this stunning 3BHK apartment with panoramic Arabian Sea views.',
          price: 8500,
          location: 'Mumbai, Maharashtra',
          images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
          host: { _id: '1', name: 'Rajesh Kumar' },
          amenities: ['WiFi', 'AC', 'Kitchen', 'Swimming Pool', 'Sea View'],
          maxGuests: 6,
          bedrooms: 3,
          bathrooms: 2,
          coordinates: { lat: 19.0596, lng: 72.8261 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'Heritage Haveli in Chandni Chowk',
          description: 'Restored 18th-century haveli in Old Delhi\'s heart with Mughal architecture.',
          price: 6500,
          location: 'New Delhi, Delhi',
          images: ['https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg'],
          host: { _id: '2', name: 'Priya Sharma' },
          amenities: ['WiFi', 'AC', 'Heritage Architecture', 'Courtyard', 'Cultural Tours'],
          maxGuests: 8,
          bedrooms: 4,
          bathrooms: 3,
          coordinates: { lat: 28.6562, lng: 77.2300 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '3',
          title: 'Tech Hub Apartment in Koramangala',
          description: 'Modern apartment in Bangalore\'s Silicon Valley with high-speed internet.',
          price: 4500,
          location: 'Bangalore, Karnataka',
          images: ['https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg'],
          host: { _id: '3', name: 'Arjun Singh' },
          amenities: ['High-Speed WiFi', 'AC', 'Kitchen', 'Co-working Space', 'Tech Hub'],
          maxGuests: 3,
          bedrooms: 2,
          bathrooms: 1,
          coordinates: { lat: 12.9352, lng: 77.6309 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '4',
          title: 'Beachfront Villa in Calangute',
          description: 'Stunning villa with direct beach access to Calangute Beach in Goa.',
          price: 15000,
          location: 'Goa, Goa',
          images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'],
          host: { _id: '1', name: 'Rajesh Kumar' },
          amenities: ['Beach Access', 'Infinity Pool', 'Ocean View', 'Water Sports'],
          maxGuests: 12,
          bedrooms: 6,
          bathrooms: 4,
          coordinates: { lat: 15.5430, lng: 73.7549 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '5',
          title: 'Royal Palace Suite in Jaipur',
          description: 'Magnificent palace suite in Pink City with City Palace views.',
          price: 18000,
          location: 'Jaipur, Rajasthan',
          images: ['https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg'],
          host: { _id: '2', name: 'Priya Sharma' },
          amenities: ['Royal Architecture', 'Palace Views', 'Traditional Decor', 'Cultural Heritage'],
          maxGuests: 4,
          bedrooms: 2,
          bathrooms: 2,
          coordinates: { lat: 26.9260, lng: 75.8267 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '6',
          title: 'Backwater Houseboat in Alleppey',
          description: 'Traditional Kerala houseboat floating through serene backwaters.',
          price: 12000,
          location: 'Alleppey, Kerala',
          images: ['https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg'],
          host: { _id: '3', name: 'Arjun Singh' },
          amenities: ['Backwater Views', 'Traditional Houseboat', 'Local Cuisine', 'Village Life'],
          maxGuests: 4,
          bedrooms: 2,
          bathrooms: 1,
          coordinates: { lat: 9.4981, lng: 76.3388 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '7',
          title: 'Yoga Ashram in Rishikesh',
          description: 'Authentic ashram on Ganges banks with daily yoga and meditation.',
          price: 3500,
          location: 'Rishikesh, Uttarakhand',
          images: ['https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg'],
          host: { _id: '1', name: 'Rajesh Kumar' },
          amenities: ['Yoga Classes', 'Meditation', 'Ganges Views', 'Spiritual Teachings'],
          maxGuests: 2,
          bedrooms: 1,
          bathrooms: 1,
          coordinates: { lat: 30.0869, lng: 78.2676 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '8',
          title: 'Taj Mahal View Hotel in Agra',
          description: 'Heritage hotel with iconic Taj Mahal views and Mughal grandeur.',
          price: 11000,
          location: 'Agra, Uttar Pradesh',
          images: ['https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg'],
          host: { _id: '2', name: 'Priya Sharma' },
          amenities: ['Taj Mahal Views', 'Heritage Hotel', 'Mughal Architecture', 'Cultural Tours'],
          maxGuests: 4,
          bedrooms: 2,
          bathrooms: 2,
          coordinates: { lat: 27.1750, lng: 78.0421 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      res.json({
        success: true,
        message: 'Indian properties loaded (database not connected)',
        data: {
          listings: mockListings,
          pagination: {
            page: 1,
            limit: 12,
            total: mockListings.length,
            pages: 1
          }
        }
      });
    });

    // Additional mock endpoint for single listing
    app.get('/api/listings-mock/:id', (req, res) => {
      const mockListing = {
        _id: req.params.id,
        title: 'Luxury Sea View Apartment in Bandra West',
        description: 'Experience Mumbai\'s glamour from this stunning 3BHK apartment with panoramic Arabian Sea views. Located in Bandra\'s elite Hill Road area, featuring contemporary furnishings, modular kitchen, and premium amenities including infinity pool and state-of-the-art gym.',
        price: 8500,
        location: 'Mumbai, Maharashtra',
        images: [
          'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
          'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg',
          'https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg'
        ],
        host: { 
          _id: '1', 
          name: 'Rajesh Kumar',
          email: 'rajesh@stayfinder.in'
        },
        amenities: ['WiFi', 'AC', 'Kitchen', 'Swimming Pool', 'Gym', 'Security', 'Parking', 'Sea View', 'Balcony'],
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        coordinates: { lat: 19.0596, lng: 72.8261 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      res.json({
        success: true,
        message: 'Listing fetched successfully',
        data: {
          listing: mockListing,
          bookedDates: []
        }
      });
    });

    // Mock endpoint for listings by location
    app.get('/api/listings-mock/search', (req, res) => {
      const { location } = req.query;
      const allMockListings = [
        // Mumbai properties
        {
          _id: '1',
          title: 'Luxury Sea View Apartment in Bandra West',
          price: 8500,
          location: 'Mumbai, Maharashtra',
          images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
          host: { name: 'Rajesh Kumar' },
          amenities: ['WiFi', 'AC', 'Kitchen', 'Swimming Pool', 'Sea View'],
          maxGuests: 6,
          bedrooms: 3,
          bathrooms: 3,
          coordinates: { lat: 19.0596, lng: 72.8261 }
        },
        // Delhi properties  
        {
          _id: '2',
          title: 'Heritage Haveli in Chandni Chowk',
          price: 6500,
          location: 'New Delhi, Delhi',
          images: ['https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg'],
          host: { name: 'Priya Sharma' },
          amenities: ['WiFi', 'AC', 'Heritage Architecture', 'Courtyard'],
          maxGuests: 8,
          bedrooms: 4,
          bathrooms: 3,
          coordinates: { lat: 28.6562, lng: 77.2300 }
        }
      ];
      
      let filteredListings = allMockListings;
      if (location) {
        filteredListings = allMockListings.filter(listing => 
          listing.location.toLowerCase().includes(location.toString().toLowerCase())
        );
      }
      
      res.json({
        success: true,
        message: `Found ${filteredListings.length} properties`,
        data: {
          listings: filteredListings,
          pagination: {
            page: 1,
            limit: 12,
            total: filteredListings.length,
            pages: 1
          }
        }
      });
    });

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
          state: dbState,
          uri_configured: !!process.env.MONGODB_URI
        },
        security: {
          csp_disabled: process.env.DISABLE_CSP === 'true',
          nonce: res.locals.nonce ? res.locals.nonce.substring(0, 8) + '...' : 'Not available'
        },
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // Test endpoint for quick verification
    app.get('/api/test', (req, res) => {
      res.json({
        message: 'Server is working!',
        timestamp: new Date().toISOString(),
        database_connected: mongoose.connection.readyState === 1
      });
    });

    // Catch-all route for undefined endpoints
    app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Endpoint not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableEndpoints: [
          'GET /api/health',
          'GET /api/test',
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

    // Start the HTTP server immediately
    const server = app.listen(PORT, () => {
      console.log('\n🎉 SERVER STARTED SUCCESSFULLY!');
      console.log('═'.repeat(50));
      console.log(`   ✅ Port: ${PORT}`);
      console.log(`   ✅ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   ✅ CSP: ${process.env.DISABLE_CSP === 'true' ? 'DISABLED' : 'ENABLED'}`);
      
      // Check database connection status
      const dbState = mongoose.connection.readyState;
      const dbStatusText = dbState === 1 ? 'Connected' : dbState === 2 ? 'Connecting' : dbState === 3 ? 'Disconnecting' : 'Disconnected';
      console.log(`   ${dbState === 1 ? '✅' : '⚠️ '} Database: ${dbStatusText}`);
      
      console.log('\n🔧 DEVELOPMENT URLS:');
      console.log(`   🌐 API Health: http://localhost:${PORT}/api/health`);
      console.log(`   🧪 API Test: http://localhost:${PORT}/api/test`);
      console.log(`   🛡️  CSP Test: http://localhost:${PORT}/api/csp-test`);
      console.log(`   📋 CSP Policy: http://localhost:${PORT}/api/csp-policy`);
      
      if (dbState !== 1) {
        console.log('\n💡 DATABASE CONNECTION TIPS:');
        console.log('   🎯 Most common issue: IP not whitelisted in MongoDB Atlas');
        console.log('   🚀 Quick fix: Add 0.0.0.0/0 to Network Access in MongoDB Atlas');
        console.log('   📖 Server is fully functional - database will connect when ready');
        console.log('   🔄 Database connection continues in background');
      }
      
      console.log('\n📊 SERVER READY TO ACCEPT CONNECTIONS!');
      console.log('   🚀 You can now start the frontend with: cd ../client && npm run dev');
      console.log('═'.repeat(50));
      console.log('');
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      console.log('🔄 SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('✅ HTTP server closed');
        mongoose.connection.close().then(() => {
          console.log('✅ MongoDB connection closed');
          process.exit(0);
        }).catch((error) => {
          console.error('❌ Error closing MongoDB connection:', error);
          process.exit(1);
        });
      });
    });

    process.on('SIGINT', () => {
      console.log('\n🔄 SIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('✅ HTTP server closed');
        mongoose.connection.close().then(() => {
          console.log('✅ MongoDB connection closed');
          process.exit(0);
        }).catch((error) => {
          console.error('❌ Error closing MongoDB connection:', error);
          process.exit(1);
        });
      });
    });
    
  } catch (error) {
    console.error('❌ CRITICAL ERROR - Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // Try to close connections gracefully before exiting
  mongoose.connection.close().finally(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Try to close connections gracefully before exiting
  mongoose.connection.close().finally(() => {
    process.exit(1);
  });
});

// Start the server immediately
startServer();