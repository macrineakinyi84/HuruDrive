import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy /api to backend running on localhost:3000 during dev
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})