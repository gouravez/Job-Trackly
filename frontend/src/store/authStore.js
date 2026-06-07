import { create } from 'zustand'
import { authService } from '@/services/api'

// ---------------------------------------------------------------------------
// Auth Store — single source of truth for auth state.
// Wired into SignInPage, SignUpPage, and ProtectedRoute.
// ---------------------------------------------------------------------------

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  // ── Actions ──────────────────────────────────────────────────────────────

  signIn: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      // Uncomment when backend is ready:
      // const { data } = await authService.signIn(credentials)
      // localStorage.setItem('token', data.token)
      // set({ user: data.user, token: data.token, isLoading: false })

      // Mock for now — remove when backend is ready
      await new Promise((r) => setTimeout(r, 900))
      const mockUser = { id: 1, name: 'Alex Johnson', email: credentials.email }
      const mockToken = 'mock-jwt-token'
      localStorage.setItem('token', mockToken)
      set({ user: mockUser, token: mockToken, isLoading: false })
      return { success: true }
    } catch (err) {
      const message = err?.response?.data?.message || 'Invalid email or password'
      set({ isLoading: false, error: message })
      return { success: false, error: message }
    }
  },

  signUp: async (formData) => {
    set({ isLoading: true, error: null })
    try {
      // Uncomment when backend is ready:
      // const { data } = await authService.signUp(formData)
      // localStorage.setItem('token', data.token)
      // set({ user: data.user, token: data.token, isLoading: false })

      // Mock for now
      await new Promise((r) => setTimeout(r, 900))
      const mockUser = { id: 1, name: `${formData.firstName} ${formData.lastName}`, email: formData.email }
      const mockToken = 'mock-jwt-token'
      localStorage.setItem('token', mockToken)
      set({ user: mockUser, token: mockToken, isLoading: false })
      return { success: true }
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to create account'
      set({ isLoading: false, error: message })
      return { success: false, error: message }
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, error: null })
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore