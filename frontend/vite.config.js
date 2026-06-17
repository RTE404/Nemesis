import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  },
  define: {
    // Makes VITE_API_URL available as a global so axios baseURL can be set
    __API_URL__: JSON.stringify(process.env.VITE_API_URL || '')
  }
}))
