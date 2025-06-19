import { Request, Response, NextFunction } from 'express';

export const cspMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Development vs Production CSP
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    // More permissive CSP for development
    res.setHeader('Content-Security-Policy', [
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http:",
      "connect-src 'self' ws: wss: https: http:",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; '));
  } else {
    // Stricter CSP for production with nonce support
    const nonce = generateNonce();
    res.locals.nonce = nonce;
    
    res.setHeader('Content-Security-Policy', [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' blob:`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https:",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; '));
  }
  
  next();
};

// Generate a random nonce for script execution
function generateNonce(): string {
  return Buffer.from(Math.random().toString()).toString('base64');
}

// Alternative hash-based CSP configuration
export const hashBasedCSP = (req: Request, res: Response, next: NextFunction) => {
  // Pre-calculated hashes for known inline scripts
  const scriptHashes = [
    "'sha256-rfbJmE9zPIoYc5ON5vhmCM78ck6olLGv1sW/ALOkJX0='",
    "'sha256-eTPHKn+LGmd2C7uaQlbZbMCR76gn0Rwi03MNNHsuFd4='"
  ];
  
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    `script-src 'self' ${scriptHashes.join(' ')} blob:`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https:",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'"
  ].join('; '));
  
  next();
};