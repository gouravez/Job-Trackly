import { create } from 'zustand'
import { applicationService } from '@/services/api'

// ---------------------------------------------------------------------------
// Application Store — fetches from real API, keeps local state in sync.
// All pages (Dashboard, Applications, Kanban) read from this store.
// ---------------------------------------------------------------------------

const useAppStore = create((set, get) => ({
  applications: [],
  isLoading:    false,
  error:        null,

  // ── Fetch all ─────────────────────────────────────────────────────────────
  fetchApplications: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await applicationService.getAll()
      set({ applications: data.data, isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: err?.response?.data?.message || 'Failed to load applications' })
    }
  },

  // ── Add ───────────────────────────────────────────────────────────────────
  addApplication: async (form) => {
    try {
      const { data } = await applicationService.create(form)
      set((state) => ({ applications: [data.data, ...state.applications] }))
      return { success: true }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || 'Failed to add application' }
    }
  },

  // ── Update ────────────────────────────────────────────────────────────────
  updateApplication: async (id, changes) => {
    try {
      const { data } = await applicationService.update(id, changes)
      set((state) => ({
        applications: state.applications.map((a) => (a.id === id ? data.data : a)),
      }))
      return { success: true }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || 'Failed to update application' }
    }
  },

  // ── Move (Kanban drag) ────────────────────────────────────────────────────
  moveApplication: async (id, newStatus) => {
    const numId = Number(id)
    // Optimistic update
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === numId ? { ...a, status: newStatus } : a
      ),
    }))
    try {
      await applicationService.update(numId, { status: newStatus })
    } catch {
      // Roll back on failure
      get().fetchApplications()
    }
  },

  // ── Delete ────────────────────────────────────────────────────────────────
  deleteApplication: async (id) => {
    try {
      await applicationService.remove(id)
      set((state) => ({ applications: state.applications.filter((a) => a.id !== id) }))
      return { success: true }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || 'Failed to delete application' }
    }
  },
}))

export default useAppStore