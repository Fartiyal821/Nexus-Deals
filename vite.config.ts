import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/PC-Deals/', // Sets the correct base path for GitHub Pages
  build: {
    outDir: 'dist',
  },
});