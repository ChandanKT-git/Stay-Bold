import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('🔄 Connecting to MongoDB...');
    console.log(`📍 Database URI: ${mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials in logs
    
    // MongoDB connection options optimized for Atlas
    const options = {
      // Connection timeouts
      serverSelectionTimeoutMS: 5000, // 5 seconds
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      
      // Buffer settings
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 5,
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
      
      // Database name
      dbName: 'stayfinder',
      
      // Additional options for better connection handling
      heartbeatFrequencyMS: 10000,
      maxIdleTimeMS: 30000,
      
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

    console.log('⏱️  Attempting connection with optimized settings...');
    
    // Connect to MongoDB
    const connection = await mongoose.connect(mongoURI, options);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${connection.connection.db.databaseName}`);
    console.log(`🌐 Host: ${connection.connection.host}:${connection.connection.port}`);
    console.log(`🔗 Connection State: ${getConnectionState(mongoose.connection.readyState)}`);
    
    // Test the connection with a simple ping
    await testConnection();
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('🔒 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });
    
  } catch (error: any) {
    console.error('\n❌ MongoDB connection failed:');
    console.error(`   Error: ${error.message}`);
    
    // Provide specific error analysis and solutions
    analyzeConnectionError(error);
    
    console.error('\n⚠️  Server will continue without database connection');
    console.error('⚠️  Fix the database issue and restart the server\n');
    
    // Don't exit the process - let the server run without DB for debugging
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

// Analyze connection errors and provide solutions
function analyzeConnectionError(error: any): void {
  const message = error.message.toLowerCase();
  
  if (message.includes('mongodb_uri')) {
    console.error('\n💡 SOLUTION: MONGODB_URI environment variable is missing');
    console.error('   Add MONGODB_URI to your .env file');
  } else if (message.includes('enotfound') || message.includes('getaddrinfo')) {
    console.error('\n💡 SOLUTION: DNS resolution failed');
    console.error('   • Check your internet connection');
    console.error('   • Verify the cluster hostname in MongoDB Atlas');
  } else if (message.includes('econnrefused')) {
    console.error('\n💡 SOLUTION: Connection refused');
    console.error('   • MongoDB server is not accessible');
    console.error('   • Check if the cluster is running in MongoDB Atlas');
  } else if (message.includes('authentication failed') || message.includes('auth')) {
    console.error('\n💡 SOLUTION: Authentication failed');
    console.error('   • Check username and password in connection string');
    console.error('   • Verify user exists in Database Access (MongoDB Atlas)');
  } else if (message.includes('timeout') || message.includes('etimedout') || message.includes('serverselectiontimeoutms')) {
    console.error('\n💡 SOLUTION: Connection timeout (MOST LIKELY ISSUE)');
    console.error('   🎯 This is usually an IP WHITELIST problem!');
    console.error('\n   📋 IMMEDIATE STEPS TO FIX:');
    console.error('   1. Go to MongoDB Atlas Dashboard');
    console.error('   2. Click "Network Access" in the left sidebar');
    console.error('   3. Click "Add IP Address"');
    console.error('   4. Choose "Add Current IP Address" OR');
    console.error('   5. Add 0.0.0.0/0 (allows all IPs - for testing only)');
    console.error('   6. Click "Confirm"');
    console.error('   7. Wait 1-2 minutes for changes to take effect');
  } else if (message.includes('family')) {
    console.error('\n💡 SOLUTION: IP family error');
    console.error('   • This is fixed in the updated configuration');
    console.error('   • Using IPv4 only to avoid family conflicts');
  }
  
  console.error('\n🔧 ADDITIONAL TROUBLESHOOTING:');
  console.error('   • Try connecting with MongoDB Compass first');
  console.error('   • Check if your cluster is paused (MongoDB Atlas)');
  console.error('   • Verify your connection string format');
  console.error('   • Test from a different network');
  
  // Show current connection string format (without credentials)
  const mongoURI = process.env.MONGODB_URI;
  if (mongoURI) {
    const sanitizedURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//[USERNAME]:[PASSWORD]@');
    console.error(`\n🔗 Current connection string format:`);
    console.error(`   ${sanitizedURI}`);
  }
}

// Test database connection with ping
export const testConnection = async (): Promise<boolean> => {
  try {
    console.log('🏓 Testing database connection...');
    await mongoose.connection.db.admin().ping();
    console.log('✅ Database ping successful - connection is healthy');
    return true;
  } catch (error: any) {
    console.error('❌ Database ping failed:', error.message);
    return false;
  }
};

// Quick connection test function with immediate timeout
export const quickConnectionTest = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.error('💡 Add MONGODB_URI to your .env file');
    return;
  }
  
  console.log('🔍 Quick connection test...');
  
  try {
    // Test with very short timeout for immediate feedback
    const testConnection = await mongoose.createConnection(mongoURI, {
      serverSelectionTimeoutMS: 3000, // 3 seconds
      connectTimeoutMS: 5000, // 5 seconds
      socketTimeoutMS: 10000, // 10 seconds
      family: 4, // Use IPv4 only
      ssl: true,
      authSource: 'admin'
    });
    
    await testConnection.close();
    console.log('✅ Quick test passed - MongoDB is reachable');
  } catch (error: any) {
    console.error('❌ Quick test failed:', error.message);
    
    if (error.message.includes('timeout') || error.message.includes('serverSelectionTimeoutMS')) {
      console.error('\n🎯 DIAGNOSIS: Network/IP Whitelist Issue');
      console.error('   This timeout suggests your IP is not whitelisted in MongoDB Atlas');
      console.error('\n   🚀 QUICK FIX:');
      console.error('   1. Open MongoDB Atlas Dashboard');
      console.error('   2. Go to Network Access');
      console.error('   3. Add IP Address: 0.0.0.0/0 (temporary)');
      console.error('   4. Wait 1-2 minutes');
      console.error('   5. Restart this server');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n🎯 DIAGNOSIS: DNS/Connection String Issue');
      console.error('   Check your MongoDB connection string');
    } else if (error.message.includes('auth')) {
      console.error('\n🎯 DIAGNOSIS: Authentication Issue');
      console.error('   Check username/password in connection string');
    }
    
    console.error('\n⏭️  Continuing with server startup...');
  }
};