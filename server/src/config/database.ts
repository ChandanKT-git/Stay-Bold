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
    
    // MongoDB connection options optimized for Atlas
    const options = {
      // Connection timeouts
      serverSelectionTimeoutMS: 10000, // 10 seconds
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      
      // Buffer settings
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 1,
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
      
      // Use IPv4 to avoid family errors
      family: 4,
      
      // Additional Atlas-specific options
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      // Authentication
      authSource: 'admin',
      
      // SSL/TLS settings for Atlas
      ssl: true,
      
      // Heartbeat settings
      heartbeatFrequencyMS: 10000,
      
      // Additional options for Atlas
      maxIdleTimeMS: 30000,
      serverSelectionRetryDelayMS: 2000
    };

    // Connect to MongoDB with proper error handling
    console.log('⏳ Connecting to MongoDB Atlas...');
    
    await mongoose.connect(mongoURI, options);
    
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
    
    // Provide specific error solutions
    if (error.message.includes('timeout') || error.message.includes('ENOTFOUND')) {
      console.log('\n💡 NETWORK/TIMEOUT ISSUES - Try these solutions:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify MongoDB Atlas cluster is running');
      console.log('   3. Confirm IP whitelist includes 0.0.0.0/0');
      console.log('   4. Check if your network blocks MongoDB ports');
    } else if (error.message.includes('authentication') || error.message.includes('auth')) {
      console.log('\n💡 AUTHENTICATION ISSUES - Try these solutions:');
      console.log('   1. Verify username and password in connection string');
      console.log('   2. Check if user has proper database permissions');
      console.log('   3. Ensure password is URL-encoded (% symbols)');
    } else if (error.message.includes('parse') || error.message.includes('URI')) {
      console.log('\n💡 CONNECTION STRING ISSUES - Try these solutions:');
      console.log('   1. Check connection string format');
      console.log('   2. Ensure all special characters are URL-encoded');
      console.log('   3. Verify cluster name and region');
    }
    
    console.log('\n🔧 QUICK FIXES TO TRY:');
    console.log('   1. Restart your MongoDB Atlas cluster');
    console.log('   2. Generate a new connection string');
    console.log('   3. Try connecting from MongoDB Compass first');
    console.log('   4. Check MongoDB Atlas status page');
    
    console.log('\n⚠️  Server will continue without database connection');
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