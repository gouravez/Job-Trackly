import { useEffect } from 'react'
import {
  Loader2, CalendarDays, CheckCircle2, XCircle,
  RefreshCw, Unlink, ExternalLink,
} from 'lucide-react'
import useCalendarStore from '@/store/calendarStore'
import { cn } from '@/lib/utils'

export default function GoogleCalendarCard() {
  const {
    gcal,
    syncResult,
    connecting, disconnecting, syncing,
    loadGcalStatus,
    connectGcal,
    disconnectGcal,
    syncAllGcal,
  } = useCalendarStore()

  useEffect(() => {
    loadGcalStatus()
  }, [])

  if (gcal.loading) {
    return (
      <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border h-44 animate-pulse" />
    )
  }

  return (
    <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm p-5 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-dark-s2 border border-gray-200 dark:border-dark-border flex items-center justify-center flex-shrink-0">
            <CalendarDays size={18} className="text-dark-accent dark:text-dark-accent3" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-dark-tx1">Google Calendar</p>
            <p className="text-xs text-gray-400 dark:text-dark-tx2 mt-0.5">
              {gcal.connected
                ? `${gcal.syncedCount} event${gcal.syncedCount !== 1 ? 's' : ''} synced`
                : 'Push job events to your Google Calendar'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {gcal.connected ? (
            <>
              <CheckCircle2 size={15} className="text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Active</span>
            </>
          ) : (
            <>
              <XCircle size={15} className="text-gray-400" />
              <span className="text-xs text-gray-400">Off</span>
            </>
          )}
        </div>
      </div>

      {/* Event type legend */}
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { color: '#3b82f6', label: 'Application submitted' },
          { color: '#f59e0b', label: 'Follow-up (7 days)'    },
          { color: '#14b8a6', label: 'Interview scheduled'   },
          { color: '#10b981', label: 'Offer received 🎉'     },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-dark-tx2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Sync result feedback */}
      {syncResult && (
        <div className={cn(
          'text-xs px-3 py-2 rounded-xl border',
          syncResult.error
            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
            : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
        )}>
          {syncResult.error
            ? `❌ ${syncResult.error}`
            : `✅ ${syncResult.pushed} new event${syncResult.pushed !== 1 ? 's' : ''} pushed — ${syncResult.skipped} already synced${syncResult.failed ? `, ${syncResult.failed} failed` : ''}`}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {!gcal.connected ? (
          <button
            onClick={connectGcal}
            disabled={connecting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-accent text-white text-sm font-semibold hover:bg-dark-accent-dim disabled:opacity-60 transition-colors"
          >
            {connecting ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
            {connecting ? 'Redirecting…' : 'Connect Google Calendar'}
          </button>
        ) : (
          <>
            <button
              onClick={syncAllGcal}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-accent text-white text-sm font-semibold hover:bg-dark-accent-dim disabled:opacity-60 transition-colors"
            >
              <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Syncing…' : 'Sync All Events'}
            </button>
            <button
              onClick={disconnectGcal}
              disabled={disconnecting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-dark-border text-sm font-medium text-gray-600 dark:text-dark-tx2 hover:bg-gray-50 dark:hover:bg-dark-s2 disabled:opacity-60 transition-colors"
            >
              {disconnecting ? <Loader2 size={14} className="animate-spin" /> : <Unlink size={14} />}
              {disconnecting ? 'Disconnecting…' : 'Disconnect'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}