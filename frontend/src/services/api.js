// frontend/src/services/api.js
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
  sendOtp:  (data) => api.post('/auth/send-otp', data),
  signUp:   (data) => api.post('/auth/signup',   data),
  signIn:   (data) => api.post('/auth/signin',   data),
  signOut:  ()     => api.post('/auth/signout'),
  me:       ()     => api.get('/auth/me'),
}

// ---------------------------------------------------------------------------
// Applications endpoints
// ---------------------------------------------------------------------------
export const applicationService = {
  getAll:   ()           => api.get('/applications'),
  getOne:   (id)         => api.get(`/applications/${id}`),
  getStats: ()           => api.get('/applications/stats'),
  create:   (data)       => api.post('/applications',      data),
  update:   (id, data)   => api.patch(`/applications/${id}`, data),
  remove:   (id)         => api.delete(`/applications/${id}`),
}

// ---------------------------------------------------------------------------
// User endpoints
// ---------------------------------------------------------------------------
export const userService = {
  changePassword: (data) => api.put('/users/me/password', data),
  updateProfile:  (data) => api.put('/users/me/profile',  data),
}

// ---------------------------------------------------------------------------
// Reminder endpoints
// ---------------------------------------------------------------------------
export const reminderService = {
  getSettings:  ()     => api.get('/reminders/settings'),
  saveSettings: (data) => api.put('/reminders/settings', data),
  sendTest:     ()     => api.post('/reminders/test'),
}

// ---------------------------------------------------------------------------
// Google Calendar sync endpoints
// ---------------------------------------------------------------------------
export const calendarService = {
  getAuthUrl:   ()                      => api.get('/calendar/oauth/url'),
  getStatus:    ()                      => api.get('/calendar/status'),
  disconnect:   ()                      => api.delete('/calendar/disconnect'),
  syncAll:      ()                      => api.post('/calendar/sync-all'),
  pushEvent:    (data)                  => api.post('/calendar/events', data),
  deleteEvent:  (data)                  => api.delete('/calendar/events', { data }),
}
export default api