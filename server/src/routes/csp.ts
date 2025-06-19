import { Router, Request, Response } from 'express';
import { cspReportHandler } from '../middleware/csp';

const router = Router();

// CSP violation reporting endpoint
router.post('/csp-report', cspReportHandler);

// CSP testing endpoint for development
router.get('/csp-test', (req: Request, res: Response) => {
  const nonce = res.locals.nonce || 'development-mode-no-nonce-needed';
  
  const testHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSP Test Page</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .test-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
        .success { background-color: #d4edda; border-color: #c3e6cb; }
        .error { background-color: #f8d7da; border-color: #f5c6cb; }
        .info { background-color: #d1ecf1; border-color: #bee5eb; }
    </style>
</head>
<body>
    <h1>CSP Configuration Test</h1>
    
    <div class="test-section info">
        <h3>Current Nonce: ${nonce}</h3>
        <p>This nonce should be used for all inline scripts in production.</p>
    </div>
    
    <div class="test-section" id="inline-script-test">
        <h3>Inline Script Test</h3>
        <p id="inline-result">Testing...</p>
        <script nonce="${nonce}">
            document.getElementById('inline-result').textContent = 'Inline script executed successfully!';
            document.getElementById('inline-script-test').className += ' success';
        </script>
    </div>
    
    <div class="test-section" id="external-script-test">
        <h3>External Script Test (Google Maps)</h3>
        <p id="external-result">Testing external script loading...</p>
        <script nonce="${nonce}">
            // Test loading external script
            const script = document.createElement('script');
            script.src = 'https://maps.googleapis.com/maps/api/js?key=test&callback=initMap';
            script.onload = function() {
                document.getElementById('external-result').textContent = 'External script loaded successfully!';
                document.getElementById('external-script-test').className += ' success';
            };
            script.onerror = function() {
                document.getElementById('external-result').textContent = 'External script failed to load (expected without valid API key)';
                document.getElementById('external-script-test').className += ' info';
            };
            document.head.appendChild(script);
        </script>
    </div>
    
    <div class="test-section" id="font-test">
        <h3>Font Loading Test</h3>
        <p style="font-family: 'Roboto', sans-serif;">This text should use Roboto font from Google Fonts</p>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
    </div>
    
    <div class="test-section" id="image-test">
        <h3>Image Loading Test</h3>
        <img src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&dpr=1" 
             alt="Test image" style="max-width: 200px; height: auto;" 
             onload="this.parentElement.className += ' success';"
             onerror="this.parentElement.className += ' error';">
    </div>
    
    <div class="test-section" id="blob-test">
        <h3>Blob URL Test</h3>
        <p id="blob-result">Testing blob URL creation...</p>
        <script nonce="${nonce}">
            try {
                const blob = new Blob(['console.log("Blob script executed");'], { type: 'application/javascript' });
                const blobUrl = URL.createObjectURL(blob);
                document.getElementById('blob-result').textContent = 'Blob URL created: ' + blobUrl.substring(0, 50) + '...';
                document.getElementById('blob-test').className += ' success';
                URL.revokeObjectURL(blobUrl);
            } catch (error) {
                document.getElementById('blob-result').textContent = 'Blob URL creation failed: ' + error.message;
                document.getElementById('blob-test').className += ' error';
            }
        </script>
    </div>
    
    <div class="test-section info">
        <h3>CSP Violation Reporting</h3>
        <p>Any CSP violations will be reported to: <code>/api/csp-report</code></p>
        <p>Check the server console for violation reports.</p>
    </div>
    
    <div class="test-section info">
        <h3>Environment Information</h3>
        <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
        <p><strong>CSP Disabled:</strong> ${process.env.DISABLE_CSP === 'true' ? 'Yes' : 'No'}</p>
    </div>
</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(testHTML);
});

// Endpoint to get current CSP policy (for debugging)
router.get('/csp-policy', (req: Request, res: Response) => {
  const cspHeader = res.getHeader('Content-Security-Policy') || 'No CSP policy set';
  
  res.json({
    environment: process.env.NODE_ENV || 'development',
    cspDisabled: process.env.DISABLE_CSP === 'true',
    currentNonce: res.locals.nonce || 'Not applicable in development',
    cspPolicy: cspHeader.toString(),
    cspLength: cspHeader.toString().length,
    timestamp: new Date().toISOString()
  });
});

export default router;