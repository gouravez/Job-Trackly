import { create } from 'zustand'
import { referralService } from '@/services/api'

const useReferralStore = create((set, get) => ({
  referrals: [],
  isLoading: false,
  error:     null,

  fetchReferrals: async () => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await referralService.getAll()
      set({ referrals: data.data, isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: err?.response?.data?.message || 'Failed to load referrals' })
    }
  },

  addReferral: async (form) => {
    try {
      const { data } = await referralService.create(form)
      set((s) => ({ referrals: [data.data, ...s.referrals] }))
      return { success: true }
    } catch (err) {
      return { success: false, message: err?.response?.data?.message || 'Failed to add contact' }
    }
  },

  updateReferral: async (id, form) => {
    try {
      const { data } = await referralService.update(id, form)
      set((s) => ({ referrals: s.referrals.map(r => r.id === id ? data.data : r) }))
      return { success: true }
    } catch (err) {
      return { success: false, message: err?.response?.data?.message || 'Failed to update contact' }
    }
  },

  removeReferral: async (id) => {
    try {
      await referralService.remove(id)
      set((s) => ({ referrals: s.referrals.filter(r => r.id !== id) }))
      return { success: true }
    } catch (err) {
      return { success: false, message: err?.response?.data?.message || 'Failed to delete contact' }
    }
  },

  linkApplication: async (referralId, applicationId, referredAt) => {
    try {
      await referralService.linkApplication(referralId, { applicationId, referredAt })
      // Refresh the single referral to get updated applications list
      const { data } = await referralService.getOne(referralId)
      set((s) => ({ referrals: s.referrals.map(r => r.id === referralId ? data.data : r) }))
      return { success: true }
    } catch (err) {
      return { success: false, message: err?.response?.data?.message || 'Failed to link application' }
    }
  },

  unlinkApplication: async (referralId, applicationId) => {
    try {
      await referralService.unlinkApplication(referralId, applicationId)
      set((s) => ({
        referrals: s.referrals.map(r =>
          r.id === referralId
            ? { ...r, applications: r.applications.filter(a => a.id !== applicationId) }
            : r
        )
      }))
      return { success: true }
    } catch (err) {
      return { success: false, message: err?.response?.data?.message || 'Failed to unlink application' }
    }
  },
}))

export default useReferralStore