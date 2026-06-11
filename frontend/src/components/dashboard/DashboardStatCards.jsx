import { useMemo } from 'react'
import { TrendingUp, Calendar, Star, X } from 'lucide-react'
import useAppStore from '@/store/appStore'

// Returns "this month" and "last month" as YYYY-MM strings
function getMonthKeys() {
  const now  = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonth = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`

  return { thisMonth, lastMonth }
}

// Format a month-over-month delta into a readable string
function formatDelta(current, previous) {
  if (previous === 0 && current === 0) return 'No data yet'
  if (previous === 0) return `+${current} this month`

  const diff    = current - previous
  const pct     = Math.round(Math.abs((diff / previous) * 100))
  const sign    = diff >= 0 ? '+' : '-'
  const arrow   = diff >= 0 ? '↑' : '↓'

  if (diff === 0) return 'Same as last month'
  return `${arrow} ${sign}${pct}% vs last month`
}

export default function DashboardStatCards() {
  const applications = useAppStore((s) => s.applications)

  const stats = useMemo(() => {
    const { thisMonth, lastMonth } = getMonthKeys()

    // Partition apps by when they were applied / created
    const getMonthKey = (app) => {
      const raw = app.dateApplied || app.createdAt
      if (!raw) return null
      return String(raw).slice(0, 7) // "YYYY-MM"
    }

    const thisMonthApps = applications.filter((a) => getMonthKey(a) === thisMonth)
    const lastMonthApps = applications.filter((a) => getMonthKey(a) === lastMonth)

    const count = (arr, statusFn) => arr.filter(statusFn).length

    const isInterview = (a) => a.status === 'Interview'
    const isOffer     = (a) => a.status === 'Offer'
    const isRejected  = (a) => a.status === 'Rejected'
    const isAny       = ()  => true

    return [
      {
        label:     'Total Applications',
        value:     applications.length,
        sub:       formatDelta(count(thisMonthApps, isAny), count(lastMonthApps, isAny)),
        positive:  count(thisMonthApps, isAny) >= count(lastMonthApps, isAny),
        icon:      TrendingUp,
        iconBg:    'bg-blue-50 dark:bg-[#0f1a35]',
        iconColor: 'text-blue-500 dark:text-[#6b8ef5]',
      },
      {
        label:     'Interviews',
        value:     count(applications, isInterview),
        sub:       formatDelta(count(thisMonthApps, isInterview), count(lastMonthApps, isInterview)),
        positive:  count(thisMonthApps, isInterview) >= count(lastMonthApps, isInterview),
        icon:      Calendar,
        iconBg:    'bg-green-50 dark:bg-[#0f2318]',
        iconColor: 'text-green-500 dark:text-emerald-400',
      },
      {
        label:     'Offers',
        value:     count(applications, isOffer),
        sub:       formatDelta(count(thisMonthApps, isOffer), count(lastMonthApps, isOffer)),
        positive:  count(thisMonthApps, isOffer) >= count(lastMonthApps, isOffer),
        icon:      Star,
        iconBg:    'bg-amber-50 dark:bg-[#271e0a]',
        iconColor: 'text-amber-500 dark:text-amber-400',
      },
      {
        label:     'Rejections',
        value:     count(applications, isRejected),
        // For rejections — fewer is better, so flip the positive logic
        sub:       formatDelta(count(thisMonthApps, isRejected), count(lastMonthApps, isRejected)),
        positive:  count(thisMonthApps, isRejected) <= count(lastMonthApps, isRejected),
        icon:      X,
        iconBg:    'bg-red-50 dark:bg-[#2a0f11]',
        iconColor: 'text-red-400 dark:text-red-400',
      },
    ]
  }, [applications])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label}
          className="bg-white dark:bg-[#13161e] rounded-2xl p-5 border border-gray-100 dark:border-[#252a3a] shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500 dark:text-[#8b91a8]">{s.label}</p>
            <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center`}>
              <s.icon size={18} className={s.iconColor} />
            </div>
          </div>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-[#e8eaf2]">{s.value}</p>
          <p className={`text-xs mt-1 ${
            s.sub === 'No data yet' || s.sub === 'Same as last month'
              ? 'text-gray-400 dark:text-[#4e5470]'
              : s.positive
                ? 'text-green-500 dark:text-emerald-400'
                : 'text-red-400'
          }`}>
            {s.sub}
          </p>
        </div>
      ))}
    </div>
  )
}