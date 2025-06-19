import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // X-Frame-Options - Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // X-Content-Type-Options - Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // X-XSS-Protection - Enable XSS filtering
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy - Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy - Control browser features
  res.setHeader('Permissions-Policy', [
    'camera=()',
    'microphone=()',
    'geolocation=(self)',
    'payment=(self)',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', '));
  
  // Strict Transport Security (HTTPS only)
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // Cross-Origin-Embedder-Policy
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  
  // Cross-Origin-Opener-Policy
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  
  // Cross-Origin-Resource-Policy
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  
  next();
};

// Enhanced CORS configuration
export const corsWithCSP = cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      process.env.CLIENT_URL,
      // Add your production domain here
    ].filter(Boolean);
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
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
    'X-File-Name'
  ],
  credentials: true,
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200
});

// Rate limiting middleware (optional)
export const rateLimitByIP = (req: Request, res: Response, next: NextFunction) => {
  // Simple in-memory rate limiting
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;
  
  // In production, use Redis or a proper rate limiting solution
  if (!global.rateLimitStore) {
    global.rateLimitStore = new Map();
  }
  
  const key = `rate_limit_${ip}`;
  const requests = global.rateLimitStore.get(key) || [];
  
  // Remove old requests outside the window
  const validRequests = requests.filter((time: number) => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.'
    });
  }
  
  validRequests.push(now);
  global.rateLimitStore.set(key, validRequests);
  
  next();
};