# CSP Troubleshooting Guide

## Current CSP Issues and Solutions

### Problem Analysis
Your application was experiencing CSP violations due to an overly restrictive `default-src 'none'` policy that blocked all resources by default.

### Root Cause
The CSP header `"default-src 'none'"` blocks ALL resources unless explicitly allowed by specific directives. This caused:
- Inline scripts to be blocked
- External JavaScript files to fail loading
- Web fonts to be rejected
- Runtime script execution to be prevented

## Implemented Solutions

### 1. Environment-Specific CSP Policies

#### Development Environment
```
default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: ws: wss:;
script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: ws: wss: https://maps.googleapis.com;
script-src-elem 'self' 'unsafe-inline' blob: data: https://maps.googleapis.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com;
font-src 'self' data: blob: https://fonts.gstatic.com;
img-src 'self' data: blob: https: http: https://maps.googleapis.com https://images.pexels.com;
connect-src 'self' ws: wss: https: http: blob: data:;
```

#### Production Environment
```
default-src 'self';
script-src 'self' 'nonce-{random}' blob: https://maps.googleapis.com;
script-src-elem 'self' 'nonce-{random}' blob: https://maps.googleapis.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com;
font-src 'self' data: https://fonts.gstatic.com;
img-src 'self' data: https: https://maps.googleapis.com https://images.pexels.com;
connect-src 'self' https:;
```

### 2. Key CSP Directives Explained

#### `script-src` and `script-src-elem`
- **Development**: Allows inline scripts and eval for hot reloading
- **Production**: Uses nonces for secure inline script execution
- **Both**: Allows blob URLs for dynamic content and Google Maps scripts

#### `style-src` and `style-src-elem`
- Allows inline styles (required for CSS-in-JS libraries)
- Permits Google Fonts and Google Maps stylesheets
- Maintains styling flexibility while securing against XSS

#### `font-src`
- Allows data URLs for embedded fonts
- Permits Google Fonts CDN
- Supports blob URLs for dynamic font loading

#### `img-src`
- Allows images from HTTPS sources
- Permits data URLs and blob URLs
- Includes Google Maps tiles and Pexels images

#### `connect-src`
- **Development**: Allows WebSocket connections for hot reloading
- **Production**: Restricts to HTTPS only
- Enables API calls and external service connections

### 3. Security Considerations

#### What We Allow (and Why)
1. **`'unsafe-inline'` in development**: Required for development tools and hot reloading
2. **`'unsafe-eval'` in development**: Needed for some development frameworks
3. **Blob URLs**: Essential for file downloads and dynamic content
4. **Google domains**: Required for Maps API and Fonts
5. **Data URLs**: Needed for inline images and fonts

#### What We Restrict
1. **No `'unsafe-inline'` in production scripts**: Use nonces instead
2. **No `'unsafe-eval'` in production**: Prevents code injection
3. **HTTPS-only in production**: Ensures encrypted connections
4. **Specific domain allowlists**: Only trusted external sources

### 4. Implementation Details

#### Nonce Generation
```javascript
function generateNonce(): string {
  const crypto = require('crypto');
  return crypto.randomBytes(16).toString('base64');
}
```

#### CSP Violation Reporting
- Endpoint: `/api/csp-report`
- Logs violations for monitoring
- Helps identify legitimate resources that need allowlisting

#### Environment Detection
```javascript
const isDevelopment = process.env.NODE_ENV === 'development';
```

### 5. Testing Your CSP

#### Browser Developer Tools
1. Open DevTools → Console
2. Look for CSP violation messages
3. Check Network tab for blocked resources

#### CSP Violation Reports
Monitor the `/api/csp-report` endpoint for violations:
```bash
# Check server logs for CSP violations
tail -f server.log | grep "CSP Violation"
```

#### Online CSP Validators
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [CSP Validator](https://cspvalidator.org/)

### 6. Common Issues and Fixes

#### Issue: Scripts Still Blocked
**Solution**: Ensure nonce is properly added to script tags in production
```html
<script nonce="${res.locals.nonce}">...</script>
```

#### Issue: Fonts Not Loading
**Solution**: Add font domains to `font-src`
```
font-src 'self' data: https://fonts.gstatic.com https://your-font-cdn.com;
```

#### Issue: Images Not Displaying
**Solution**: Add image sources to `img-src`
```
img-src 'self' data: blob: https: https://your-image-cdn.com;
```

#### Issue: API Calls Failing
**Solution**: Add API domains to `connect-src`
```
connect-src 'self' https: https://api.your-service.com;
```

### 7. Best Practices

1. **Start Restrictive**: Begin with strict CSP and add exceptions as needed
2. **Use Nonces**: Prefer nonces over `'unsafe-inline'` in production
3. **Monitor Violations**: Set up CSP violation reporting
4. **Test Thoroughly**: Test CSP in all environments
5. **Regular Audits**: Review and update CSP policies regularly
6. **Document Changes**: Keep track of why specific directives were added

### 8. Debugging Commands

#### Check Current CSP Headers
```bash
curl -I http://localhost:5000/api/health
```

#### Test CSP with Browser
```javascript
// In browser console
console.log(document.querySelector('meta[http-equiv="Content-Security-Policy"]'));
```

#### Validate CSP Syntax
```bash
# Use CSP validator tools or browser extensions
```

### 9. Production Deployment Checklist

- [ ] Remove `'unsafe-inline'` from script-src
- [ ] Remove `'unsafe-eval'` from script-src
- [ ] Implement nonce generation
- [ ] Add nonces to all inline scripts
- [ ] Test all functionality with strict CSP
- [ ] Set up CSP violation monitoring
- [ ] Configure HTTPS-only policies
- [ ] Review and minimize allowed domains

### 10. Emergency CSP Bypass (Development Only)

If you need to temporarily disable CSP for debugging:

```javascript
// In server middleware (DEVELOPMENT ONLY)
if (process.env.NODE_ENV === 'development' && process.env.DISABLE_CSP === 'true') {
  // Skip CSP middleware
  return next();
}
```

**Warning**: Never disable CSP in production!