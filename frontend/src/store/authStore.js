import { create } from 'zustand'
import { authService } from '@/services/api'

const useAuthStore = create((set) => ({
  user:         null,
  token:        localStorage.getItem('token') || null,
  isLoading:    false,
  isInitializing: true,   // true until we've checked the token on startup
  error:        null,

  // ── Called once at app startup — restores user from a stored token ────────
  initAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ isInitializing: false })
      return
    }
    try {
      const { data } = await authService.me()
      set({ user: data.data, token, isInitializing: false })
    } catch {
      // Token is expired or invalid — clear it
      localStorage.removeItem('token')
      set({ user: null, token: null, isInitializing: false })
    }
  },

  // ── Sign in ───────────────────────────────────────────────────────────────
  signIn: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await authService.signIn(credentials)
      localStorage.setItem('token', data.data.token)
      set({ user: data.data.user, token: data.data.token, isLoading: false })
      return { success: true }
    } catch (err) {
      const message = err?.response?.data?.message || 'Invalid email or password'
      set({ isLoading: false, error: message })
      return { success: false, error: message }
    }
  },

  // ── Sign up ───────────────────────────────────────────────────────────────
  signUp: async (formData) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await authService.signUp(formData)
      localStorage.setItem('token', data.data.token)
      set({ user: data.data.user, token: data.data.token, isLoading: false })
      return { success: true }
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to create account'
      set({ isLoading: false, error: message })
      return { success: false, error: message }
    }
  },

  // ── Logout ────────────────────────────────────────────────────────────────
  logout: async () => {
    try { await authService.signOut() } catch { /* ignore */ }
    localStorage.removeItem('token')
    set({ user: null, token: null, error: null })
  },

  // Called by AuthCallbackPage after Google OAuth redirect
  setAuth: ({ token, user }) => {
    localStorage.setItem('token', token)
    set({ user, token })
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore