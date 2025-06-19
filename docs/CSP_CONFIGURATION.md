# Content Security Policy (CSP) Configuration Guide

## Overview
This document explains the CSP configuration implemented to resolve resource loading issues while maintaining security.

## CSP Directives Explained

### Development Environment
For development, we use a more permissive CSP to allow hot reloading and development tools:

```
default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;
script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data:;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' data: https://fonts.gstatic.com;
img-src 'self' data: blob: https: http:;
connect-src 'self' ws: wss: https: http:;
```

### Production Environment
For production, we use a stricter CSP with nonce-based script execution:

```
default-src 'self';
script-src 'self' 'nonce-{random}' blob:;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https:;
```

## Directive Breakdown

### `default-src`
- **Development**: `'self' 'unsafe-inline' 'unsafe-eval' data: blob:`
- **Production**: `'self'`
- Controls the default policy for all resource types

### `script-src`
- **Development**: `'self' 'unsafe-inline' 'unsafe-eval' blob: data:`
- **Production**: `'self' 'nonce-{random}' blob:`
- Allows script execution from same origin, with nonces in production

### `style-src`
- `'self' 'unsafe-inline' https://fonts.googleapis.com`
- Allows inline styles (needed for CSS-in-JS) and Google Fonts

### `font-src`
- `'self' data: https://fonts.gstatic.com`
- Allows fonts from same origin, data URLs, and Google Fonts

### `img-src`
- **Development**: `'self' data: blob: https: http:`
- **Production**: `'self' data: https:`
- Allows images from various sources

### `connect-src`
- **Development**: `'self' ws: wss: https: http:`
- **Production**: `'self' https:`
- Controls AJAX, WebSocket, and EventSource connections

## Implementation Methods

### 1. Nonce-Based CSP (Recommended for Production)
```javascript
// Generate unique nonce for each request
const nonce = generateNonce();
res.locals.nonce = nonce;

// Use nonce in script tags
<script nonce="${nonce}">...</script>
```

### 2. Hash-Based CSP
```javascript
// Pre-calculate hashes for known inline scripts
const scriptHashes = [
  "'sha256-rfbJmE9zPIoYc5ON5vhmCM78ck6olLGv1sW/ALOkJX0='",
  "'sha256-eTPHKn+LGmd2C7uaQlbZbMCR76gn0Rwi03MNNHsuFd4='"
];
```

### 3. Unsafe-Inline (Development Only)
```javascript
// Only for development - not recommended for production
script-src 'self' 'unsafe-inline' 'unsafe-eval'
```

## Security Considerations

### What We Allow
- **Blob URLs**: Required for dynamic content and file downloads
- **Data URLs**: Needed for inline images and fonts
- **Google Fonts**: External font loading
- **WebSocket connections**: For development hot reloading

### What We Restrict
- **Inline scripts in production**: Use nonces instead
- **eval() in production**: Prevented by removing 'unsafe-eval'
- **External scripts**: Only from trusted sources
- **Object/embed tags**: Completely blocked

## Troubleshooting

### Common Issues and Solutions

1. **Script blocked errors**
   - Add nonce to script tags in production
   - Use 'unsafe-inline' only in development

2. **Font loading failures**
   - Ensure font-src includes data: and font CDN domains
   - Check CORS headers for external fonts

3. **WebSocket connection errors**
   - Include ws: and wss: in connect-src for development
   - Ensure proper origin validation

4. **Image loading issues**
   - Add blob: and data: to img-src
   - Include HTTPS domains for external images

## Environment-Specific Configuration

### Development
- Permissive CSP for development tools
- Allows hot reloading and debugging
- Includes WebSocket connections

### Production
- Strict CSP with nonce-based scripts
- Removes 'unsafe-eval' and 'unsafe-inline'
- HTTPS-only connections

## Testing CSP

1. **Browser Developer Tools**
   - Check Console for CSP violations
   - Review Network tab for blocked resources

2. **CSP Reporting**
   - Add report-uri directive for violation reports
   - Monitor CSP violations in production

3. **CSP Validators**
   - Use online CSP validators
   - Test with CSP Evaluator tools

## Best Practices

1. **Start Strict**: Begin with restrictive CSP and add exceptions as needed
2. **Use Nonces**: Prefer nonces over 'unsafe-inline' in production
3. **Regular Audits**: Review and update CSP regularly
4. **Monitor Violations**: Set up CSP violation reporting
5. **Test Thoroughly**: Test CSP in all environments before deployment