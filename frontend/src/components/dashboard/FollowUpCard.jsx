import { useMemo } from 'react'
import { Bell } from 'lucide-react'
import CompanyAvatar from '@/components/common/CompanyAvatar'
import useAppStore from '@/store/appStore'

export default function FollowUpCard() {
  const applications = useAppStore((s) => s.applications)

  const followUps = useMemo(() => {
    const now = new Date()
    return applications
      .filter((a) => ['Applied', 'Assessment'].includes(a.status) && a.dateApplied)
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
    if (days >= 21) return { text: 'Overdue',       cls: 'bg-red-100 text-red-600 dark:bg-[#2a0f11] dark:text-red-400' }
    if (days >= 14) return { text: 'Follow up now', cls: 'bg-amber-100 text-amber-700 dark:bg-[#271e0a] dark:text-amber-400' }
    return              { text: `${days}d ago`,     cls: 'bg-blue-100 text-blue-700 dark:bg-[#0f1a35] dark:text-[#6b8ef5]' }
  }

  return (
    <div className="bg-white dark:bg-[#13161e] rounded-2xl p-6 border border-gray-100 dark:border-[#252a3a] shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-[#e8eaf2]">Upcoming Follow-Ups</h3>
        <Bell size={16} className="text-gray-400 dark:text-[#4e5470]" />
      </div>

      {followUps.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-[#4e5470] text-center py-6">
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
                    <p className="text-sm font-semibold text-gray-900 dark:text-[#e8eaf2] truncate">{f.company}</p>
                    <p className="text-xs text-gray-400 dark:text-[#4e5470] truncate">{f.role}</p>
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