import { create } from 'zustand'
import { calendarService } from '@/services/api'
import { buildEvents } from '@/lib/calendarUtils'

// ---------------------------------------------------------------------------
// Calendar Store
// Owns all calendar UI state:
//   - Month navigation (year, month)
//   - Selected day
//   - eventMap derived from applications
//   - Google Calendar connection status + sync results
// ---------------------------------------------------------------------------

const today = new Date()

const useCalendarStore = create((set, get) => ({
  // ── Month navigation ───────────────────────────────────────────────────────
  year:  today.getFullYear(),
  month: today.getMonth(),

  prevMonth: () => {
    const { year, month } = get()
    if (month === 0) set({ month: 11, year: year - 1 })
    else             set({ month: month - 1 })
  },
  nextMonth: () => {
    const { year, month } = get()
    if (month === 11) set({ month: 0, year: year + 1 })
    else              set({ month: month + 1 })
  },

  // ── Day selection ──────────────────────────────────────────────────────────
  selectedDay: null,
  selectDay: (date) => set({ selectedDay: date }),
  clearDay:  ()     => set({ selectedDay: null }),

  // ── Event map (derived from applications on demand) ────────────────────────
  // CalendarPage calls refreshEvents(applications) whenever appStore changes.
  eventMap: {},
  refreshEvents: (applications) => {
    set({ eventMap: buildEvents(applications) })
  },

  // ── Google Calendar ────────────────────────────────────────────────────────
  gcal: {
    loading:      true,
    connected:    false,
    syncedCount:  0,
    synced:       [],
  },
  syncResult:    null,
  connecting:    false,
  disconnecting: false,
  syncing:       false,

  // Load connection status from backend
  loadGcalStatus: async () => {
    set((s) => ({ gcal: { ...s.gcal, loading: true } }))
    try {
      const { data } = await calendarService.getStatus()
      set({ gcal: { loading: false, ...data.data } })
    } catch {
      set((s) => ({ gcal: { ...s.gcal, loading: false, connected: false } }))
    }
  },

  // Redirect to Google OAuth
  connectGcal: async () => {
    set({ connecting: true })
    try {
      const { data } = await calendarService.getAuthUrl()
      window.location.href = data.data.url
    } catch {
      set({ connecting: false })
    }
  },

  // Disconnect Google Calendar
  disconnectGcal: async () => {
    set({ disconnecting: true })
    try {
      await calendarService.disconnect()
      set({
        gcal:       { loading: false, connected: false, syncedCount: 0, synced: [] },
        syncResult: null,
      })
    } catch { /* ignore */ }
    finally { set({ disconnecting: false }) }
  },

  // Sync all events
  syncAllGcal: async () => {
    set({ syncing: true, syncResult: null })
    try {
      const { data } = await calendarService.syncAll()
      set({ syncResult: data.data })
      // Refresh count after sync
      get().loadGcalStatus()
    } catch (err) {
      set({ syncResult: { error: err?.response?.data?.message || 'Sync failed' } })
    } finally {
      set({ syncing: false })
    }
  },

  // Called by AuthCallbackPage / CalendarPage to handle ?gcal= URL param
  handleGcalParam: (param) => {
    if (param === 'connected' || param === 'error') {
      get().loadGcalStatus()
      window.history.replaceState({}, '', window.location.pathname)
    }
  },
}))

export default useCalendarStore