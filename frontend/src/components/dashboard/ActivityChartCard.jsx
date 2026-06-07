import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ACTIVITY_DATA } from '@/lib/mockData'

export default function ActivityChartCard() {
  return (
    <div className="col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="font-bold text-gray-900">Application Activity</h3>
          <p className="text-xs text-gray-400">Applications submitted over time</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-[#2f54c8]" />
          Applications
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={ACTIVITY_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#2f54c8" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#2f54c8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
          <Area type="monotone" dataKey="apps" stroke="#2f54c8" strokeWidth={2.5} fill="url(#areaGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}