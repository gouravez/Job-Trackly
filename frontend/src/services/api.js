import axios from 'axios'

// ---------------------------------------------------------------------------
// Axios instance — set VITE_API_URL in .env to point at your backend.
// ---------------------------------------------------------------------------

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ---------------------------------------------------------------------------
// Auth endpoints
// ---------------------------------------------------------------------------
export const authService = {
  signUp: (data)   => api.post('/auth/signup', data),
  signIn: (data)   => api.post('/auth/signin', data),
  signOut: ()      => api.post('/auth/signout'),
  me: ()           => api.get('/auth/me'),
}

// ---------------------------------------------------------------------------
// Applications endpoints
// ---------------------------------------------------------------------------
export const applicationService = {
  getAll:   ()           => api.get('/applications'),
  getOne:   (id)         => api.get(`/applications/${id}`),
  getStats: ()           => api.get('/applications/stats'),
  create:   (data)       => api.post('/applications', data),
  update:   (id, data)   => api.patch(`/applications/${id}`, data),
  remove:   (id)         => api.delete(`/applications/${id}`),
}

export default api