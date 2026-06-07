import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const TOP_COMPANIES = [
  { name: 'Google', value: 12 },
  { name: 'Meta',   value: 8  },
  { name: 'Stripe', value: 7  },
  { name: 'Netflix',value: 5  },
]

export default function TopCompaniesChart() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-bold text-gray-900 mb-5">Top Companies Applied To</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={TOP_COMPANIES} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} width={50} />
          <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
          <Bar dataKey="value" fill="#2f54c8" radius={[0, 4, 4, 0]}>
            {TOP_COMPANIES.map((_, i) => (
              <Cell key={i} fill="#2f54c8" opacity={1 - i * 0.15} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}