# CSP Implementation Guide

## Overview
This guide explains the Content Security Policy (CSP) implementation for the StayFinder application, providing secure configurations for both development and production environments.

## CSP Configuration Summary

### Development Environment
- **Purpose**: Allow development tools, hot reloading, and debugging
- **Security Level**: Moderate (allows `unsafe-inline` and `unsafe-eval`)
- **Key Features**:
  - Inline scripts and styles allowed
  - WebSocket connections for hot reloading
  - HTTP connections permitted
  - Comprehensive logging

### Production Environment
- **Purpose**: Maximum security with functional requirements
- **Security Level**: High (nonce-based script execution)
- **Key Features**:
  - Nonce-based inline script execution
  - HTTPS-only connections
  - Strict domain allowlisting
  - CSP violation reporting

## Directive Breakdown

### `default-src`
- **Development**: `'self' data: blob:`
- **Production**: `'self'`
- **Purpose**: Sets the default policy for all resource types

### `script-src` and `script-src-elem`
- **Development**: Allows inline scripts, eval, and development tools
- **Production**: Nonce-based execution only
- **Trusted Domains**:
  - Google Maps API
  - Firebase services
  - Stripe payment processing

### `style-src` and `style-src-elem`
- **Both Environments**: Allows inline styles (required for CSS-in-JS)
- **Trusted Domains**:
  - Google Fonts
  - Google Maps styles

### `font-src`
- **Purpose**: Control font loading sources
- **Allowed Sources**:
  - Self-hosted fonts
  - Data URLs (for embedded fonts)
  - Google Fonts CDN

### `img-src`
- **Development**: All HTTPS/HTTP sources
- **Production**: HTTPS only
- **Trusted Domains**:
  - Pexels (stock photos)
  - Google Maps tiles
  - Placeholder services

### `connect-src`
- **Development**: All protocols including WebSocket
- **Production**: HTTPS only
- **Purpose**: Control AJAX, fetch, and WebSocket connections

### `frame-src`
- **Purpose**: Control embedded frames
- **Allowed Sources**:
  - Stripe payment frames
  - Google Maps embeds

### `worker-src`
- **Purpose**: Control Web Workers and Service Workers
- **Allowed Sources**: Self and blob URLs

## Security Features

### Nonce-Based Script Execution
```javascript
// Server-side nonce generation
const nonce = crypto.randomBytes(16).toString('base64');
res.locals.nonce = nonce;

// Client-side usage
<script nonce="${nonce}">
  // Your inline script here
</script>
```

### Hash-Based Script Validation
```javascript
// Calculate SHA-256 hash for static inline scripts
const hash = crypto.createHash('sha256').update(scriptContent, 'utf8').digest('base64');
// Use in CSP: 'sha256-{hash}'
```

### Violation Reporting
- **Endpoint**: `/api/csp-report`
- **Purpose**: Monitor and debug CSP violations
- **Data Collected**:
  - Violated directive
  - Blocked URI
  - Source file and line number
  - User agent and timestamp

## Implementation Steps

### 1. Server Configuration
```javascript
// Apply CSP middleware before other security headers
app.use(corsWithCSP);
app.use(disableCSPForDevelopment); // Optional for debugging
app.use(cspMiddleware);
app.use(securityHeaders);
```

### 2. Environment Variables
```bash
# Disable CSP for development debugging (use sparingly)
DISABLE_CSP=true

# Set environment
NODE_ENV=production
```

### 3. Client-Side Integration
```javascript
// Access nonce in templates (if using server-side rendering)
const nonce = res.locals.nonce;

// For React applications, nonce can be passed via meta tags
<meta name="csp-nonce" content="${nonce}" />
```

## Testing Your CSP

### 1. Use the CSP Test Page
Visit `/api/csp-test` to run comprehensive CSP tests:
- Inline script execution
- External script loading
- Font loading
- Image loading
- Blob URL creation

### 2. Browser Developer Tools
1. Open DevTools → Console
2. Look for CSP violation messages
3. Check Network tab for blocked resources

### 3. CSP Policy Inspection
Visit `/api/csp-policy` to view current CSP configuration

## Troubleshooting Common Issues

### Issue: Scripts Not Executing
**Symptoms**: JavaScript functionality broken, console errors
**Solutions**:
1. Ensure nonce is properly added to script tags
2. Check if script source is in allowed domains
3. Verify CSP syntax is correct

### Issue: Fonts Not Loading
**Symptoms**: Fallback fonts displayed, network errors
**Solutions**:
1. Add font domain to `font-src`
2. Check CORS headers for font files
3. Verify font URLs are HTTPS in production

### Issue: Images Not Displaying
**Symptoms**: Broken image icons, 404 errors
**Solutions**:
1. Add image domain to `img-src`
2. Ensure HTTPS URLs in production
3. Check for data: and blob: URL support

### Issue: API Calls Failing
**Symptoms**: Network errors, CORS issues
**Solutions**:
1. Add API domain to `connect-src`
2. Verify HTTPS-only in production
3. Check CORS configuration

## Best Practices

### 1. Security First
- Start with strict CSP and add exceptions as needed
- Use nonces instead of `unsafe-inline` in production
- Regularly audit and update CSP policies
- Monitor CSP violations

### 2. Development Workflow
- Use permissive CSP in development
- Test with production CSP before deployment
- Use CSP test page for validation
- Document any CSP exceptions

### 3. Maintenance
- Review CSP policies quarterly
- Update trusted domains as needed
- Monitor violation reports
- Keep security headers updated

## Migration Guide

### From No CSP to Strict CSP
1. **Start with Report-Only mode**:
   ```javascript
   res.setHeader('Content-Security-Policy-Report-Only', policy);
   ```

2. **Analyze violation reports**
3. **Adjust policy based on legitimate violations**
4. **Switch to enforcing mode**:
   ```javascript
   res.setHeader('Content-Security-Policy', policy);
   ```

### From Permissive to Strict CSP
1. **Remove `unsafe-inline` and `unsafe-eval`**
2. **Implement nonce-based script execution**
3. **Add hash-based validation for static scripts**
4. **Test thoroughly in staging environment**

## Resources

- [MDN CSP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Evaluator Tool](https://csp-evaluator.withgoogle.com/)
- [CSP Validator](https://cspvalidator.org/)
- [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

## Support

For CSP-related issues:
1. Check the CSP test page: `/api/csp-test`
2. Review violation reports in server logs
3. Use browser developer tools for debugging
4. Consult this documentation for common solutions