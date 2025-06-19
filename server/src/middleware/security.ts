import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Only set non-CSP security headers here
  // CSP is handled by the dedicated CSP middleware
  
  // X-Frame-Options - Prevent clickjacking (but allow trusted frames)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // X-Content-Type-Options - Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // X-XSS-Protection - Enable XSS filtering (legacy browsers)
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy - Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Remove server information
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  
  // Permissions Policy - Control browser features
  const permissionsPolicy = [
    'camera=()',
    'microphone=()',
    'geolocation=(self)',
    'payment=(self)',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
    'ambient-light-sensor=()',
    'autoplay=(self)',
    'encrypted-media=(self)',
    'fullscreen=(self)',
    'picture-in-picture=(self)'
  ].join(', ');
  
  res.setHeader('Permissions-Policy', permissionsPolicy);
  
  // Strict Transport Security (HTTPS only)
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // Additional security headers
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  
  // Cross-Origin policies for enhanced security
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  } else {
    // More permissive for development
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
  
  next();
};

// Enhanced CORS configuration with security considerations
export const corsWithCSP = cors({
  origin: function (origin, callback) {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    const allowedOrigins = [
      // Development origins
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5000',
      
      // Environment-specific origins
      process.env.CLIENT_URL,
      
      // WebContainer origins (for development platforms)
      /^https:\/\/.*\.webcontainer-api\.io$/,
      /^https:\/\/.*\.local-credentialless\.webcontainer-api\.io$/,
      /^https:\/\/.*\.stackblitz\.io$/,
      /^https:\/\/.*\.bolt\.new$/,
      
      // Production origins (add your production domains here)
      // 'https://yourdomain.com',
      // 'https://www.yourdomain.com'
    ].filter(Boolean);
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      // In development, be more permissive but log warnings
      if (isDevelopment) {
        console.warn(`⚠️  CORS allowing unregistered origin in development: ${origin}`);
        callback(null, true);
      } else {
        console.error(`❌ CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-File-Name',
    'X-CSP-Nonce' // Allow nonce to be passed in headers if needed
  ],
  
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Per-Page'
  ],
  
  credentials: true,
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200
});

// Rate limiting configuration (can be used with express-rate-limit)
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  keyGenerator: (req: Request) => {
    // Use IP address as the key, but consider user ID for authenticated requests
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
};