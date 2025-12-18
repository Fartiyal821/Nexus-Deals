import { defineConfig } from 'vite';

export default defineConfig({
  // Matches the repository name to fix 404/Timeout errors
  base: '/PC-Deals/', 
  build: {
    outDir: 'dist',
    target: 'esnext'
  },
  server: {
    port: 3000
  }
});