import { STATUS_COLORS } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const DARK_COLORS = {
  Saved:      'dark:bg-gray-800 dark:text-gray-300',
  Applied:    'dark:bg-blue-900/40 dark:text-blue-300',
  Assessment: 'dark:bg-purple-900/40 dark:text-purple-300',
  Interview:  'dark:bg-teal-900/40 dark:text-teal-300',
  Offer:      'dark:bg-green-900/40 dark:text-green-300',
  Rejected:   'dark:bg-red-900/40 dark:text-red-300',
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