// frontend/src/components/calendar/CalendarDayCell.jsx
import { cn } from "@/lib/utils";
import { STATUS_CHIP } from "@/lib/calendarUtils";

const MAX_CHIPS = 2;

export default function CalendarDayCell({
  cell,
  todayStr,
  selectedDay,
  eventMap,
  onSelect,
}) {
  const events = cell.date ? eventMap[cell.date] || [] : [];
  const isToday = cell.date === todayStr;
  const isSelected = cell.date === selectedDay;

  return (
    <div
      onClick={() =>
        cell.current &&
        cell.date &&
        onSelect(cell.date === selectedDay ? null : cell.date)
      }
      className={cn(
        "min-h-[56px] sm:min-h-[88px] p-1 sm:p-2 border-b border-r border-gray-50 dark:border-dark-s2 transition-colors",
        cell.current &&
          "cursor-pointer hover:bg-gray-50/70 dark:hover:bg-dark-s2",
        !cell.current && "bg-gray-50/30 dark:bg-dark-bg/30",
        isSelected &&
          "bg-[#eef2ff] dark:bg-dark-blue-tint ring-2 ring-inset ring-dark-accent/30",
      )}
    >
      {/* Day number */}
      <div className="flex items-center justify-end mb-1">
        <span
          className={cn(
            "w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full text-[11px] sm:text-xs font-semibold",
            isToday
              ? "bg-dark-accent text-white"
              : cell.current
                ? "text-gray-700 dark:text-dark-tx1"
                : "text-gray-300 dark:text-dark-border",
          )}
        >
          {cell.day}
        </span>
      </div>

      {/* Event chips — full chip w/ label on sm+, just colored dots on
          mobile since a ~40px-wide cell can't fit readable chip text;
          tapping the cell still surfaces full details in the day panel */}
      <div className="hidden sm:block space-y-0.5">
        {events.slice(0, MAX_CHIPS).map((ev, j) => {
          const chip = STATUS_CHIP[ev.eventType] || STATUS_CHIP.Applied;
          return (
            <div
              key={j}
              className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-md truncate flex items-center gap-1",
                chip.bg,
                chip.text,
              )}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: chip.dot }}
              />
              <span className="truncate">{ev.company}</span>
            </div>
          );
        })}
        {events.length > MAX_CHIPS && (
          <div className="text-[10px] text-gray-400 dark:text-dark-tx3 px-1.5">
            +{events.length - MAX_CHIPS} more
          </div>
        )}
      </div>

      {events.length > 0 && (
        <div className="sm:hidden flex flex-wrap justify-end gap-0.5">
          {events.slice(0, 4).map((ev, j) => {
            const chip = STATUS_CHIP[ev.eventType] || STATUS_CHIP.Applied;
            return (
              <span
                key={j}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: chip.dot }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}