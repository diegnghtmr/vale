import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'i18next',
            'react-i18next',
            '@fullcalendar/core',
            '@fullcalendar/react',
            '@fullcalendar/timegrid'
          ]
        }
      }
    }
  }
});
