// frontend/src/components/calendar/CalendarUpcoming.jsx
import { CalendarDays } from "lucide-react";
import { STATUS_CHIP } from "@/lib/calendarUtils";
import { cn } from "@/lib/utils";

export default function CalendarUpcoming({ upcoming, todayStr, onSelectDay }) {
  return (
    <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays
          size={15}
          className="text-dark-accent dark:text-dark-accent3"
        />
        <h3 className="font-bold text-gray-900 dark:text-dark-tx1 text-sm">
          Next 14 days
        </h3>
      </div>

      {upcoming.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-dark-tx3 text-center py-4">
          No upcoming events
        </p>
      ) : (
        <div className="space-y-3">
          {upcoming.map((ev, i) => {
            const chip = STATUS_CHIP[ev.eventType] || STATUS_CHIP.Applied;
            const evDate = new Date(ev.date + "T00:00:00");
            const isEvToday = ev.date === todayStr;

            return (
              <div
                key={i}
                onClick={() => onSelectDay(ev.date)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                {/* Date badge */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0",
                    isEvToday
                      ? "bg-dark-accent"
                      : "bg-gray-50 dark:bg-dark-s2 group-hover:bg-gray-100 dark:group-hover:bg-dark-s3",
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] font-semibold leading-none",
                      isEvToday
                        ? "text-blue-200"
                        : "text-gray-400 dark:text-dark-tx3",
                    )}
                  >
                    {evDate
                      .toLocaleDateString("en-US", { month: "short" })
                      .toUpperCase()}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-bold leading-none mt-0.5",
                      isEvToday
                        ? "text-white"
                        : "text-gray-800 dark:text-dark-tx1",
                    )}
                  >
                    {evDate.getDate()}
                  </span>
                </div>

                {/* Event info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-dark-tx1 truncate group-hover:text-dark-accent dark:group-hover:text-dark-accent3 transition-colors">
                    {ev.company}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: chip.dot }}
                    />
                    <span className={cn("text-xs", chip.text)}>{ev.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
