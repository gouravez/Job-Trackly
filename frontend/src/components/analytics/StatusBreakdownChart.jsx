import { PieChart, Pie, Cell } from 'recharts'

const STATUS_PIE = [
  { name: 'Saved',      value: 24, pct: '14%', color: '#9ca3af' },
  { name: 'Applied',    value: 84, pct: '48%', color: '#3b82f6' },
  { name: 'Assessment', value: 18, pct: '10%', color: '#f59e0b' },
  { name: 'Interview',  value: 12, pct: '7%',  color: '#14b8a6' },
  { name: 'Offer',      value: 3,  pct: '2%',  color: '#22c55e' },
  { name: 'Rejected',   value: 30, pct: '17%', color: '#ef4444' },
]

function Legend() {
  return (
    <div className="space-y-1.5">
      {STATUS_PIE.map((s) => (
        <div key={s.name} className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-gray-600">{s.name}</span>
          </div>
          <span className="text-gray-400 font-medium ml-4">{s.value} · {s.pct}</span>
        </div>
      ))}
    </div>
  )
}

export default function StatusBreakdownChart() {
  return (
    <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-bold text-gray-900 mb-4">Status Breakdown</h3>
      <div className="flex items-center gap-4">
        <PieChart width={140} height={140}>
          <Pie
            data={STATUS_PIE} cx={65} cy={65}
            innerRadius={42} outerRadius={65}
            paddingAngle={2} dataKey="value" strokeWidth={0}
          >
            {STATUS_PIE.map((s) => <Cell key={s.name} fill={s.color} />)}
          </Pie>
        </PieChart>
        <Legend />
      </div>
    </div>
  )
}