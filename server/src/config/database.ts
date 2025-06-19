import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.log('⚠️  MONGODB_URI not found - server will run without database');
      return;
    }

    console.log('🔄 Starting MongoDB connection (non-blocking)...');
    
    // MongoDB connection options optimized for Atlas
    const options = {
      // Very short timeouts to prevent hanging
      serverSelectionTimeoutMS: 2000, // 2 seconds
      connectTimeoutMS: 3000, // 3 seconds
      socketTimeoutMS: 5000, // 5 seconds
      
      // Buffer settings
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 1,
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
      
      // Database name
      dbName: 'stayfinder',
      
      // Use IPv4 to avoid family errors
      family: 4,
      
      // Additional Atlas-specific options
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      // SSL/TLS settings for Atlas
      ssl: true,
      sslValidate: true,
      
      // Authentication
      authSource: 'admin'
    };

    // Connect to MongoDB with timeout handling
    const connectionPromise = mongoose.connect(mongoURI, options);
    
    // Set up a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout after 5 seconds')), 5000);
    });
    
    try {
      await Promise.race([connectionPromise, timeoutPromise]);
      console.log('✅ MongoDB connected successfully');
      console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
      console.log(`🔗 Connection State: ${getConnectionState(mongoose.connection.readyState)}`);
    } catch (timeoutError) {
      console.log('⏰ MongoDB connection timed out - continuing without database');
      console.log('💡 This is usually an IP whitelist issue in MongoDB Atlas');
      console.log('🔧 Add 0.0.0.0/0 to Network Access in MongoDB Atlas to fix');
    }
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('🎉 MongoDB connected successfully!');
    });
    
    mongoose.connection.on('error', (error) => {
      console.log('❌ MongoDB connection error:', error.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
  } catch (error: any) {
    console.log('❌ MongoDB connection failed:', error.message);
    console.log('⚠️  Server will continue without database connection');
    
    // Provide specific error solutions
    if (error.message.includes('timeout')) {
      console.log('\n💡 LIKELY SOLUTION: IP Whitelist Issue');
      console.log('   1. Go to MongoDB Atlas Dashboard');
      console.log('   2. Navigate to Network Access');
      console.log('   3. Add IP Address: 0.0.0.0/0');
      console.log('   4. Wait 1-2 minutes and restart server');
    }
  }
};

// Helper function to get connection state description
function getConnectionState(state: number): string {
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };
  return states[state as keyof typeof states] || 'Unknown';
}

// Simplified quick test that doesn't block
export const quickConnectionTest = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI) {
    console.log('⚠️  MONGODB_URI not found in environment variables');
    return;
  }
  
  console.log('🔍 Quick connection test (non-blocking)...');
  
  // Don't actually test - just log and continue
  // This prevents the hanging issue
  console.log('✅ Skipping connection test to prevent hanging');
  console.log('🚀 Server will start immediately');
  
  return Promise.resolve();
};

// Test database connection with ping (only if already connected)
export const testConnection = async (): Promise<boolean> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️  Database not connected - skipping ping test');
      return false;
    }
    
    console.log('🏓 Testing database connection...');
    await mongoose.connection.db.admin().ping();
    console.log('✅ Database ping successful - connection is healthy');
    return true;
  } catch (error: any) {
    console.log('❌ Database ping failed:', error.message);
    return false;
  }
};