import { Bell } from 'lucide-react'
import CompanyAvatar from '@/components/common/CompanyAvatar'

const FOLLOW_UPS = [
  { company: 'Stripe', role: 'Frontend Engineer', due: 'Due Tomorrow',  dueColor: 'bg-amber-100 text-amber-700' },
  { company: 'Notion', role: 'Product Designer',  due: 'Due in 3 days', dueColor: 'bg-blue-100 text-blue-700'  },
  { company: 'Linear', role: 'Software Engineer', due: 'Due in 5 days', dueColor: 'bg-blue-100 text-blue-700'  },
  { company: 'Figma',  role: 'UX Researcher',     due: 'Due Tomorrow',  dueColor: 'bg-amber-100 text-amber-700' },
]

export default function FollowUpCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Upcoming Follow-Ups</h3>
        <Bell size={16} className="text-gray-400" />
      </div>

      <div className="space-y-3">
        {FOLLOW_UPS.map((f) => (
          <div key={f.company} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <CompanyAvatar name={f.company} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{f.company}</p>
                <p className="text-xs text-gray-400 truncate">{f.role}</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${f.dueColor}`}>
              {f.due}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}