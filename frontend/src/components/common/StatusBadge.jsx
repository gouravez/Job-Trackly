import { STATUS_COLORS } from '@/lib/mockData'
import { cn } from '@/lib/utils'

export default function StatusBadge({ status, size = 'md' }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS['Saved']
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full font-medium',
      c.bg, c.text,
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
    )}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
      {status}
    </span>
  )
}