import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), svgr()], // Soporte para React
  build: {
    outDir: 'dist/renderer', // Carpeta de salida para el proceso de renderizado
  },
});