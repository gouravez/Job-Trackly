// frontend/src/components/calendar/CalendarMonthStats.jsx
import { MONTHS } from '@/lib/calendarUtils'

const STATS_CONFIG = [
  { key: 'apps',       label: 'Applications sent', color: '#3b82f6' },
  { key: 'interviews', label: 'Interviews',         color: '#14b8a6' },
  { key: 'followUps',  label: 'Follow-ups due',     color: '#f59e0b' },
  { key: 'offers',     label: 'Offers',             color: '#10b981' },
]

export default function CalendarMonthStats({ year, month, applications, eventMap }) {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`

  const stats = {
    apps:       applications.filter((a) => a.dateApplied?.startsWith(prefix)).length,
    interviews: applications.filter((a) => a.status === 'Interview' && a.updatedAt?.startsWith(prefix)).length,
    followUps:  Object.keys(eventMap).filter((k) => k.startsWith(prefix) && eventMap[k].some((e) => e.eventType === 'FollowUp')).length,
    offers:     applications.filter((a) => a.status === 'Offer' && a.updatedAt?.startsWith(prefix)).length,
  }

  return (
    <div className="bg-white dark:bg-[#13161e] rounded-2xl border border-gray-100 dark:border-[#252a3a] shadow-sm p-5">
      <h3 className="font-bold text-gray-900 dark:text-[#e8eaf2] text-sm mb-3">
        {MONTHS[month]} activity
      </h3>
      <div className="space-y-2.5">
        {STATS_CONFIG.map(({ key, label, color }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-gray-500 dark:text-[#8b91a8]">{label}</span>
            </div>
            <span className="text-sm font-bold text-gray-800 dark:text-[#e8eaf2]">{stats[key]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}