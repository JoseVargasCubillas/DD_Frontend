import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@atoms': resolve(__dirname, 'src/atomic/atoms'),
      '@molecules': resolve(__dirname, 'src/atomic/molecules'),
      '@organisms': resolve(__dirname, 'src/atomic/organisms'),
      '@templates': resolve(__dirname, 'src/atomic/templates'),
      '@pages': resolve(__dirname, 'src/atomic/pages'),
      '@api': resolve(__dirname, 'src/api'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@store': resolve(__dirname, 'src/store'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@t': resolve(__dirname, 'src/types'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
});
