import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Matches the repository name 'Nexus-Deals'
  base: '/Nexus-Deals/', 
  build: {
    outDir: 'dist',
  },
  define: {
    'process.env': JSON.stringify(process.env) 
  }
});