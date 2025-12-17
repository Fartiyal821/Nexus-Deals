import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: This matches your repository name 'PC-Deals'
  // The previous mismatch caused the "Connection Timeout" as scripts returned 404.
  base: '/PC-Deals/', 
  build: {
    outDir: 'dist',
  },
  define: {
    // This ensures process.env is available in the browser to prevent crashes
    // if 'process is not defined' occurs in dependencies.
    'process.env': JSON.stringify(process.env) 
  }
});