
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Nexus-Deals/', 
  build: {
    outDir: 'dist',
    target: 'esnext'
  },
  server: {
    port: 3000
  }
});
