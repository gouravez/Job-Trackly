// frontend/src/components/calendar/CalendarDayDetail.jsx
import { useState } from "react";
import { Loader2, CalendarDays } from "lucide-react";
import CompanyAvatar from "@/components/common/CompanyAvatar";
import { STATUS_CHIP } from "@/lib/calendarUtils";
import { calendarService } from "@/services/api";
import { cn } from "@/lib/utils";

export default function CalendarDayDetail({ selectedDay, events }) {
  const [pushing, setPushing] = useState(null); // `${id}-${eventType}`
  const [results, setResults] = useState({}); // key → 'ok' | 'err'

  if (!selectedDay) return null;

  const handlePush = async (ev) => {
    const key = `${ev.id}-${ev.eventType}`;
    setPushing(key);
    try {
      await calendarService.pushEvent({
        applicationId: ev.id,
        eventType: ev.eventType,
        date: selectedDay,
      });
      setResults((r) => ({ ...r, [key]: "ok" }));
    } catch {
      setResults((r) => ({ ...r, [key]: "err" }));
    } finally {
      setPushing(null);
      setTimeout(
        () =>
          setResults((r) => {
            const c = { ...r };
            delete c[key];
            return c;
          }),
        3000,
      );
    }
  };

  const dateLabel = new Date(selectedDay + "T00:00:00").toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-dark-tx1 text-sm">
          {dateLabel}
        </h3>
        <span className="text-xs text-gray-400 dark:text-dark-tx3">
          {events.length} event{events.length !== 1 ? "s" : ""}
        </span>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-dark-tx3 text-center py-4">
          No events on this day
        </p>
      ) : (
        <div className="space-y-4">
          {events.map((ev, i) => {
            const chip = STATUS_CHIP[ev.eventType] || STATUS_CHIP.Applied;
            const key = `${ev.id}-${ev.eventType}`;
            const res = results[key];

            return (
              <div key={i} className="flex items-start gap-3">
                <CompanyAvatar name={ev.company} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-dark-tx1 truncate">
                    {ev.company}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-dark-tx3 truncate">
                    {ev.role}
                  </p>

                  {/* Status badge */}
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-semibold mt-1 px-2 py-0.5 rounded-full",
                      chip.bg,
                      chip.text,
                    )}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: chip.dot }}
                    />
                    {ev.label}
                  </span>

                  {/* Push to Google Calendar */}
                  <button
                    onClick={() => handlePush(ev)}
                    disabled={pushing === key}
                    className={cn(
                      "mt-1.5 flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all",
                      res === "ok"
                        ? "bg-emerald-50 dark:bg-dark-green-tint2 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400"
                        : res === "err"
                          ? "bg-red-50 dark:bg-dark-red-tint border-red-200 dark:border-red-900 text-red-500 dark:text-red-400"
                          : "bg-white dark:bg-dark-s2 border-gray-200 dark:border-dark-border text-gray-500 dark:text-dark-tx2 hover:border-dark-accent hover:text-dark-accent dark:hover:text-dark-accent3 dark:hover:border-dark-accent",
                    )}
                  >
                    {pushing === key ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <CalendarDays size={10} />
                    )}
                    {res === "ok"
                      ? "Added to Google Calendar ✓"
                      : res === "err"
                        ? "Failed — check connection"
                        : "Add to Google Calendar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
