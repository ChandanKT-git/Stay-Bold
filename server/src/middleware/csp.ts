import { Request, Response, NextFunction } from 'express';

export const cspMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    // Development CSP - More permissive to allow dev tools and hot reloading
    res.setHeader('Content-Security-Policy', [
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: ws: wss:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: ws: wss: https://maps.googleapis.com https://maps.gstatic.com",
      "script-src-elem 'self' 'unsafe-inline' blob: data: https://maps.googleapis.com https://maps.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com",
      "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com",
      "font-src 'self' data: blob: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http: https://maps.googleapis.com https://maps.gstatic.com https://images.pexels.com",
      "connect-src 'self' ws: wss: https: http: blob: data:",
      "frame-src 'self' blob:",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; '));
  } else {
    // Production CSP - Stricter with nonce support
    const nonce = generateNonce();
    res.locals.nonce = nonce;
    
    res.setHeader('Content-Security-Policy', [
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
    ].join('; '));
  }
  
  next();
};

// Generate a cryptographically secure nonce
function generateNonce(): string {
  const crypto = require('crypto');
  return crypto.randomBytes(16).toString('base64');
}

// Report-only CSP for testing (optional)
export const cspReportOnly = (req: Request, res: Response, next: NextFunction) => {
  const cspPolicy = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' blob:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https:",
    "report-uri /api/csp-report"
  ].join('; ');
  
  res.setHeader('Content-Security-Policy-Report-Only', cspPolicy);
  next();
};

// CSP violation reporting endpoint
export const cspReportHandler = (req: Request, res: Response) => {
  console.log('CSP Violation Report:', JSON.stringify(req.body, null, 2));
  res.status(204).end();
};