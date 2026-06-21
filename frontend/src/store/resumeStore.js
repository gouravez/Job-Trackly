import { create } from 'zustand'
import { resumeService } from '@/services/api'

// ---------------------------------------------------------------------------
// Resume Store — handles all resume state per application.
// Used by ResumeCard (detail page) and AddApplicationModal (step 2).
// ---------------------------------------------------------------------------

const useResumeStore = create((set, get) => ({
  // Map of applicationId → resume[]
  // null key = user's general resume vault (not linked to any app)
  resumesByApp: {},
  isUploading:  false,
  uploadError:  null,

  // ── Fetch resumes for an application (or all) ──────────────────────────
  fetchResumes: async (applicationId = null) => {
    try {
      const { data } = await resumeService.list(applicationId)
      const key = applicationId ?? 'all'
      set((s) => ({
        resumesByApp: { ...s.resumesByApp, [key]: data.data },
      }))
    } catch (err) {
      console.error('Failed to fetch resumes:', err?.response?.data?.message)
    }
  },

  // ── Upload a resume file ───────────────────────────────────────────────
  uploadResume: async ({ file, applicationId = null }) => {
    set({ isUploading: true, uploadError: null })
    try {
      const formData = new FormData()
      formData.append('resume', file)
      if (applicationId) formData.append('applicationId', applicationId)

      const { data } = await resumeService.upload(formData)
      const key = applicationId ?? 'all'

      // Prepend new resume to the list
      set((s) => ({
        isUploading:  false,
        resumesByApp: {
          ...s.resumesByApp,
          [key]: [data.data, ...(s.resumesByApp[key] || [])],
        },
      }))

      return { success: true, data: data.data }
    } catch (err) {
      const error = err?.response?.data?.message || 'Upload failed'
      set({ isUploading: false, uploadError: error })
      return { success: false, error }
    }
  },

  // ── Delete a resume ────────────────────────────────────────────────────
  deleteResume: async ({ resumeId, applicationId = null }) => {
    try {
      await resumeService.remove(resumeId)
      const key = applicationId ?? 'all'
      set((s) => ({
        resumesByApp: {
          ...s.resumesByApp,
          [key]: (s.resumesByApp[key] || []).filter((r) => r.id !== resumeId),
        },
      }))
      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err?.response?.data?.message || 'Delete failed',
      }
    }
  },

  // ── Get resumes for a specific app from store ──────────────────────────
  getResumes: (applicationId = null) => {
    const key = applicationId ?? 'all'
    return get().resumesByApp[key] || []
  },

  clearError: () => set({ uploadError: null }),
}))

export default useResumeStore