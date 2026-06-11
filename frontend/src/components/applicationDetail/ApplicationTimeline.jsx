import { Bookmark, Send, ClipboardList, Users, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

const TIMELINE = [
  { key: 'Saved',      icon: Bookmark,      color: 'bg-gray-400',   iconColor: 'text-white'    },
  { key: 'Applied',    icon: Send,          color: 'bg-blue-500',   iconColor: 'text-white'    },
  { key: 'Assessment', icon: ClipboardList, color: 'bg-purple-500', iconColor: 'text-white'    },
  { key: 'Interview',  icon: Users,         color: 'bg-teal-500',   iconColor: 'text-white'    },
  { key: 'Offer',      icon: Award,         color: 'bg-green-500',  iconColor: 'text-white'    },
]

const STATUS_ORDER = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected']

const STATUS_NOTES = {
  Saved:      'Bookmarked from the company careers page.',
  Applied:    'Submitted resume and cover letter online.',
  Assessment: 'Completed online coding assessment.',
  Interview:  'Technical interview scheduled with the team.',
  Offer:      'Awaiting final decision.',
}

export default function ApplicationTimeline({ currentStatus }) {
  const statusIdx = STATUS_ORDER.indexOf(currentStatus)

  return (
    <div className="bg-white dark:bg-[#13161e] rounded-2xl border border-gray-100 dark:border-[#252a3a] shadow-sm dark:shadow-none p-6">
      <h3 className="font-bold text-gray-900 dark:text-[#e8eaf2] mb-6">Application Timeline</h3>
      <div className="space-y-6">
        {TIMELINE.map((step, i) => {
          const reached  = STATUS_ORDER.indexOf(step.key) <= statusIdx
          const isCurrent = step.key === currentStatus
          const isPending = STATUS_ORDER.indexOf(step.key) > statusIdx

          return (
            <div key={step.key} className="flex gap-4">
              {/* Icon + connector */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
                  reached ? step.color : 'bg-gray-100 dark:bg-[#1a1e2a]'
                )}>
                  <step.icon
                    size={16}
                    className={reached ? step.iconColor : 'text-gray-400 dark:text-[#4e5470]'}
                  />
                </div>
                {i < TIMELINE.length - 1 && (
                  <div
                    className={cn(
                      'w-px flex-1 mt-2',
                      reached ? 'bg-gray-300 dark:bg-[#252a3a]' : 'bg-gray-100 dark:bg-[#1a1e2a]'
                    )}
                    style={{ minHeight: 20 }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    'font-semibold text-sm',
                    reached
                      ? 'text-gray-900 dark:text-[#e8eaf2]'
                      : 'text-gray-400 dark:text-[#4e5470]'
                  )}>
                    {step.key}
                  </span>

                  {isCurrent && (
                    <span className="text-xs border border-gray-300 dark:border-[#252a3a] text-gray-500 dark:text-[#8b91a8] rounded-full px-2 py-0.5">
                      Current
                    </span>
                  )}

                  {isPending && (
                    <span className="text-xs text-gray-400 dark:text-[#4e5470]">Pending</span>
                  )}
                </div>

                <p className={cn(
                  'text-sm mt-0.5',
                  reached
                    ? 'text-gray-500 dark:text-[#8b91a8]'
                    : 'text-gray-300 dark:text-[#252a3a]'
                )}>
                  {STATUS_NOTES[step.key]}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}