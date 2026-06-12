import { useEffect, useState } from 'react'
import {
  Users, Plus, Search, Linkedin, Mail, Phone, Briefcase,
  Star, Pencil, Trash2, X, Link2, Unlink, ChevronDown, ExternalLink,
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import useReferralStore from '@/store/referralStore'
import useAppStore from '@/store/appStore'
import { cn } from '@/lib/utils'

// ── Constants ──────────────────────────────────────────────────────────────────
const RELATIONSHIPS = ['Colleague', 'Friend', 'Alumni', 'Recruiter', 'Manager', 'Mentor', 'Other']

const REL_COLORS = {
  Colleague: 'bg-dark-blue-tint text-status-blue',
  Friend:    'bg-dark-green-tint2 text-status-emerald',
  Alumni:    'bg-dark-purple-tint text-status-purple',
  Recruiter: 'bg-dark-amber-tint text-status-amber',
  Manager:   'bg-dark-navy-tint text-dark-accent3',
  Mentor:    'bg-dark-teal-tint text-status-teal',
  Other:     'bg-dark-s3 text-dark-tx2',
}

const STRENGTH_LABEL = { 1: 'Weak', 2: 'Low', 3: 'Medium', 4: 'Strong', 5: 'Close' }
const STRENGTH_COLOR = { 1: '#52505f', 2: '#8b8a99', 3: '#f0a500', 4: '#4f8ef7', 5: '#22c773' }

const inputCls = 'w-full h-10 px-3 rounded-lg border border-dark-border bg-dark-s2 text-sm text-dark-tx1 placeholder:text-dark-tx3 focus:outline-none focus:ring-2 focus:ring-dark-accent focus:border-dark-accent transition-all'
const labelCls = 'block text-xs font-medium text-dark-tx2 mb-1.5'

// ── Strength stars ─────────────────────────────────────────────────────────────
function StrengthStars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange?.(n)}>
          <Star
            size={16}
            fill={n <= value ? STRENGTH_COLOR[value] : 'transparent'}
            stroke={n <= value ? STRENGTH_COLOR[value] : '#52505f'}
          />
        </button>
      ))}
    </div>
  )
}

// ── Add / Edit Modal ───────────────────────────────────────────────────────────
function ReferralModal({ open, onClose, initial }) {
  const { addReferral, updateReferral } = useReferralStore()
  const isEdit = !!initial

  const blank = { name: '', email: '', phone: '', title: '', company: '',
    linkedin: '', relationship: 'Other', strength: 3, notes: '', last_contacted: '' }

  const [form, setForm] = useState(blank)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (open) setForm(initial
      ? { ...blank, ...initial, last_contacted: initial.lastContacted || '' }
      : blank)
    setError('')
  }, [open, initial])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Name is required'); return }
    setSaving(true)
    const res = isEdit
      ? await updateReferral(initial.id, form)
      : await addReferral(form)
    setSaving(false)
    if (res.success) onClose()
    else setError(res.message)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-dark-s1 border border-dark-border rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
          <h2 className="text-base font-semibold text-dark-tx1">{isEdit ? 'Edit Contact' : 'Add Contact'}</h2>
          <button onClick={onClose} className="text-dark-tx3 hover:text-dark-tx1 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && <p className="text-sm text-status-red bg-dark-red-tint px-3 py-2 rounded-lg">{error}</p>}

          {/* Name + Relationship */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Name <span className="text-status-red">*</span></label>
              <input className={inputCls} placeholder="Full name" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Relationship</label>
              <select className={inputCls} value={form.relationship} onChange={e => set('relationship', e.target.value)}>
                {RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Title + Company */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Job Title</label>
              <input className={inputCls} placeholder="Senior Engineer" value={form.title} onChange={e => set('title', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Company</label>
              <input className={inputCls} placeholder="Google" value={form.company} onChange={e => set('company', e.target.value)} />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Email</label>
              <input className={inputCls} type="email" placeholder="name@company.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          </div>

          {/* LinkedIn */}
          <div>
            <label className={labelCls}>LinkedIn URL</label>
            <input className={inputCls} placeholder="https://linkedin.com/in/username" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} />
          </div>

          {/* Strength + Last Contacted */}
          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <label className={labelCls}>Connection Strength</label>
              <div className="h-10 flex items-center gap-2">
                <StrengthStars value={form.strength} onChange={v => set('strength', v)} />
                <span className="text-xs text-dark-tx3">{STRENGTH_LABEL[form.strength]}</span>
              </div>
            </div>
            <div>
              <label className={labelCls}>Last Contacted</label>
              <input className={inputCls} type="date" value={form.last_contacted} onChange={e => set('last_contacted', e.target.value)} />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              rows={3}
              className={cn(inputCls, 'h-auto py-2.5 resize-none')}
              placeholder="How you know them, topics discussed, follow-ups..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-dark-border">
          <button onClick={onClose} className="px-4 py-2 text-sm text-dark-tx2 hover:text-dark-tx1 transition-colors">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-dark-accent text-white hover:bg-dark-accent2 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Contact'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Link Applications Modal ────────────────────────────────────────────────────
function LinkAppModal({ open, onClose, referral }) {
  const { applications } = useAppStore()
  const { linkApplication, unlinkApplication } = useReferralStore()
  const [saving, setSaving] = useState(null)

  if (!open || !referral) return null

  const linkedIds = new Set((referral.applications || []).map(a => a.id))

  const handleToggle = async (app) => {
    setSaving(app.id)
    if (linkedIds.has(app.id)) {
      await unlinkApplication(referral.id, app.id)
    } else {
      await linkApplication(referral.id, app.id, null)
    }
    setSaving(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-dark-s1 border border-dark-border rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
          <div>
            <h2 className="text-base font-semibold text-dark-tx1">Link Applications</h2>
            <p className="text-xs text-dark-tx3 mt-0.5">Connect {referral.name}'s referrals to your applications</p>
          </div>
          <button onClick={onClose} className="text-dark-tx3 hover:text-dark-tx1"><X size={18} /></button>
        </div>
        <div className="max-h-80 overflow-y-auto divide-y divide-dark-border">
          {applications.length === 0 && (
            <p className="text-sm text-dark-tx3 text-center py-8">No applications yet</p>
          )}
          {applications.map(app => {
            const linked = linkedIds.has(app.id)
            return (
              <div key={app.id} className="flex items-center justify-between px-5 py-3 hover:bg-dark-s2 transition-colors">
                <div>
                  <p className="text-sm font-medium text-dark-tx1">{app.company}</p>
                  <p className="text-xs text-dark-tx3">{app.role} · <span className={cn('capitalize', linked ? 'text-status-green' : 'text-dark-tx3')}>{app.status}</span></p>
                </div>
                <button
                  onClick={() => handleToggle(app)}
                  disabled={saving === app.id}
                  className={cn(
                    'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors',
                    linked
                      ? 'bg-dark-red-tint text-status-red hover:bg-red-900/30'
                      : 'bg-dark-accent-bg text-dark-accent3 hover:bg-dark-s4',
                  )}
                >
                  {saving === app.id ? '…' : linked ? <><Unlink size={12} /> Unlink</> : <><Link2 size={12} /> Link</>}
                </button>
              </div>
            )
          })}
        </div>
        <div className="px-5 py-3 border-t border-dark-border">
          <button onClick={onClose} className="w-full py-2 text-sm text-dark-tx2 hover:text-dark-tx1 transition-colors">Done</button>
        </div>
      </div>
    </div>
  )
}

// ── Contact Card ───────────────────────────────────────────────────────────────
function ContactCard({ referral, onEdit, onDelete, onLink }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-dark-s1 border border-dark-border rounded-xl overflow-hidden hover:border-dark-border2 transition-colors">
      {/* Top */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          {/* Avatar + Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-dark-accent-bg border border-dark-accent/30 flex items-center justify-center text-dark-accent3 text-sm font-bold flex-shrink-0">
              {referral.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-dark-tx1 leading-tight">{referral.name}</p>
              {referral.title && <p className="text-xs text-dark-tx3 mt-0.5">{referral.title}</p>}
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => onLink(referral)} title="Link applications"
              className="p-1.5 rounded-lg text-dark-tx3 hover:text-dark-accent3 hover:bg-dark-s2 transition-colors">
              <Link2 size={14} />
            </button>
            <button onClick={() => onEdit(referral)} title="Edit"
              className="p-1.5 rounded-lg text-dark-tx3 hover:text-dark-tx1 hover:bg-dark-s2 transition-colors">
              <Pencil size={14} />
            </button>
            <button onClick={() => onDelete(referral)} title="Delete"
              className="p-1.5 rounded-lg text-dark-tx3 hover:text-status-red hover:bg-dark-red-tint transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Company + Relationship */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {referral.company && (
            <span className="flex items-center gap-1 text-xs text-dark-tx2">
              <Briefcase size={11} /> {referral.company}
            </span>
          )}
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', REL_COLORS[referral.relationship] || REL_COLORS.Other)}>
            {referral.relationship}
          </span>
        </div>

        {/* Strength */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(n => (
              <Star key={n} size={12}
                fill={n <= referral.strength ? STRENGTH_COLOR[referral.strength] : 'transparent'}
                stroke={n <= referral.strength ? STRENGTH_COLOR[referral.strength] : '#52505f'}
              />
            ))}
          </div>
          <span className="text-xs text-dark-tx3">{STRENGTH_LABEL[referral.strength]}</span>
          {referral.lastContacted && (
            <span className="text-xs text-dark-tx3 ml-auto">Last: {new Date(referral.lastContacted).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          )}
        </div>
      </div>

      {/* Contact row */}
      <div className="flex items-center gap-1 px-4 pb-3">
        {referral.email && (
          <a href={`mailto:${referral.email}`}
            className="flex items-center gap-1.5 text-xs text-dark-tx3 hover:text-dark-accent3 transition-colors bg-dark-s2 px-2.5 py-1.5 rounded-lg">
            <Mail size={11} /> Email
          </a>
        )}
        {referral.phone && (
          <a href={`tel:${referral.phone}`}
            className="flex items-center gap-1.5 text-xs text-dark-tx3 hover:text-dark-accent3 transition-colors bg-dark-s2 px-2.5 py-1.5 rounded-lg">
            <Phone size={11} /> Call
          </a>
        )}
        {referral.linkedin && (
          <a href={referral.linkedin} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-dark-tx3 hover:text-[#0a66c2] transition-colors bg-dark-s2 px-2.5 py-1.5 rounded-lg">
            <Linkedin size={11} /> LinkedIn
          </a>
        )}
      </div>

      {/* Linked applications */}
      {referral.applications?.length > 0 && (
        <div className="border-t border-dark-border">
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center justify-between w-full px-4 py-2.5 text-xs text-dark-tx2 hover:bg-dark-s2 transition-colors"
          >
            <span>{referral.applications.length} linked application{referral.applications.length > 1 ? 's' : ''}</span>
            <ChevronDown size={13} className={cn('transition-transform', expanded && 'rotate-180')} />
          </button>
          {expanded && (
            <div className="px-4 pb-3 space-y-1.5">
              {referral.applications.map(app => (
                <div key={app.id} className="flex items-center justify-between bg-dark-s2 rounded-lg px-3 py-2">
                  <div>
                    <p className="text-xs font-medium text-dark-tx1">{app.company}</p>
                    <p className="text-xs text-dark-tx3">{app.role}</p>
                  </div>
                  <a href={`/applications/${app.id}`}
                    className="text-dark-tx3 hover:text-dark-accent3 transition-colors">
                    <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {referral.notes && (
        <div className="border-t border-dark-border px-4 py-3">
          <p className="text-xs text-dark-tx3 leading-relaxed line-clamp-2">{referral.notes}</p>
        </div>
      )}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ReferralPage() {
  const { referrals, isLoading, fetchReferrals, removeReferral } = useReferralStore()
  const { applications, fetchApplications } = useAppStore()

  const [search,    setSearch]    = useState('')
  const [relFilter, setRelFilter] = useState('All')
  const [modal,     setModal]     = useState({ open: false, initial: null })
  const [linkModal, setLinkModal] = useState({ open: false, referral: null })
  const [delTarget, setDelTarget] = useState(null)

  useEffect(() => {
    fetchReferrals()
    if (!applications.length) fetchApplications()
  }, [])

  const filtered = referrals.filter(r => {
    const q = search.toLowerCase()
    const matchSearch = !q || r.name.toLowerCase().includes(q) ||
      r.company?.toLowerCase().includes(q) || r.title?.toLowerCase().includes(q)
    const matchRel = relFilter === 'All' || r.relationship === relFilter
    return matchSearch && matchRel
  })

  const handleDelete = async () => {
    if (!delTarget) return
    await removeReferral(delTarget.id)
    setDelTarget(null)
  }

  // ── Summary stats
  const totalLinked = referrals.reduce((s, r) => s + (r.applications?.length || 0), 0)
  const strongCount = referrals.filter(r => r.strength >= 4).length

  return (
    <DashboardLayout>
      <div className="px-6 py-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-tx1 tracking-tight">Referral Network</h1>
            <p className="text-sm text-dark-tx3 mt-0.5">Your contacts, their details, and which roles they helped with</p>
          </div>
          <button
            onClick={() => setModal({ open: true, initial: null })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-dark-accent text-white hover:bg-dark-accent2 transition-colors"
          >
            <Plus size={16} /> Add Contact
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Contacts', value: referrals.length, color: 'text-dark-tx1' },
            { label: 'Strong Connections', value: strongCount, color: 'text-status-green' },
            { label: 'Applications Linked', value: totalLinked, color: 'text-dark-accent3' },
          ].map(s => (
            <div key={s.label} className="bg-dark-s1 border border-dark-border rounded-xl p-4">
              <p className="text-xs text-dark-tx3 uppercase tracking-wide mb-1">{s.label}</p>
              <p className={cn('text-2xl font-bold tracking-tight', s.color)}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-tx3" />
            <input
              className="w-full h-9 pl-8 pr-3 rounded-lg border border-dark-border bg-dark-s2 text-sm text-dark-tx1 placeholder:text-dark-tx3 focus:outline-none focus:ring-2 focus:ring-dark-accent focus:border-dark-accent"
              placeholder="Search by name, company, or title…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', ...RELATIONSHIPS].map(r => (
              <button
                key={r}
                onClick={() => setRelFilter(r)}
                className={cn(
                  'px-3 h-9 text-xs font-medium rounded-lg border transition-colors',
                  relFilter === r
                    ? 'bg-dark-accent-bg border-dark-accent/40 text-dark-accent3'
                    : 'bg-dark-s1 border-dark-border text-dark-tx2 hover:border-dark-border2 hover:text-dark-tx1'
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-dark-s1 border border-dark-border rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-full bg-dark-s2 flex items-center justify-center mb-4">
              <Users size={24} className="text-dark-tx3" />
            </div>
            <p className="text-base font-medium text-dark-tx2">
              {search || relFilter !== 'All' ? 'No contacts match your filters' : 'No contacts yet'}
            </p>
            <p className="text-sm text-dark-tx3 mt-1 max-w-xs">
              {search || relFilter !== 'All'
                ? 'Try adjusting your search or filter'
                : 'Add your first contact — colleagues, alumni, recruiters, or anyone who can help you land a role.'}
            </p>
            {!search && relFilter === 'All' && (
              <button
                onClick={() => setModal({ open: true, initial: null })}
                className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-dark-accent text-white hover:bg-dark-accent2 transition-colors"
              >
                <Plus size={15} /> Add First Contact
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(r => (
              <ContactCard
                key={r.id}
                referral={r}
                onEdit={ref => setModal({ open: true, initial: ref })}
                onDelete={setDelTarget}
                onLink={ref => setLinkModal({ open: true, referral: ref })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <ReferralModal
        open={modal.open}
        onClose={() => setModal({ open: false, initial: null })}
        initial={modal.initial}
      />

      {/* Link Applications Modal */}
      <LinkAppModal
        open={linkModal.open}
        onClose={() => setLinkModal({ open: false, referral: null })}
        referral={linkModal.referral}
      />

      {/* Delete Confirm */}
      {delTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-dark-s1 border border-dark-border rounded-xl p-6">
            <h3 className="text-base font-semibold text-dark-tx1 mb-1">Delete Contact?</h3>
            <p className="text-sm text-dark-tx3 mb-5">
              <span className="text-dark-tx1 font-medium">{delTarget.name}</span> will be permanently removed from your network. This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDelTarget(null)}
                className="px-4 py-2 text-sm text-dark-tx2 hover:text-dark-tx1 transition-colors">Cancel</button>
              <button onClick={handleDelete}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-status-red text-white hover:opacity-90 transition-opacity">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}