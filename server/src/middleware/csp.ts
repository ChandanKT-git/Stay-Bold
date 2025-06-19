import { Request, Response, NextFunction } from 'express';

export const cspMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Remove any existing CSP headers that might conflict
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('Content-Security-Policy-Report-Only');
  
  if (isDevelopment) {
    // Development CSP - More restrictive while maintaining functionality
    const developmentCSP = [
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: ws: wss:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: ws: wss: https://maps.googleapis.com https://maps.gstatic.com",
      "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' blob: data: ws: wss: https://maps.googleapis.com https://maps.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com",
      "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com",
      "font-src 'self' data: blob: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.pexels.com https://maps.googleapis.com https://maps.gstatic.com",
      "connect-src 'self' ws: wss: https://api.stripe.com https://maps.googleapis.com",
      "frame-src 'self' blob: https://js.stripe.com",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "object-src 'none'",
      "media-src 'self' data: blob:",
      "manifest-src 'self'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
    
    res.setHeader('Content-Security-Policy', developmentCSP);
    console.log('Applied improved development CSP');
  } else {
    // Production CSP with nonce support
    const nonce = generateNonce();
    res.locals.nonce = nonce;
    
    const productionCSP = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' blob: https://maps.googleapis.com https://maps.gstatic.com`,
      `script-src-elem 'self' 'nonce-${nonce}' blob: https://maps.googleapis.com https://maps.gstatic.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com",
      "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: https: https://maps.googleapis.com https://maps.gstatic.com https://images.pexels.com",
      "connect-src 'self' https:",
      "frame-src 'self'",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ');
    
    res.setHeader('Content-Security-Policy', productionCSP);
  }
  
  next();
};

// Generate a cryptographically secure nonce
function generateNonce(): string {
  const crypto = require('crypto');
  return crypto.randomBytes(16).toString('base64');
}

// CSP violation reporting endpoint handler
export const cspReportHandler = (req: Request, res: Response) => {
  console.log('CSP Violation Report:', JSON.stringify(req.body, null, 2));
  res.status(204).end();
};

// Middleware to disable CSP entirely for development debugging
export const disableCSPForDevelopment = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'production' && process.env.DISABLE_CSP === 'true') {
    console.log('CSP DISABLED FOR DEVELOPMENT DEBUGGING');
    res.removeHeader('Content-Security-Policy');
    res.removeHeader('Content-Security-Policy-Report-Only');
    return next();
  }
  next();
};