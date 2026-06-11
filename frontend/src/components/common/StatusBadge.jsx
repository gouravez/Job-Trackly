import { STATUS_COLORS } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const DARK_COLORS = {
  Saved:      'dark:bg-[#1a1e2a] dark:text-[#8b91a8]',
  Applied:    'dark:bg-[#0f1a35] dark:text-[#6b8ef5]',
  Assessment: 'dark:bg-[#1a1030] dark:text-purple-400',
  Interview:  'dark:bg-[#0a2020] dark:text-teal-400',
  Offer:      'dark:bg-[#0a2015] dark:text-emerald-400',
  Rejected:   'dark:bg-[#2a0f11] dark:text-red-400',
}

export default function StatusBadge({ status, size = 'md' }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS['Saved']
  const d = DARK_COLORS[status]   || DARK_COLORS['Saved']
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium',
      c.bg, c.text, d,
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
    )}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
      {status}
    </span>
  )
}