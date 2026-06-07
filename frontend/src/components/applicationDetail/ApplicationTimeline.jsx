import { Bookmark, Send, ClipboardList, Users, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

const TIMELINE = [
  { key: 'Saved',      icon: Bookmark,      date: 'Apr 24', note: 'Bookmarked from the company careers page.',      color: 'bg-gray-200',   iconColor: 'text-gray-500' },
  { key: 'Applied',    icon: Send,          date: 'May 1',  note: 'Submitted resume and cover letter online.',       color: 'bg-blue-500',   iconColor: 'text-white'    },
  { key: 'Assessment', icon: ClipboardList, date: 'May 8',  note: 'Completed online coding assessment.',             color: 'bg-purple-500', iconColor: 'text-white'    },
  { key: 'Interview',  icon: Users,         date: 'May 15', note: 'Technical interview scheduled with the team.', current: true, color: 'bg-teal-500', iconColor: 'text-white' },
  { key: 'Offer',      icon: Award,         date: null,     note: 'Awaiting final decision.',                        color: 'bg-gray-200',   iconColor: 'text-gray-400', pending: true },
]

const STATUS_ORDER = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected']

export default function ApplicationTimeline({ currentStatus }) {
  const statusIdx = STATUS_ORDER.indexOf(currentStatus)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-bold text-gray-900 mb-6">Application Timeline</h3>
      <div className="space-y-6">
        {TIMELINE.map((step, i) => {
          const reached = STATUS_ORDER.indexOf(step.key) <= statusIdx
          return (
            <div key={step.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
                  reached && !step.pending ? step.color : 'bg-gray-100'
                )}>
                  <step.icon size={16} className={reached && !step.pending ? step.iconColor : 'text-gray-400'} />
                </div>
                {i < TIMELINE.length - 1 && (
                  <div
                    className={cn('w-px flex-1 mt-2', reached && !step.pending ? 'bg-gray-300' : 'bg-gray-100')}
                    style={{ minHeight: 20 }}
                  />
                )}
              </div>
              <div className="pb-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn('font-semibold text-sm', reached && !step.pending ? 'text-gray-900' : 'text-gray-400')}>
                    {step.key}
                  </span>
                  {step.date && <span className="text-xs text-gray-400">{step.date}</span>}
                  {step.current && (
                    <span className="text-xs border border-gray-300 text-gray-500 rounded-full px-2 py-0.5">Current</span>
                  )}
                  {step.pending && <span className="text-xs text-gray-400">{step.date || 'Pending'}</span>}
                </div>
                <p className={cn('text-sm mt-0.5', reached && !step.pending ? 'text-gray-500' : 'text-gray-300')}>
                  {step.note}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}