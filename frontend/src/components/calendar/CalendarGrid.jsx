// frontend/src/components/calendar/CalendarGrid.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DAYS, MONTHS, buildCells } from '@/lib/calendarUtils'
import CalendarDayCell from './CalendarDayCell'

export default function CalendarGrid({
  year, month, todayStr, selectedDay, eventMap,
  onPrevMonth, onNextMonth, onSelectDay,
}) {
  const cells = buildCells(year, month)

  return (
    <div className="xl:col-span-3 bg-white dark:bg-[#13161e] rounded-2xl border border-gray-100 dark:border-[#252a3a] shadow-sm overflow-hidden">

      {/* Month navigation */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 dark:border-[#1f2436]">
        <button
          onClick={onPrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1e2a] text-gray-500 dark:text-[#8b91a8] transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <h2 className="font-bold text-gray-900 dark:text-[#e8eaf2] text-lg">
          {MONTHS[month]} {year}
        </h2>

        <button
          onClick={onNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1e2a] text-gray-500 dark:text-[#8b91a8] transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day-name headers */}
      <div className="grid grid-cols-7 border-b border-gray-50 dark:border-[#1f2436]">
        {DAYS.map((d) => (
          <div key={d} className="px-2 py-2.5 text-center text-xs font-semibold text-gray-400 dark:text-[#4e5470] uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => (
          <CalendarDayCell
            key={i}
            cell={cell}
            todayStr={todayStr}
            selectedDay={selectedDay}
            eventMap={eventMap}
            onSelect={onSelectDay}
          />
        ))}
      </div>
    </div>
  )
}