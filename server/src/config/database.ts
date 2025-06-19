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
    
    // MongoDB connection options with shorter timeouts for faster failure detection
    const options = {
      // Connection timeout settings - reduced for faster feedback
      serverSelectionTimeoutMS: 5000, // 5 seconds (reduced from 10)
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      
      // Buffer settings
      bufferCommands: false,
      maxPoolSize: 10,
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
      
      // Database name (if not specified in URI)
      dbName: 'stayfinder',
      
      // Additional options for better connection handling
      heartbeatFrequencyMS: 10000,
      maxIdleTimeMS: 30000,
      
      // Family preference (try IPv4 first)
      family: 4
    };

    console.log('⏱️  Attempting connection with 5-second timeout...');
    
    // Connect to MongoDB with timeout
    const connection = await mongoose.connect(mongoURI, options);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${connection.connection.db.databaseName}`);
    console.log(`🌐 Host: ${connection.connection.host}:${connection.connection.port}`);
    console.log(`🔗 Connection State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Unknown'}`);
    
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
    
    // Provide specific error analysis
    if (error.message.includes('MONGODB_URI')) {
      console.error('   💡 MONGODB_URI environment variable is missing');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('   💡 DNS resolution failed - check your connection string');
      console.error('   💡 Verify the cluster hostname in your MongoDB Atlas connection string');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('   💡 Connection refused - MongoDB server is not accessible');
    } else if (error.message.includes('authentication failed') || error.message.includes('auth')) {
      console.error('   💡 Authentication failed - check your username and password');
    } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      console.error('   💡 Connection timeout - this usually indicates:');
      console.error('       • Network connectivity issues');
      console.error('       • IP address not whitelisted in MongoDB Atlas');
      console.error('       • Firewall blocking the connection');
    } else if (error.message.includes('serverSelectionTimeoutMS')) {
      console.error('   💡 Server selection timeout - MongoDB cluster is unreachable');
    }
    
    console.error('\n📋 Troubleshooting steps:');
    console.error('   1. Check your internet connection');
    console.error('   2. Verify MONGODB_URI in .env file');
    console.error('   3. In MongoDB Atlas:');
    console.error('      • Go to Network Access');
    console.error('      • Add your IP address (or use 0.0.0.0/0 for testing)');
    console.error('      • Check if cluster is running');
    console.error('   4. Verify username/password in Database Access');
    console.error('   5. Try connecting with MongoDB Compass first');
    
    // Show current connection string format (without credentials)
    const mongoURI = process.env.MONGODB_URI;
    if (mongoURI) {
      const sanitizedURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//[USERNAME]:[PASSWORD]@');
      console.error(`\n🔗 Current connection string format:`);
      console.error(`   ${sanitizedURI}`);
    }
    
    console.error('\n⚠️  Server will exit due to database connection failure\n');
    process.exit(1);
  }
};

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

// Quick connection test function
export const quickConnectionTest = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    return;
  }
  
  console.log('🔍 Quick connection test...');
  
  try {
    // Test with very short timeout
    const testConnection = await mongoose.createConnection(mongoURI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 5000
    });
    
    await testConnection.close();
    console.log('✅ Quick test passed - MongoDB is reachable');
  } catch (error: any) {
    console.error('❌ Quick test failed:', error.message);
    
    if (error.message.includes('timeout')) {
      console.error('   💡 This suggests network/firewall issues');
    }
  }
};