import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Forwards any /api/v1/* request to the Express backend. Browser
      // still sees everything as same-origin (localhost:5173), so the
      // accessToken/refreshToken HttpOnly cookies set by the backend are
      // sent/received without needing any CORS configuration server-side.
      '/api/v1': {
        // target: 'http://localhost:5000',
        target: 'https://promise-jewels-1.onrender.com',
        changeOrigin: true,
      },
    },
  },
})