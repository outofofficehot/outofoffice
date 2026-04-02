import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Required for Aztec.js compatibility
      buffer: 'buffer',
    },
  },
  define: {
    // Required for some Aztec dependencies
    'process.env': {},
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      // Required for BigInt support
      target: 'es2020',
    },
  },
  build: {
    target: 'es2020',
  },
});
