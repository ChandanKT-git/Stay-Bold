import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Remove any CSP headers from Vite to prevent conflicts
    headers: {},
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // Ensure proxy doesn't add conflicting headers
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Remove any conflicting CSP headers from proxy responses
            delete proxyRes.headers['content-security-policy'];
            delete proxyRes.headers['content-security-policy-report-only'];
          });
        }
      },
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          maps: ['@react-google-maps/api'],
        }
      }
    }
  }
});