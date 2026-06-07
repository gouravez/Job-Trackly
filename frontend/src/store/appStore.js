import { create } from 'zustand'
import { APPLICATIONS } from '@/lib/mockData'

// ---------------------------------------------------------------------------
// Application Store — single source of truth for all application data.
// Both KanbanPage and ApplicationsPage read from and write to this store
// so changes in one are instantly reflected in the other.
// ---------------------------------------------------------------------------

const useAppStore = create((set) => ({
  applications: APPLICATIONS,

  addApplication: (app) =>
    set((state) => ({ applications: [app, ...state.applications] })),

  deleteApplication: (id) =>
    set((state) => ({ applications: state.applications.filter((a) => a.id !== id) })),

  updateApplication: (id, changes) =>
    set((state) => ({
      applications: state.applications.map((a) => (a.id === id ? { ...a, ...changes } : a)),
    })),

  moveApplication: (id, newStatus) =>
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === Number(id) ? { ...a, status: newStatus } : a
      ),
    })),
}))

export default useAppStore