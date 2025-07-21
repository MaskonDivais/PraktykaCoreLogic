import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001', 
    },
    host: true,  
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist', 
    sourcemap: false,
  },
  base: './',
})
