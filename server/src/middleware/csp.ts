import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Generate a cryptographically secure nonce
function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

// Calculate SHA-256 hash for inline scripts
function calculateHash(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('base64');
}

// Common trusted domains
const TRUSTED_DOMAINS = {
  GOOGLE_MAPS: [
    'https://maps.googleapis.com',
    'https://maps.gstatic.com'
  ],
  GOOGLE_FONTS: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ],
  FIREBASE: [
    'https://www.gstatic.com',
    'https://securetoken.googleapis.com',
    'https://identitytoolkit.googleapis.com'
  ],
  STRIPE: [
    'https://js.stripe.com',
    'https://api.stripe.com'
  ],
  IMAGES: [
    'https://images.pexels.com',
    'https://via.placeholder.com'
  ]
};

// Cache CSP policies to avoid regenerating them on every request
let developmentCSP: string | null = null;
let productionCSPTemplate: string | null = null;

function buildDevelopmentCSP(): string {
  if (developmentCSP) return developmentCSP;
  
  developmentCSP = [
    // Default policy - allow self and common data sources
    "default-src 'self' data: blob:",
    
    // Scripts - Allow development tools and hot reloading
    [
      "script-src 'self'",
      "'unsafe-inline'", // Required for development hot reloading
      "'unsafe-eval'", // Required for development tools
      "blob:",
      "data:",
      "ws:",
      "wss:",
      ...TRUSTED_DOMAINS.GOOGLE_MAPS,
      ...TRUSTED_DOMAINS.FIREBASE,
      ...TRUSTED_DOMAINS.STRIPE
    ].join(' '),
    
    // Script elements (for external scripts)
    [
      "script-src-elem 'self'",
      "'unsafe-inline'",
      "blob:",
      "data:",
      ...TRUSTED_DOMAINS.GOOGLE_MAPS,
      ...TRUSTED_DOMAINS.FIREBASE,
      ...TRUSTED_DOMAINS.STRIPE
    ].join(' '),
    
    // Styles - Allow inline styles for CSS-in-JS
    [
      "style-src 'self'",
      "'unsafe-inline'", // Required for CSS-in-JS and dynamic styles
      ...TRUSTED_DOMAINS.GOOGLE_FONTS,
      ...TRUSTED_DOMAINS.GOOGLE_MAPS
    ].join(' '),
    
    // Style elements
    [
      "style-src-elem 'self'",
      "'unsafe-inline'",
      ...TRUSTED_DOMAINS.GOOGLE_FONTS,
      ...TRUSTED_DOMAINS.GOOGLE_MAPS
    ].join(' '),
    
    // Fonts
    [
      "font-src 'self'",
      "data:",
      "blob:",
      ...TRUSTED_DOMAINS.GOOGLE_FONTS
    ].join(' '),
    
    // Images - Allow all HTTPS and development sources
    [
      "img-src 'self'",
      "data:",
      "blob:",
      "https:",
      "http:", // Allow HTTP in development
      ...TRUSTED_DOMAINS.GOOGLE_MAPS,
      ...TRUSTED_DOMAINS.IMAGES
    ].join(' '),
    
    // Network connections
    [
      "connect-src 'self'",
      "ws:",
      "wss:",
      "https:",
      "http:", // Allow HTTP in development
      "blob:",
      "data:",
      ...TRUSTED_DOMAINS.GOOGLE_MAPS,
      ...TRUSTED_DOMAINS.FIREBASE,
      ...TRUSTED_DOMAINS.STRIPE
    ].join(' '),
    
    // Frames for embedded content
    [
      "frame-src 'self'",
      "blob:",
      ...TRUSTED_DOMAINS.STRIPE,
      ...TRUSTED_DOMAINS.GOOGLE_MAPS
    ].join(' '),
    
    // Workers for background processing
    "worker-src 'self' blob: data:",
    
    // Child contexts
    "child-src 'self' blob:",
    
    // Media sources
    "media-src 'self' data: blob: https:",
    
    // Manifest files
    "manifest-src 'self'",
    
    // Object and embed (disabled for security)
    "object-src 'none'",
    
    // Base URI restriction
    "base-uri 'self'",
    
    // Form submission restriction
    "form-action 'self'"
  ].join('; ');
  
  return developmentCSP;
}

function buildProductionCSP(nonce: string): string {
  return [
    // Default policy - strict self-only
    "default-src 'self'",
    
    // Scripts - Nonce-based with specific trusted domains
    [
      "script-src 'self'",
      `'nonce-${nonce}'`,
      "blob:",
      ...TRUSTED_DOMAINS.GOOGLE_MAPS,
      ...TRUSTED_DOMAINS.FIREBASE,
      ...TRUSTED_DOMAINS.STRIPE
    ].join(' '),
    
    // Script elements
    [
      "script-src-elem 'self'",
      `'nonce-${nonce}'`,
      "blob:",
      ...TRUSTED_DOMAINS.GOOGLE_MAPS,
      ...TRUSTED_DOMAINS.FIREBASE,
      ...TRUSTED_DOMAINS.STRIPE
    ].join(' '),
    
    // Styles - Allow inline for CSS-in-JS (consider moving to nonce in future)
    [
      "style-src 'self'",
      "'unsafe-inline'", // TODO: Replace with nonce-based styles
      ...TRUSTED_DOMAINS.GOOGLE_FONTS,
      ...TRUSTED_DOMAINS.GOOGLE_MAPS
    ].join(' '),
    
    // Style elements
    [
      "style-src-elem 'self'",
      "'unsafe-inline'",
      ...TRUSTED_DOMAINS.GOOGLE_FONTS,
      ...TRUSTED_DOMAINS.GOOGLE_MAPS
    ].join(' '),
    
    // Fonts
    [
      "font-src 'self'",
      "data:",
      ...TRUSTED_DOMAINS.GOOGLE_FONTS
    ].join(' '),
    
    // Images - HTTPS only in production
    [
      "img-src 'self'",
      "data:",
      "https:",
      ...TRUSTED_DOMAINS.GOOGLE_MAPS,
      ...TRUSTED_DOMAINS.IMAGES
    ].join(' '),
    
    // Network connections - HTTPS only
    [
      "connect-src 'self'",
      "https:",
      ...TRUSTED_DOMAINS.GOOGLE_MAPS,
      ...TRUSTED_DOMAINS.FIREBASE,
      ...TRUSTED_DOMAINS.STRIPE
    ].join(' '),
    
    // Frames
    [
      "frame-src 'self'",
      ...TRUSTED_DOMAINS.STRIPE,
      ...TRUSTED_DOMAINS.GOOGLE_MAPS
    ].join(' '),
    
    // Workers
    "worker-src 'self' blob:",
    
    // Child contexts
    "child-src 'self' blob:",
    
    // Media
    "media-src 'self' data: https:",
    
    // Manifest
    "manifest-src 'self'",
    
    // Security restrictions
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    
    // Force HTTPS
    "upgrade-insecure-requests",
    
    // Block mixed content
    "block-all-mixed-content"
  ].join('; ');
}

// Track if CSP has been logged for this server session
let cspLogged = false;

export const cspMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSP for API endpoints that don't serve HTML content
  if (req.path.startsWith('/api/') && !req.path.includes('/csp-test')) {
    return next();
  }
  
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Remove any existing CSP headers that might conflict
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('Content-Security-Policy-Report-Only');
  
  if (isDevelopment) {
    // Use cached development CSP
    const devCSP = buildDevelopmentCSP();
    res.setHeader('Content-Security-Policy', devCSP);
    
    // Only log once per server restart
    if (!cspLogged) {
      console.log('✅ Applied development CSP (permissive for development tools)');
      cspLogged = true;
    }
    
  } else {
    // Generate nonce for production
    const nonce = generateNonce();
    res.locals.nonce = nonce;
    
    const prodCSP = buildProductionCSP(nonce);
    res.setHeader('Content-Security-Policy', prodCSP);
    
    // Only log once per server restart
    if (!cspLogged) {
      console.log('🔒 Applied production CSP (strict nonce-based security)');
      cspLogged = true;
    }
  }
  
  next();
};

// CSP violation reporting endpoint handler
export const cspReportHandler = (req: Request, res: Response) => {
  const violation = req.body;
  
  // Log the violation with useful details
  console.log('🚨 CSP Violation Report:', {
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent']?.substring(0, 100) + '...',
    url: req.headers.referer || req.headers.origin,
    violation: {
      documentURI: violation['document-uri'],
      violatedDirective: violation['violated-directive'],
      blockedURI: violation['blocked-uri'],
      sourceFile: violation['source-file'],
      lineNumber: violation['line-number']
    }
  });
  
  // In production, you might want to send this to a monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to monitoring service
    // monitoringService.reportCSPViolation(violation);
  }
  
  res.status(204).end();
};

// Middleware to disable CSP entirely for development debugging
export const disableCSPForDevelopment = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'production' && process.env.DISABLE_CSP === 'true') {
    console.log('⚠️  CSP COMPLETELY DISABLED FOR DEVELOPMENT DEBUGGING');
    console.log('⚠️  DO NOT USE THIS IN PRODUCTION!');
    res.removeHeader('Content-Security-Policy');
    res.removeHeader('Content-Security-Policy-Report-Only');
    return next();
  }
  next();
};

// Helper function to add nonce to script tags in templates
export const addNonceToScript = (scriptContent: string, nonce: string): string => {
  return scriptContent.replace(/<script/g, `<script nonce="${nonce}"`);
};

// Helper function to generate CSP hash for inline scripts
export const generateScriptHash = (scriptContent: string): string => {
  return `'sha256-${calculateHash(scriptContent)}'`;
};