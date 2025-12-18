import { defineConfig } from 'vite';

export default defineConfig({
  // Matches your GitHub Pages repository name to fix 404/Timeout errors
  base: '/Nexus-Deals/', 
  build: {
    outDir: 'dist',
    target: 'esnext'
  },
  server: {
    port: 3000
  }
});