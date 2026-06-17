import axios from 'axios'

// In production (Render), VITE_API_URL is set to the backend service URL.
// In dev, it's empty and Vite's proxy handles /api → localhost:8000.
const api = axios.create({
  baseURL: typeof __API_URL__ !== 'undefined' ? __API_URL__ : ''
})

export default api
