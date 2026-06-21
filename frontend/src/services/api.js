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
  me:             ()     => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword:  (data) => api.post('/auth/reset-password',  data),
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

// ---------------------------------------------------------------------------
// Referral Network endpoints
// ---------------------------------------------------------------------------
export const referralService = {
  getAll:          ()                      => api.get('/referrals'),
  getOne:          (id)                    => api.get(`/referrals/${id}`),
  create:          (data)                  => api.post('/referrals', data),
  update:          (id, data)              => api.patch(`/referrals/${id}`, data),
  remove:          (id)                    => api.delete(`/referrals/${id}`),
  linkApplication: (id, data)              => api.post(`/referrals/${id}/link`, data),
  unlinkApplication:(id, appId)            => api.delete(`/referrals/${id}/link/${appId}`),
}

// ---------------------------------------------------------------------------
// Resume endpoints
// ---------------------------------------------------------------------------
export const resumeService = {
  // Upload — multipart/form-data, not JSON
  upload: (formData) =>
    api.post('/resumes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  list:            (applicationId) =>
    api.get('/resumes', { params: applicationId ? { applicationId } : {} }),

  getOne:          (id)            => api.get(`/resumes/${id}`),
  remove:          (id)            => api.delete(`/resumes/${id}`),
  linkToApp:       (id, applicationId) =>
    api.patch(`/resumes/${id}/link`, { applicationId }),
}

export default api