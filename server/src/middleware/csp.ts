import { Request, Response, NextFunction } from 'express';

export const cspMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Remove any existing CSP headers that might conflict
  res.removeHeader('Content-Security-Policy');
  res.removeHeader('Content-Security-Policy-Report-Only');
  
  if (isDevelopment) {
    // Very permissive CSP for development to allow all WebContainer functionality
    const developmentCSP = [
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: ws: wss: https: http:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: ws: wss: https: http:",
      "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' blob: data: ws: wss: https: http:",
      "style-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https: http:",
      "style-src-elem 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https: http:",
      "font-src 'self' 'unsafe-inline' data: blob: https: http:",
      "img-src 'self' data: blob: https: http:",
      "connect-src 'self' ws: wss: https: http: blob: data:",
      "frame-src 'self' blob: data: https: http:",
      "worker-src 'self' blob: data: https: http:",
      "child-src 'self' blob: data: https: http:",
      "object-src 'self' data: blob:",
      "media-src 'self' data: blob: https: http:",
      "manifest-src 'self' data: blob:",
      "base-uri 'self' data: blob:",
      "form-action 'self' https: http:"
    ].join('; ');
    
    res.setHeader('Content-Security-Policy', developmentCSP);
    console.log('Applied development CSP:', developmentCSP);
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