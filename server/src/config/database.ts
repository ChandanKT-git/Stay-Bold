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
    
    // MongoDB connection options
    const options = {
      // Remove deprecated options that might cause issues
      // useNewUrlParser and useUnifiedTopology are now default in Mongoose 6+
      
      // Connection timeout settings
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      
      // Buffer settings
      bufferCommands: false,
      maxPoolSize: 10,
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
      
      // Database name (if not specified in URI)
      dbName: 'stayfinder'
    };

    // Connect to MongoDB
    const connection = await mongoose.connect(mongoURI, options);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${connection.connection.db.databaseName}`);
    console.log(`🌐 Host: ${connection.connection.host}:${connection.connection.port}`);
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
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
    console.error('❌ MongoDB connection failed:');
    console.error(`   Error: ${error.message}`);
    
    // Provide helpful error messages
    if (error.message.includes('MONGODB_URI')) {
      console.error('   💡 Make sure MONGODB_URI is set in your .env file');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('   💡 Check if MongoDB is running and accessible');
      console.error('   💡 Verify your connection string and network connectivity');
    } else if (error.message.includes('authentication failed')) {
      console.error('   💡 Check your MongoDB username and password');
    } else if (error.message.includes('timeout')) {
      console.error('   💡 Connection timeout - check your network or MongoDB Atlas whitelist');
    }
    
    console.error('\n📋 Troubleshooting steps:');
    console.error('   1. Verify MONGODB_URI in .env file');
    console.error('   2. Check if MongoDB service is running');
    console.error('   3. Verify network connectivity');
    console.error('   4. Check MongoDB Atlas IP whitelist (if using Atlas)');
    console.error('   5. Verify username/password credentials\n');
    
    process.exit(1);
  }
};

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await mongoose.connection.db.admin().ping();
    console.log('🏓 Database ping successful');
    return true;
  } catch (error) {
    console.error('❌ Database ping failed:', error);
    return false;
  }
};