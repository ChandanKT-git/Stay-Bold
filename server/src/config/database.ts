import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.log('⚠️  MONGODB_URI not found - server will run without database');
      return;
    }

    console.log('🔄 Attempting MongoDB connection...');
    console.log('🔗 URI format check:', mongoURI.substring(0, 20) + '...');
    
    // Simplified connection options for better compatibility
    const options = {
      // Basic timeouts
      serverSelectionTimeoutMS: 8000, // 8 seconds
      connectTimeoutMS: 8000, // 8 seconds
      socketTimeoutMS: 20000, // 20 seconds
      
      // Connection pool settings
      maxPoolSize: 5,
      minPoolSize: 1,
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
      
      // Use IPv4 to avoid family errors
      family: 4,
      
      // Buffer settings
      bufferCommands: false,
      
      // Heartbeat settings
      heartbeatFrequencyMS: 10000,
      
      // Additional options for Atlas
      maxIdleTimeMS: 30000,
      
      // Force close sockets after timeout
      forceServerObjectId: false
    };

    // Connect to MongoDB with proper error handling
    console.log('⏳ Connecting to MongoDB Atlas...');
    
    // Create connection with timeout wrapper
    const connectWithTimeout = () => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout after 8 seconds'));
        }, 8000);
        
        mongoose.connect(mongoURI, options)
          .then(() => {
            clearTimeout(timeout);
            resolve(true);
          })
          .catch((error) => {
            clearTimeout(timeout);
            reject(error);
          });
      });
    };
    
    await connectWithTimeout();
    
    console.log('✅ MongoDB connected successfully!');
    console.log(`📊 Database: ${mongoose.connection.db?.databaseName || 'stayfinder'}`);
    console.log(`🔗 Connection State: ${getConnectionState(mongoose.connection.readyState)}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    
    // Test the connection with a simple operation
    await mongoose.connection.db?.admin().ping();
    console.log('🏓 Database ping successful - connection is healthy');
    
  } catch (error: any) {
    console.log('\n❌ MongoDB connection failed:');
    console.log(`   Error: ${error.message}`);
    
    // Provide specific error solutions based on error type
    if (error.message.includes('timeout') || error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 NETWORK/TIMEOUT ISSUES - Try these solutions:');
      console.log('   1. ✅ Check your internet connection');
      console.log('   2. ✅ Verify MongoDB Atlas cluster is running (not paused)');
      console.log('   3. ✅ Add 0.0.0.0/0 to Network Access in MongoDB Atlas');
      console.log('   4. ✅ Try connecting from a different network/location');
      console.log('   5. ✅ Check if your ISP blocks MongoDB ports (27017)');
      console.log('   6. ✅ Try using a VPN to bypass network restrictions');
      console.log('   7. ✅ Test with MongoDB Compass first');
      console.log('   8. ✅ Create cluster in different region (US East, Europe, etc.)');
    } else if (error.message.includes('authentication') || error.message.includes('auth')) {
      console.log('\n💡 AUTHENTICATION ISSUES - Try these solutions:');
      console.log('   1. ✅ Verify username and password in connection string');
      console.log('   2. ✅ Check if user has proper database permissions');
      console.log('   3. ✅ Ensure password is URL-encoded (% symbols)');
      console.log('   4. ✅ Try creating a new database user');
    } else if (error.message.includes('parse') || error.message.includes('URI')) {
      console.log('\n💡 CONNECTION STRING ISSUES - Try these solutions:');
      console.log('   1. ✅ Check connection string format');
      console.log('   2. ✅ Ensure all special characters are URL-encoded');
      console.log('   3. ✅ Verify cluster name and region');
      console.log('   4. ✅ Get a fresh connection string from MongoDB Atlas');
    }
    
    console.log('\n🔧 IMMEDIATE FIXES TO TRY:');
    console.log('   1. 🚀 Go to MongoDB Atlas → Network Access → Add IP Address → 0.0.0.0/0');
    console.log('   2. 🔄 Restart your MongoDB Atlas cluster');
    console.log('   3. 🌍 Try creating a new cluster in US East region');
    console.log('   4. 🧪 Test connection with MongoDB Compass first');
    console.log('   5. 📱 Try from mobile hotspot to test network issues');
    
    console.log('\n⚠️  Server will continue without database connection');
    console.log('📖 The app will use mock data and remain fully functional');
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

// Test database connection with detailed diagnostics
export const testConnection = async (): Promise<boolean> => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️  Database not connected - skipping ping test');
      return false;
    }
    
    console.log('🏓 Testing database connection...');
    await mongoose.connection.db?.admin().ping();
    console.log('✅ Database ping successful - connection is healthy');
    return true;
  } catch (error: any) {
    console.log('❌ Database ping failed:', error.message);
    return false;
  }
};

// Validate MongoDB URI format
export const validateMongoURI = (uri: string): { valid: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  if (!uri) {
    issues.push('URI is empty or undefined');
    return { valid: false, issues };
  }
  
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    issues.push('URI must start with mongodb:// or mongodb+srv://');
  }
  
  if (uri.includes('mongodb+srv://') && !uri.includes('@')) {
    issues.push('Atlas URI missing authentication credentials');
  }
  
  if (uri.includes('<password>') || uri.includes('<username>')) {
    issues.push('URI contains placeholder values - replace with actual credentials');
  }
  
  // Check for common encoding issues
  if (uri.includes(' ')) {
    issues.push('URI contains spaces - may need URL encoding');
  }
  
  return { valid: issues.length === 0, issues };
};

// Connection diagnostics
export const runConnectionDiagnostics = async (): Promise<void> => {
  console.log('\n🔍 Running MongoDB Connection Diagnostics...');
  console.log('═'.repeat(50));
  
  const mongoURI = process.env.MONGODB_URI;
  
  // 1. Check if URI exists
  console.log('1. Environment Variable Check:');
  if (mongoURI) {
    console.log('   ✅ MONGODB_URI is set');
    console.log(`   📝 URI preview: ${mongoURI.substring(0, 30)}...`);
  } else {
    console.log('   ❌ MONGODB_URI is not set');
    return;
  }
  
  // 2. Validate URI format
  console.log('\n2. URI Format Validation:');
  const validation = validateMongoURI(mongoURI);
  if (validation.valid) {
    console.log('   ✅ URI format appears valid');
  } else {
    console.log('   ❌ URI format issues found:');
    validation.issues.forEach(issue => console.log(`      - ${issue}`));
  }
  
  // 3. Check connection state
  console.log('\n3. Current Connection State:');
  const state = mongoose.connection.readyState;
  console.log(`   📊 State: ${getConnectionState(state)} (${state})`);
  
  if (state === 1) {
    console.log(`   🌐 Host: ${mongoose.connection.host}`);
    console.log(`   📊 Database: ${mongoose.connection.db?.databaseName}`);
  }
  
  console.log('═'.repeat(50));
};

// Alternative connection method for troubleshooting
export const connectWithAlternativeMethod = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) return;
  
  console.log('🔄 Trying alternative connection method...');
  
  try {
    // Very basic connection options
    const basicOptions = {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      family: 4
    };
    
    await mongoose.connect(mongoURI, basicOptions);
    console.log('✅ Alternative connection method successful!');
  } catch (error: any) {
    console.log('❌ Alternative connection also failed:', error.message);
  }
};