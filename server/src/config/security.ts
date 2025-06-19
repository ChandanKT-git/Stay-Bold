// Security configuration constants
export const SECURITY_CONFIG = {
  // Trusted domains for external resources
  TRUSTED_DOMAINS: {
    FONTS: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
    IMAGES: ['https://images.pexels.com', 'https://maps.googleapis.com', 'https://maps.gstatic.com'],
    SCRIPTS: ['https://maps.googleapis.com', 'https://maps.gstatic.com'],
    APIS: ['https://api.stripe.com', 'https://maps.googleapis.com'],
    FRAMES: ['https://js.stripe.com']
  },
  
  // CSP nonce configuration
  NONCE: {
    LENGTH: 16,
    ENCODING: 'base64' as BufferEncoding
  },
  
  // Rate limiting configuration
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100, // per window
    SKIP_SUCCESSFUL_REQUESTS: false
  },
  
  // CORS configuration
  CORS: {
    DEVELOPMENT_ORIGINS: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5000'
    ],
    PRODUCTION_ORIGINS: [
      // Add your production domains here
    ]
  }
};

// Environment-specific security settings
export const getSecurityConfig = () => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  return {
    isDevelopment,
    allowUnsafeInline: isDevelopment,
    allowUnsafeEval: isDevelopment,
    enableCSPReporting: !isDevelopment,
    strictTransportSecurity: !isDevelopment
  };
};