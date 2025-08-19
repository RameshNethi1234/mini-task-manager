import axios from 'axios'

// 🔒 Hardcoded backend URL for assignment
const api = axios.create({
  baseURL: 'https://mini-task-manager-jli5.onrender.com',
  headers: { 'Content-Type': 'application/json' }
})

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    // ensure no duplicate "Bearer"
    const hasBearer = String(token).trim().toLowerCase().startsWith('bearer ')
    config.headers.Authorization = hasBearer ? token : `Bearer ${token}`
  }
  return config
})

export default api
