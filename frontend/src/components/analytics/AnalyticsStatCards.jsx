import { TrendingUp, Star, CornerUpLeft } from 'lucide-react'

const STAT_CARDS = [
  { label: 'Interview Rate', value: '14.3%', delta: '+2.1%', icon: TrendingUp,   iconBg: 'bg-green-50', iconColor: 'text-green-500', lineColor: '#22c55e' },
  { label: 'Offer Rate',     value: '3.6%',  delta: '+0.4%', icon: Star,         iconBg: 'bg-amber-50', iconColor: 'text-amber-500', lineColor: '#f59e0b' },
  { label: 'Response Rate',  value: '28.5%', delta: '+5.2%', icon: CornerUpLeft, iconBg: 'bg-blue-50',  iconColor: 'text-blue-500',  lineColor: '#3b82f6' },
]

function Sparkline({ color }) {
  const points = '0,30 20,25 40,28 60,20 80,22 100,15 120,18'
  return (
    <svg viewBox="0 0 120 40" className="w-full h-10 mt-3">
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0"   />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  )
}

export default function AnalyticsStatCards() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {STAT_CARDS.map((s) => (
        <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{s.label}</span>
            <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
              <s.icon size={15} className={s.iconColor} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">{s.value}</span>
            <span className="text-xs text-green-500 font-semibold">up {s.delta}</span>
          </div>
          <Sparkline color={s.lineColor} />
        </div>
      ))}
    </div>
  )
}