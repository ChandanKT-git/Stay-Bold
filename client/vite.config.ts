import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  plugins: [react()],
  esbuild: {
    // Fix for WebContainer deadlock issues
    target: 'es2020',
    keepNames: true,
    minifyIdentifiers: false,
    minifySyntax: true,
    minifyWhitespace: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom'],
    esbuildOptions: {
      target: 'es2020',
      keepNames: true,
    }
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    headers: {
      // Remove CSP headers that might conflict
      'Content-Security-Policy': '',
      'Content-Security-Policy-Report-Only': '',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Clean up headers from proxy responses
            delete proxyRes.headers['content-security-policy'];
            delete proxyRes.headers['content-security-policy-report-only'];
          });
        }
      },
    },
    // WebContainer optimizations
    fs: {
      strict: false,
    },
  },
  build: {
    sourcemap: true,
    target: 'es2020',
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          maps: ['@react-google-maps/api'],
          utils: ['axios', 'date-fns'],
        }
      }
    },
    // Optimize for WebContainer
    commonjsOptions: {
      include: [/node_modules/],
    },
  }
});