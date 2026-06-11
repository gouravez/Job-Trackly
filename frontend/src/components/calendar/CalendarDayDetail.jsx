// frontend/src/components/calendar/CalendarDayDetail.jsx
import { useState } from 'react'
import { Loader2, CalendarDays } from 'lucide-react'
import CompanyAvatar from '@/components/common/CompanyAvatar'
import { STATUS_CHIP } from '@/lib/calendarUtils'
import { calendarService } from '@/services/api'
import { cn } from '@/lib/utils'

export default function CalendarDayDetail({ selectedDay, events }) {
  const [pushing, setPushing] = useState(null)     // `${id}-${eventType}`
  const [results, setResults] = useState({})       // key → 'ok' | 'err'

  if (!selectedDay) return null

  const handlePush = async (ev) => {
    const key = `${ev.id}-${ev.eventType}`
    setPushing(key)
    try {
      await calendarService.pushEvent({
        applicationId: ev.id,
        eventType:     ev.eventType,
        date:          selectedDay,
      })
      setResults((r) => ({ ...r, [key]: 'ok' }))
    } catch {
      setResults((r) => ({ ...r, [key]: 'err' }))
    } finally {
      setPushing(null)
      setTimeout(() => setResults((r) => { const c = { ...r }; delete c[key]; return c }), 3000)
    }
  }

  const dateLabel = new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
  })

  return (
    <div className="bg-white dark:bg-[#13161e] rounded-2xl border border-gray-100 dark:border-[#252a3a] shadow-sm p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-[#e8eaf2] text-sm">{dateLabel}</h3>
        <span className="text-xs text-gray-400 dark:text-[#4e5470]">
          {events.length} event{events.length !== 1 ? 's' : ''}
        </span>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-[#4e5470] text-center py-4">
          No events on this day
        </p>
      ) : (
        <div className="space-y-4">
          {events.map((ev, i) => {
            const chip = STATUS_CHIP[ev.eventType] || STATUS_CHIP.Applied
            const key  = `${ev.id}-${ev.eventType}`
            const res  = results[key]

            return (
              <div key={i} className="flex items-start gap-3">
                <CompanyAvatar name={ev.company} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-[#e8eaf2] truncate">{ev.company}</p>
                  <p className="text-xs text-gray-400 dark:text-[#4e5470] truncate">{ev.role}</p>

                  {/* Status badge */}
                  <span className={cn(
                    'inline-flex items-center gap-1 text-xs font-semibold mt-1 px-2 py-0.5 rounded-full',
                    chip.bg, chip.text,
                  )}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: chip.dot }} />
                    {ev.label}
                  </span>

                  {/* Push to Google Calendar */}
                  <button
                    onClick={() => handlePush(ev)}
                    disabled={pushing === key}
                    className={cn(
                      'mt-1.5 flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all',
                      res === 'ok'
                        ? 'bg-emerald-50 dark:bg-[#0a2015] border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400'
                        : res === 'err'
                          ? 'bg-red-50 dark:bg-[#2a0f11] border-red-200 dark:border-red-900 text-red-500 dark:text-red-400'
                          : 'bg-white dark:bg-[#1a1e2a] border-gray-200 dark:border-[#252a3a] text-gray-500 dark:text-[#8b91a8] hover:border-[#2f54c8] hover:text-[#2f54c8] dark:hover:text-[#6b8ef5] dark:hover:border-[#2f54c8]',
                    )}
                  >
                    {pushing === key
                      ? <Loader2 size={10} className="animate-spin" />
                      : <CalendarDays size={10} />}
                    {res === 'ok'
                      ? 'Added to Google Calendar ✓'
                      : res === 'err'
                        ? 'Failed — check connection'
                        : 'Add to Google Calendar'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}