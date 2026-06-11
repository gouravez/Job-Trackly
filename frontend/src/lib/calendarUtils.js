// frontend/src/lib/calendarUtils.js

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

export const STATUS_CHIP = {
  Saved:      { bg: 'bg-gray-100 dark:bg-[#1a1e2a]',    text: 'text-gray-500 dark:text-[#8b91a8]',      dot: '#6b7280' },
  Applied:    { bg: 'bg-blue-50 dark:bg-[#0f1a35]',      text: 'text-blue-600 dark:text-[#6b8ef5]',      dot: '#3b82f6' },
  Assessment: { bg: 'bg-purple-50 dark:bg-[#1a1030]',    text: 'text-purple-600 dark:text-purple-400',   dot: '#8b5cf6' },
  Interview:  { bg: 'bg-teal-50 dark:bg-[#0a2020]',      text: 'text-teal-600 dark:text-teal-400',       dot: '#14b8a6' },
  Offer:      { bg: 'bg-emerald-50 dark:bg-[#0a2015]',   text: 'text-emerald-600 dark:text-emerald-400', dot: '#10b981' },
  Rejected:   { bg: 'bg-red-50 dark:bg-[#2a0f11]',       text: 'text-red-500 dark:text-red-400',         dot: '#ef4444' },
  FollowUp:   { bg: 'bg-amber-50 dark:bg-[#271e0a]',     text: 'text-amber-600 dark:text-amber-400',     dot: '#f59e0b' },
}

// Derives a date→events map from the applications array
export function buildEvents(applications) {
  const map = {}

  const add = (dateStr, event) => {
    if (!dateStr) return
    const key = dateStr.slice(0, 10)
    if (!map[key]) map[key] = []
    map[key].push(event)
  }

  for (const app of applications) {
    if (app.dateApplied) {
      add(app.dateApplied, { ...app, eventType: 'Applied', label: 'Applied' })
    }

    if (app.dateApplied && app.status === 'Applied') {
      const fu = new Date(app.dateApplied)
      fu.setDate(fu.getDate() + 7)
      add(fu.toISOString().slice(0, 10), { ...app, eventType: 'FollowUp', label: 'Follow-up due' })
    }

    if (app.status === 'Interview' && app.updatedAt) {
      add(app.updatedAt.slice(0, 10), { ...app, eventType: 'Interview', label: 'Interview' })
    }

    if (app.status === 'Offer' && app.updatedAt) {
      add(app.updatedAt.slice(0, 10), { ...app, eventType: 'Offer', label: 'Offer received 🎉' })
    }
  }

  return map
}

// Builds the flat array of cells for the month grid
export function buildCells(year, month) {
  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev  = new Date(year, month, 0).getDate()

  const cells = []

  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, current: false, date: null })

  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, current: true, date })
  }

  const trailing = 7 - (cells.length % 7 === 0 ? 7 : cells.length % 7)
  for (let d = 1; d <= trailing; d++)
    cells.push({ day: d, current: false, date: null })

  return cells
}