import { useMemo } from 'react'
import { Bell } from 'lucide-react'
import CompanyAvatar from '@/components/common/CompanyAvatar'
import useAppStore from '@/store/appStore'

export default function FollowUpCard() {
  const applications = useAppStore((s) => s.applications)

  const followUps = useMemo(() => {
    const now = new Date()
    return applications
      .filter((a) => a.status === 'Applied' && a.dateApplied)
      .map((a) => {
        const applied  = new Date(a.dateApplied)
        const diffDays = Math.floor((now - applied) / (1000 * 60 * 60 * 24))
        return { ...a, diffDays }
      })
      .filter((a) => a.diffDays >= 7)
      .sort((a, b) => b.diffDays - a.diffDays)
      .slice(0, 5)
  }, [applications])

  const dueLabel = (days) => {
    if (days >= 21) return { text: 'Overdue',         cls: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300' }
    if (days >= 14) return { text: 'Follow up now',   cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' }
    return              { text: `${days}d ago`,        cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white">Upcoming Follow-Ups</h3>
        <Bell size={16} className="text-gray-400 dark:text-gray-500" />
      </div>

      {followUps.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          No follow-ups needed right now 🎉
        </p>
      ) : (
        <div className="space-y-3">
          {followUps.map((f) => {
            const { text, cls } = dueLabel(f.diffDays)
            return (
              <div key={f.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CompanyAvatar name={f.company} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{f.company}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{f.role}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${cls}`}>
                  {text}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}