import { TrendingUp, Calendar, Star, X } from 'lucide-react'

const STATS = [
  { label: 'Total Applications', value: 84, sub: '+12% this month', icon: TrendingUp, iconBg: 'bg-blue-50',  iconColor: 'text-blue-500'  },
  { label: 'Interviews',         value: 12, sub: '+4% this month',  icon: Calendar,   iconBg: 'bg-green-50', iconColor: 'text-green-500' },
  { label: 'Offers',             value: 3,  sub: '+1 this month',   icon: Star,       iconBg: 'bg-amber-50', iconColor: 'text-amber-500' },
  { label: 'Rejections',         value: 21, sub: '+8% this month',  icon: X,          iconBg: 'bg-red-50',   iconColor: 'text-red-400'   },
]

export default function DashboardStatCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {STATS.map((s) => (
        <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">{s.label}</p>
            <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center`}>
              <s.icon size={18} className={s.iconColor} />
            </div>
          </div>
          <p className="text-4xl font-extrabold text-gray-900">{s.value}</p>
          <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
        </div>
      ))}
    </div>
  )
}