import { useEffect, useMemo } from 'react'
import DashboardLayout    from '@/components/layout/DashboardLayout'
import CalendarGrid       from '@/components/calendar/CalendarGrid'
import CalendarDayDetail  from '@/components/calendar/CalendarDayDetail'
import CalendarUpcoming   from '@/components/calendar/CalendarUpcoming'
import CalendarMonthStats from '@/components/calendar/CalendarMonthStats'
import GoogleCalendarCard from '@/components/calendar/GoogleCalendarCard'
import useAppStore        from '@/store/appStore'
import useCalendarStore   from '@/store/calendarStore'

const LEGEND = [
  ['Applied',   '#3b82f6'],
  ['Follow-up', '#f59e0b'],
  ['Interview', '#14b8a6'],
  ['Offer',     '#10b981'],
]

export default function CalendarPage() {
  const { applications, fetchApplications, isLoading } = useAppStore()

  const {
    year, month, prevMonth, nextMonth,
    selectedDay, selectDay,
    eventMap, refreshEvents,
    handleGcalParam,
  } = useCalendarStore()

  const todayStr = new Date().toISOString().slice(0, 10)

  // If the store is empty (direct nav/refresh on this page), fetch first —
  // every other page does this, but Calendar previously relied entirely on
  // another page having already populated the shared store.
  useEffect(() => {
    if (applications.length === 0) fetchApplications()
  }, [])

  // Re-derive eventMap whenever applications change
  useEffect(() => {
    refreshEvents(applications)
  }, [applications])

  // Handle ?gcal=connected redirect from Google OAuth
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('gcal')
    if (param) handleGcalParam(param)
  }, [])

  const selectedEvents = selectedDay ? (eventMap[selectedDay] || []) : []

  const upcoming = useMemo(() => {
    const result = []
    for (let i = 0; i <= 14; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      const key = d.toISOString().slice(0, 10)
      if (eventMap[key]) eventMap[key].forEach((ev) => result.push({ ...ev, date: key }))
    }
    return result.slice(0, 8)
  }, [eventMap])

  // ── Loading state ──────────────────────────────────────────────────────
  if (isLoading && applications.length === 0) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8 space-y-5 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-7 sm:h-8 w-32 bg-gray-100 dark:bg-dark-s2 rounded" />
              <div className="h-3.5 w-56 bg-gray-100 dark:bg-dark-s2 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            <div className="xl:col-span-3 h-[480px] bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border" />
            <div className="space-y-4">
              <div className="h-32 bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border" />
              <div className="h-48 bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border" />
              <div className="h-32 bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

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
              <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-dark-tx2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">

          {/* Calendar grid — 3 cols */}
          <div id="calendar-grid" className="scroll-mt-20 xl:col-span-3">
            <CalendarGrid
              year={year}
              month={month}
              todayStr={todayStr}
              selectedDay={selectedDay}
              eventMap={eventMap}
              onPrevMonth={prevMonth}
              onNextMonth={nextMonth}
              onSelectDay={selectDay}
            />
          </div>

          {/* Right sidebar — 1 col */}
          <div className="space-y-4">
            <CalendarDayDetail selectedDay={selectedDay} events={selectedEvents} />
            <div id="upcoming-events" className="scroll-mt-20">
              <CalendarUpcoming upcoming={upcoming} todayStr={todayStr} onSelectDay={selectDay} />
            </div>
            <div id="month-stats" className="scroll-mt-20">
              <CalendarMonthStats
                year={year}
                month={month}
                applications={applications}
                eventMap={eventMap}
              />
            </div>
            <div id="google-calendar" className="scroll-mt-20">
              <GoogleCalendarCard />
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}