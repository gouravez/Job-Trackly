import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, FileText, Users, X, CornerDownLeft, LayoutDashboard,
  Columns3, CalendarDays, BarChart2, Settings, ArrowRight,
  User, Palette, Bell, Shield,
} from 'lucide-react'
import useAppStore from '@/store/appStore'
import useReferralStore from '@/store/referralStore'
import { cn } from '@/lib/utils'

// ── Helpers ──────────────────────────────────────────────────────────────────
function highlight(text, query) {
  if (!text) return text
  if (!query) return text
  const i = text.toLowerCase().indexOf(query.toLowerCase())
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}
      <span className="text-dark-accent3 font-semibold">{text.slice(i, i + query.length)}</span>
      {text.slice(i + query.length)}
    </>
  )
}

// Find the first field (other than the ones already shown) whose value
// contains the query, so we can surface *why* a result matched.
function matchContext(obj, fields, q, skip = []) {
  for (const { key, label } of fields) {
    if (skip.includes(key)) continue
    const val = obj[key]
    if (val == null) continue
    const str = String(val)
    if (str.toLowerCase().includes(q)) {
      const i = str.toLowerCase().indexOf(q)
      const start = Math.max(0, i - 18)
      const end = Math.min(str.length, i + q.length + 28)
      const snippet = `${start > 0 ? '…' : ''}${str.slice(start, end)}${end < str.length ? '…' : ''}`
      return { label, snippet }
    }
  }
  return null
}

const STATUS_COLORS = {
  applied:    'bg-dark-blue-tint text-status-blue',
  interview:  'bg-dark-amber-tint text-status-amber',
  assessment: 'bg-dark-amber-tint text-status-amber',
  offer:      'bg-dark-green-tint2 text-status-emerald',
  rejected:   'bg-dark-red-tint text-status-red',
  saved:      'bg-dark-s3 text-dark-tx2',
}

// Fields searched on each application (beyond the title/subtitle already shown)
const APPLICATION_FIELDS = [
  { key: 'company',  label: 'Company' },
  { key: 'role',     label: 'Role' },
  { key: 'location', label: 'Location' },
  { key: 'status',   label: 'Status' },
  { key: 'priority', label: 'Priority' },
  { key: 'job_type', label: 'Job type' },
  { key: 'jobType',  label: 'Job type' },
  { key: 'salary',   label: 'Salary' },
  { key: 'job_url',  label: 'Job link' },
  { key: 'jobUrl',   label: 'Job link' },
  { key: 'notes',    label: 'Notes' },
]

// Fields searched on each referral (beyond the title/subtitle already shown)
const REFERRAL_FIELDS = [
  { key: 'name',         label: 'Name' },
  { key: 'company',      label: 'Company' },
  { key: 'title',        label: 'Title' },
  { key: 'relationship', label: 'Relationship' },
  { key: 'email',        label: 'Email' },
  { key: 'phone',        label: 'Phone' },
  { key: 'linkedin',     label: 'LinkedIn' },
  { key: 'notes',        label: 'Notes' },
]

// Static, searchable index of every page AND in-page section across the app.
// `to` may include a hash (#section -> scrolled into view) or query params
// (e.g. ?status=Interview, ?relationship=Recruiter, ?tab=notifications) which
// the destination pages read to pre-apply filters / open the right tab.
const PAGES = [
  // Dashboard
  { label: 'Dashboard',            page: 'Dashboard', keywords: 'dashboard home overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Application Stats',    page: 'Dashboard', keywords: 'stats summary totals counts overview cards', to: '/dashboard#stats', icon: LayoutDashboard },
  { label: 'Activity Chart',       page: 'Dashboard', keywords: 'activity chart graph applications over time trend', to: '/dashboard#activity-chart', icon: BarChart2 },
  { label: 'Follow-ups',           page: 'Dashboard', keywords: 'follow up reminders upcoming tasks', to: '/dashboard#follow-ups', icon: Bell },
  { label: 'Recent Applications',  page: 'Dashboard', keywords: 'recent applications latest activity', to: '/dashboard#recent-applications', icon: FileText },

  // Applications
  { label: 'Applications',           page: 'Applications', keywords: 'applications jobs job list table tracker all', to: '/applications', icon: FileText },
  { label: 'Saved Applications',     page: 'Applications', keywords: 'saved applications wishlist bookmarked jobs', to: '/applications?status=Saved', icon: FileText },
  { label: 'Applied Applications',   page: 'Applications', keywords: 'applied applications submitted jobs', to: '/applications?status=Applied', icon: FileText },
  { label: 'Assessment Applications',page: 'Applications', keywords: 'assessment applications test screening', to: '/applications?status=Assessment', icon: FileText },
  { label: 'Interview Applications', page: 'Applications', keywords: 'interview applications interviewing scheduled', to: '/applications?status=Interview', icon: FileText },
  { label: 'Offer Applications',     page: 'Applications', keywords: 'offer applications offers received', to: '/applications?status=Offer', icon: FileText },
  { label: 'Rejected Applications',  page: 'Applications', keywords: 'rejected applications declined rejections', to: '/applications?status=Rejected', icon: FileText },

  // Kanban Board
  { label: 'Kanban Board',       page: 'Kanban Board', keywords: 'kanban board pipeline drag drop stages', to: '/kanban', icon: Columns3 },
  { label: 'Saved Column',       page: 'Kanban Board', keywords: 'kanban saved column wishlist', to: '/kanban?status=Saved', icon: Columns3 },
  { label: 'Applied Column',     page: 'Kanban Board', keywords: 'kanban applied column', to: '/kanban?status=Applied', icon: Columns3 },
  { label: 'Assessment Column',  page: 'Kanban Board', keywords: 'kanban assessment column test', to: '/kanban?status=Assessment', icon: Columns3 },
  { label: 'Interview Column',   page: 'Kanban Board', keywords: 'kanban interview column', to: '/kanban?status=Interview', icon: Columns3 },
  { label: 'Offer Column',       page: 'Kanban Board', keywords: 'kanban offer column', to: '/kanban?status=Offer', icon: Columns3 },
  { label: 'Rejected Column',    page: 'Kanban Board', keywords: 'kanban rejected column', to: '/kanban?status=Rejected', icon: Columns3 },

  // Calendar
  { label: 'Calendar',           page: 'Calendar', keywords: 'calendar schedule events month view', to: '/calendar', icon: CalendarDays },
  { label: 'Calendar Grid',      page: 'Calendar', keywords: 'calendar month view grid days', to: '/calendar#calendar-grid', icon: CalendarDays },
  { label: 'Upcoming Events',    page: 'Calendar', keywords: 'upcoming events interviews follow ups reminders next two weeks', to: '/calendar#upcoming-events', icon: Bell },
  { label: 'Month Stats',        page: 'Calendar', keywords: 'calendar month stats summary this month totals', to: '/calendar#month-stats', icon: BarChart2 },
  { label: 'Google Calendar Sync', page: 'Calendar', keywords: 'google calendar sync integration connect import export', to: '/calendar#google-calendar', icon: CalendarDays },

  // Referral Network
  { label: 'Referral Network',     page: 'Referral Network', keywords: 'referrals contacts network people connections all', to: '/referrals', icon: Users },
  { label: 'Referral Stats',       page: 'Referral Network', keywords: 'referral stats total contacts strong connections linked applications', to: '/referrals#referral-stats', icon: BarChart2 },
  { label: 'Colleague Contacts',   page: 'Referral Network', keywords: 'colleague contacts coworkers', to: '/referrals?relationship=Colleague', icon: Users },
  { label: 'Friend Contacts',      page: 'Referral Network', keywords: 'friend contacts friends', to: '/referrals?relationship=Friend', icon: Users },
  { label: 'Alumni Contacts',      page: 'Referral Network', keywords: 'alumni contacts university college school', to: '/referrals?relationship=Alumni', icon: Users },
  { label: 'Recruiter Contacts',   page: 'Referral Network', keywords: 'recruiter contacts recruiters hiring talent', to: '/referrals?relationship=Recruiter', icon: Users },
  { label: 'Manager Contacts',     page: 'Referral Network', keywords: 'manager contacts managers boss', to: '/referrals?relationship=Manager', icon: Users },
  { label: 'Mentor Contacts',      page: 'Referral Network', keywords: 'mentor contacts mentors', to: '/referrals?relationship=Mentor', icon: Users },

  // Analytics
  { label: 'Analytics',          page: 'Analytics', keywords: 'analytics charts insights overview performance', to: '/analytics', icon: BarChart2 },
  { label: 'Analytics Stats',    page: 'Analytics', keywords: 'analytics stats summary totals overview cards', to: '/analytics#analytics-stats', icon: BarChart2 },
  { label: 'Monthly Trends',     page: 'Analytics', keywords: 'monthly trends chart over time applications per month', to: '/analytics#monthly-trends', icon: BarChart2 },
  { label: 'Status Breakdown',   page: 'Analytics', keywords: 'status breakdown pie chart distribution', to: '/analytics#status-breakdown', icon: BarChart2 },
  { label: 'Application Funnel', page: 'Analytics', keywords: 'application funnel conversion stages', to: '/analytics#funnel', icon: BarChart2 },
  { label: 'Top Companies',      page: 'Analytics', keywords: 'top companies most applied to', to: '/analytics#top-companies', icon: BarChart2 },

  // Settings
  { label: 'Settings',               page: 'Settings', keywords: 'settings preferences', to: '/settings', icon: Settings },
  { label: 'Profile Settings',       page: 'Settings', keywords: 'profile name email bio avatar university graduation resume', to: '/settings?tab=profile', icon: User },
  { label: 'Appearance Settings',    page: 'Settings', keywords: 'appearance theme dark light mode color', to: '/settings?tab=appearance', icon: Palette },
  { label: 'Notification Settings',  page: 'Settings', keywords: 'notifications notification email alerts reminders follow up', to: '/settings?tab=notifications', icon: Bell },
  { label: 'Account Settings',       page: 'Settings', keywords: 'account password security delete sign out logout', to: '/settings?tab=account', icon: Shield },
]

const CATEGORY_ORDER = ['page', 'application', 'referral']
const CATEGORY_LABELS = {
  page:        'Pages',
  application: 'Applications',
  referral:    'Referral Network',
}

export default function GlobalSearch() {
  const [open, setOpen]   = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const wrapRef  = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const { applications, fetchApplications } = useAppStore()
  const { referrals, fetchReferrals } = useReferralStore()

  // Lazy-load data the first time the search is opened
  useEffect(() => {
    if (open) {
      if (!applications.length) fetchApplications()
      if (!referrals.length) fetchReferrals()
    }
  }, [open])

  // ── Keyboard shortcut: Cmd/Ctrl+K ────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 0)
      }
      if (e.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Close on outside click ───────────────────────────────────────────────────
  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // ── Build results ─────────────────────────────────────────────────────────────
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    // Pages / navigation / in-page sections
    const pageResults = PAGES
      .filter(p =>
        p.label.toLowerCase().includes(q) ||
        p.page.toLowerCase().includes(q) ||
        p.keywords.includes(q)
      )
      .slice(0, 8)
      .map(p => ({
        type: 'page',
        id: p.to,
        title: p.label,
        subtitle: p.label === p.page ? 'Page' : p.page,
        icon: p.icon,
        to: p.to,
      }))

    // Applications — search across every relevant field
    const appResults = applications
      .filter(a => APPLICATION_FIELDS.some(({ key }) => {
        const val = a[key]
        return val != null && String(val).toLowerCase().includes(q)
      }))
      .slice(0, 6)
      .map(a => ({
        type: 'application',
        id: a.id,
        title: a.role,
        subtitle: a.company,
        meta: a.status,
        context: matchContext(a, APPLICATION_FIELDS, q, ['role', 'company']),
        to: `/applications/${a.id}`,
      }))

    // Referrals — search across every relevant field
    const referralResults = referrals
      .filter(r => REFERRAL_FIELDS.some(({ key }) => {
        const val = r[key]
        return val != null && String(val).toLowerCase().includes(q)
      }))
      .slice(0, 6)
      .map(r => ({
        type: 'referral',
        id: r.id,
        title: r.name,
        subtitle: [r.title, r.company].filter(Boolean).join(' · '),
        meta: r.relationship,
        context: matchContext(r, REFERRAL_FIELDS, q, ['name', 'title', 'company', 'relationship']),
        to: `/referrals`,
      }))

    const byType = {
      page: pageResults,
      application: appResults,
      referral: referralResults,
    }

    return CATEGORY_ORDER
      .map(type => ({ type, label: CATEGORY_LABELS[type], items: byType[type] }))
      .filter(g => g.items.length > 0)
  }, [query, applications, referrals])

  // Flatten for keyboard navigation across all groups
  const flatResults = useMemo(() => groups.flatMap(g => g.items), [groups])

  useEffect(() => setActive(0), [query])

  const handleSelect = (result) => {
    if (!result) return
    navigate(result.to)
    setOpen(false)
    setQuery('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(a => Math.min(a + 1, flatResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(a => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSelect(flatResults[active])
    }
  }

  const totalResults = flatResults.length
  let runningIndex = -1

  return (
    <>
      {/* Backdrop, dims the page while results are open */}
      {open && query.trim() && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-30" />
      )}

      <div
        ref={wrapRef}
        className="relative w-full max-w-xl"
      >
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-tx3" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search applications, contacts, pages…"
            className="w-full h-10 pl-8 pr-16 rounded-xl border border-dark-border bg-dark-s1 text-sm text-dark-tx1 placeholder:text-dark-tx3 shadow-lg shadow-black/5 focus:outline-none focus:ring-2 focus:ring-dark-accent focus:border-dark-accent transition-all"
          />
          {query ? (
            <button
              onClick={() => { setQuery(''); inputRef.current?.focus() }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dark-tx3 hover:text-dark-tx1 transition-colors"
            >
              <X size={14} />
            </button>
          ) : (
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-[10px] font-medium text-dark-tx3 bg-dark-s3 border border-dark-border rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          )}
        </div>

        {/* Results dropdown */}
        {open && query.trim() && (
          <div className="absolute left-0 right-0 mt-2 bg-dark-s1 border border-dark-border rounded-xl shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto">
            {totalResults === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-dark-tx2 font-medium">No results found</p>
                <p className="text-xs text-dark-tx3 mt-1">Try a different company, role, contact, or page name</p>
              </div>
            ) : (
              groups.map((group) => (
                <div key={group.type} className="py-1.5 border-b border-dark-border last:border-b-0">
                  <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-dark-tx3">
                    {group.label}
                  </p>
                  {group.items.map((r) => {
                    runningIndex += 1
                    const i = runningIndex
                    return (
                      <button
                        key={`${r.type}-${r.id}`}
                        onClick={() => handleSelect(r)}
                        onMouseEnter={() => setActive(i)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors',
                          i === active ? 'bg-dark-s2' : 'hover:bg-dark-s2'
                        )}
                      >
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                          r.type === 'application' && 'bg-dark-accent-bg text-dark-accent3',
                          r.type === 'referral' && 'bg-dark-green-tint2 text-status-emerald',
                          r.type === 'page' && 'bg-dark-s3 text-dark-tx2',
                        )}>
                          {r.type === 'application' && <FileText size={14} />}
                          {r.type === 'referral' && <Users size={14} />}
                          {r.type === 'page' && <r.icon size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-dark-tx1 truncate">{highlight(r.title || '', query)}</p>
                          <p className="text-xs text-dark-tx3 truncate">{highlight(r.subtitle || '', query)}</p>
                          {r.context && (
                            <p className="text-[11px] text-dark-tx3 truncate mt-0.5">
                              <span className="font-medium text-dark-tx2">{r.context.label}:</span>{' '}
                              {highlight(r.context.snippet, query)}
                            </p>
                          )}
                        </div>
                        {r.meta && (
                          <span className={cn(
                            'text-xs font-medium px-2 py-0.5 rounded-full capitalize flex-shrink-0',
                            r.type === 'application' ? (STATUS_COLORS[String(r.meta).toLowerCase()] || STATUS_COLORS.saved) : 'bg-dark-s3 text-dark-tx2'
                          )}>
                            {r.meta}
                          </span>
                        )}
                        {r.type === 'page' && (
                          <ArrowRight size={13} className="text-dark-tx3 flex-shrink-0" />
                        )}
                        {i === active && r.type !== 'page' && <CornerDownLeft size={12} className="text-dark-tx3 flex-shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              ))
            )}

            {/* Footer */}
            <div className="px-3 py-2 border-t border-dark-border flex items-center justify-between text-[11px] text-dark-tx3 bg-dark-s1">
              <span>{totalResults > 0 ? `${totalResults} result${totalResults > 1 ? 's' : ''}` : ''}</span>
              <span className="flex items-center gap-1">
                <kbd className="bg-dark-s3 border border-dark-border rounded px-1">↑↓</kbd> navigate
                <kbd className="bg-dark-s3 border border-dark-border rounded px-1 ml-1">↵</kbd> open
                <kbd className="bg-dark-s3 border border-dark-border rounded px-1 ml-1">esc</kbd> close
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}