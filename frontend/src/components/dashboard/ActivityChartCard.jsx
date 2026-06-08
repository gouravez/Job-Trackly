import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import useAppStore from '@/store/appStore'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function ActivityChartCard() {
  const applications = useAppStore((s) => s.applications)

  // Build last-6-months buckets from real dateApplied values
  const chartData = useMemo(() => {
    const now   = new Date()
    const data  = []

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      data.push({ month: MONTHS[d.getMonth()], year: d.getFullYear(), apps: 0 })
    }

    for (const app of applications) {
      const date = app.dateApplied ? new Date(app.dateApplied) : new Date(app.createdAt)
      if (!date || isNaN(date)) continue
      const bucket = data.find(
        (b) => b.month === MONTHS[date.getMonth()] && b.year === date.getFullYear()
      )
      if (bucket) bucket.apps++
    }

    return data
  }, [applications])

  return (
    <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Application Activity</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">Applications submitted over time</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span className="w-2 h-2 rounded-full bg-[#2f54c8]" /> Applications
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#2f54c8" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#2f54c8" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.15)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              borderRadius: 8, border: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              backgroundColor: 'var(--tooltip-bg, #fff)',
              color: 'var(--tooltip-color, #111)',
            }}
          />
          <Area type="monotone" dataKey="apps" stroke="#2f54c8" strokeWidth={2.5} fill="url(#areaGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}