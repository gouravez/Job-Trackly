// frontend/src/components/calendar/CalendarDayCell.jsx
import { cn } from '@/lib/utils'
import { STATUS_CHIP } from '@/lib/calendarUtils'

const MAX_CHIPS = 2

export default function CalendarDayCell({ cell, todayStr, selectedDay, eventMap, onSelect }) {
  const events     = cell.date ? (eventMap[cell.date] || []) : []
  const isToday    = cell.date === todayStr
  const isSelected = cell.date === selectedDay

  return (
    <div
      onClick={() => cell.current && cell.date && onSelect(cell.date === selectedDay ? null : cell.date)}
      className={cn(
        'min-h-[88px] p-2 border-b border-r border-gray-50 dark:border-[#1a1e2a] transition-colors',
        cell.current  && 'cursor-pointer hover:bg-gray-50/70 dark:hover:bg-[#1a1e2a]',
        !cell.current && 'bg-gray-50/30 dark:bg-[#0d0f14]/30',
        isSelected    && 'bg-[#eef2ff] dark:bg-[#0f1a35] ring-2 ring-inset ring-[#2f54c8]/30',
      )}
    >
      {/* Day number */}
      <div className="flex items-center justify-end mb-1">
        <span className={cn(
          'w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold',
          isToday
            ? 'bg-[#2f54c8] text-white'
            : cell.current
              ? 'text-gray-700 dark:text-[#e8eaf2]'
              : 'text-gray-300 dark:text-[#252a3a]',
        )}>
          {cell.day}
        </span>
      </div>

      {/* Event chips */}
      <div className="space-y-0.5">
        {events.slice(0, MAX_CHIPS).map((ev, j) => {
          const chip = STATUS_CHIP[ev.eventType] || STATUS_CHIP.Applied
          return (
            <div key={j} className={cn(
              'text-[10px] font-semibold px-1.5 py-0.5 rounded-md truncate flex items-center gap-1',
              chip.bg, chip.text,
            )}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: chip.dot }} />
              <span className="truncate">{ev.company}</span>
            </div>
          )
        })}
        {events.length > MAX_CHIPS && (
          <div className="text-[10px] text-gray-400 dark:text-[#4e5470] px-1.5">
            +{events.length - MAX_CHIPS} more
          </div>
        )}
      </div>
    </div>
  )
}