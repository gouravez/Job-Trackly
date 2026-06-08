import { useMemo } from 'react'
import { PieChart, Pie, Cell } from 'recharts'
import useAppStore from '@/store/appStore'

const STATUS_COLORS = {
  Saved:      '#9ca3af',
  Applied:    '#3b82f6',
  Assessment: '#f59e0b',
  Interview:  '#14b8a6',
  Offer:      '#22c55e',
  Rejected:   '#ef4444',
}

function Legend({ data, total }) {
  return (
    <div className="space-y-1.5">
      {data.map((s) => (
        <div key={s.name} className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-gray-600 dark:text-gray-400">{s.name}</span>
          </div>
          <span className="text-gray-400 font-medium ml-4">
            {s.value} · {total > 0 ? `${Math.round((s.value / total) * 100)}%` : '0%'}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function StatusBreakdownChart() {
  const applications = useAppStore((s) => s.applications)

  const { pieData, total } = useMemo(() => {
    const counts = {}
    for (const app of applications) {
      counts[app.status] = (counts[app.status] || 0) + 1
    }
    const pieData = Object.entries(STATUS_COLORS)
      .map(([name, color]) => ({ name, value: counts[name] || 0, color }))
      .filter((s) => s.value > 0)
    return { pieData, total: applications.length }
  }, [applications])

  return (
    <div className="col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Status Breakdown</h3>
      {total === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">No applications yet</p>
      ) : (
        <div className="flex items-center gap-4">
          <PieChart width={140} height={140}>
            <Pie data={pieData} cx={65} cy={65} innerRadius={42} outerRadius={65} paddingAngle={2} dataKey="value" strokeWidth={0}>
              {pieData.map((s) => <Cell key={s.name} fill={s.color} />)}
            </Pie>
          </PieChart>
          <Legend data={pieData} total={total} />
        </div>
      )}
    </div>
  )
}