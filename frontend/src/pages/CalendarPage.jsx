import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import CalendarDayDetail from "@/components/calendar/CalendarDayDetail";
import CalendarUpcoming from "@/components/calendar/CalendarUpcoming";
import CalendarMonthStats from "@/components/calendar/CalendarMonthStats";
import GoogleCalendarCard from "@/components/calendar/GoogleCalendarCard";
import useAppStore from "@/store/appStore";
import { buildEvents } from "@/lib/calendarUtils";

const LEGEND = [
  ["Applied", "#3b82f6"],
  ["Follow-up", "#f59e0b"],
  ["Interview", "#14b8a6"],
  ["Offer", "#10b981"],
];

export default function CalendarPage() {
  const applications = useAppStore((s) => s.applications);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  const eventMap = useMemo(() => buildEvents(applications), [applications]);

  const selectedEvents = selectedDay ? eventMap[selectedDay] || [] : [];

  const upcoming = useMemo(() => {
    const result = [];
    for (let i = 0; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      if (eventMap[key])
        eventMap[key].forEach((ev) => result.push({ ...ev, date: key }));
    }
    return result.slice(0, 8);
  }, [eventMap]);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-dark-tx1">
              Calendar
            </h1>
            <p className="text-gray-400 dark:text-dark-tx2 mt-0.5 text-sm">
              Applications, interviews, and follow-ups at a glance
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 flex-wrap">
            {LEGEND.map(([label, color]) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-dark-tx2"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Calendar grid — takes 3 cols */}
          <CalendarGrid
            year={year}
            month={month}
            todayStr={todayStr}
            selectedDay={selectedDay}
            eventMap={eventMap}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            onSelectDay={setSelectedDay}
          />

          {/* Right sidebar — 1 col */}
          <div className="space-y-4">
            <CalendarDayDetail
              selectedDay={selectedDay}
              events={selectedEvents}
            />
            <CalendarUpcoming
              upcoming={upcoming}
              todayStr={todayStr}
              onSelectDay={setSelectedDay}
            />
            <CalendarMonthStats
              year={year}
              month={month}
              applications={applications}
              eventMap={eventMap}
            />
            <GoogleCalendarCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
