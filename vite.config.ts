import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Nexus-Deals/', // CRITICAL FIX: Must match your GitHub repository name exactly
  build: {
    outDir: 'dist',
  },
});