import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy /api and /images to backend running on localhost:3000 during dev
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/images': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})