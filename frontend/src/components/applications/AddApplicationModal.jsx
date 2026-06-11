// frontend/src/components/applications/AddApplicationModal.jsx
import { useState } from 'react'
import { X, Link as LinkIcon, Calendar, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUSES  = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected']
const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance']
const STATUS_DOTS = {
  Saved: 'bg-gray-400', Applied: 'bg-blue-500', Assessment: 'bg-purple-500',
  Interview: 'bg-teal-500', Offer: 'bg-green-500', Rejected: 'bg-red-500',
}

const EMPTY = {
  company: '', role: '', jobUrl: '', status: 'Applied',
  dateApplied: new Date().toISOString().slice(0, 10),
  location: '', jobType: 'Internship', priority: 'Medium', salary: '', notes: '',
  contactName: '', contactEmail: '', contactTitle: '', source: 'LinkedIn',
}

// initialData is passed when editing an existing application.
// When absent the modal behaves exactly as before (add mode).
export default function AddApplicationModal({ onClose, onSave, saveError, initialData }) {
  const isEdit = Boolean(initialData)

  const [step, setStep]     = useState(1)
  const [form, setForm]     = useState(isEdit ? { ...EMPTY, ...initialData } : EMPTY)
  const [saving, setSaving] = useState(false)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    await onSave({
      company:     form.company,
      role:        form.role,
      location:    form.location    || undefined,
      status:      form.status,
      priority:    form.priority,
      jobUrl:      form.jobUrl      || undefined,
      jobType:     form.jobType     || undefined,
      salary:      form.salary      || undefined,
      notes:       form.notes       || undefined,
      dateApplied: form.dateApplied || undefined,
    })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Application' : 'Add New Application'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-3 px-7 py-4 border-b border-gray-100 dark:border-gray-800">
          {[{ n: 1, label: 'Job Details' }, { n: 2, label: 'Additional Info' }].map((s) => (
            <button key={s.n} onClick={() => setStep(s.n)}
              className={cn('flex items-center gap-2 text-sm font-medium transition-colors',
                step === s.n ? 'text-gray-900 dark:text-white' : 'text-gray-400')}>
              <span className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                step === s.n
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400')}>
                {s.n}
              </span>
              {s.label}
            </button>
          ))}
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800 mx-2" />
        </div>

        {/* Form */}
        <div className="px-7 py-6 space-y-5">
          {saveError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>
            </div>
          )}

          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Company Name">
                  <input value={form.company} onChange={(e) => set('company', e.target.value)}
                    placeholder="e.g. Google" className={inputCls} />
                </Field>
                <Field label="Job Role">
                  <input value={form.role} onChange={(e) => set('role', e.target.value)}
                    placeholder="e.g. Software Engineer Intern" className={inputCls} />
                </Field>
              </div>

              <Field label="Job URL">
                <div className="relative">
                  <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={form.jobUrl} onChange={(e) => set('jobUrl', e.target.value)}
                    placeholder="Paste job posting URL..." className={cn(inputCls, 'pl-8')} />
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Status">
                  <div className="relative">
                    <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${STATUS_DOTS[form.status]}`} />
                  </div>
                </Field>
                <Field label="Application Date">
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="date" value={form.dateApplied} onChange={(e) => set('dateApplied', e.target.value)}
                      className={cn(inputCls, 'pl-8')} />
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Location">
                  <input value={form.location} onChange={(e) => set('location', e.target.value)}
                    placeholder="e.g. San Francisco, CA" className={inputCls} />
                </Field>
                <Field label="Job Type">
                  <select value={form.jobType} onChange={(e) => set('jobType', e.target.value)} className={inputCls}>
                    {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Priority">
                  <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {['Low', 'Medium', 'High'].map((p) => {
                      const dotColor = p === 'Low' ? 'bg-green-500' : p === 'Medium' ? 'bg-amber-400' : 'bg-red-500'
                      return (
                        <button key={p} type="button" onClick={() => set('priority', p)}
                          className={cn('flex-1 py-2 text-sm flex items-center justify-center gap-1.5 transition-all',
                            form.priority === p
                              ? 'bg-gray-100 dark:bg-gray-700 font-semibold text-gray-900 dark:text-white'
                              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800')}>
                          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                          {p}
                        </button>
                      )
                    })}
                  </div>
                </Field>
                <Field label="Salary / Compensation">
                  <input value={form.salary} onChange={(e) => set('salary', e.target.value)}
                    placeholder="e.g. $120k" className={inputCls} />
                </Field>
              </div>

              <Field label="Notes">
                <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
                  placeholder="Add any notes about this application..."
                  rows={3} className={cn(inputCls, 'resize-none h-auto py-2.5')} />
              </Field>
            </>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Optional — contact details for this application.
              </p>
              <Field label="Contact Name">
                <input value={form.contactName} onChange={(e) => set('contactName', e.target.value)}
                  placeholder="e.g. Sarah Miller" className={inputCls} />
              </Field>
              <Field label="Contact Email">
                <input type="email" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)}
                  placeholder="e.g. sarah@company.com" className={inputCls} />
              </Field>
              <Field label="Contact Title">
                <input value={form.contactTitle} onChange={(e) => set('contactTitle', e.target.value)}
                  placeholder="e.g. Technical Recruiter" className={inputCls} />
              </Field>
              <Field label="Source">
                <select value={form.source} onChange={(e) => set('source', e.target.value)} className={inputCls}>
                  {['LinkedIn', 'Company Website', 'Referral', 'Job Board', 'Other'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-5 border-t border-gray-100 dark:border-gray-800">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <div className="flex gap-3">
            {step === 2 && (
              <button onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                ← Back
              </button>
            )}
            {step === 1 ? (
              <button onClick={() => setStep(2)} disabled={!form.company.trim() || !form.role.trim()}
                className="px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Next →
              </button>
            ) : (
              <button onClick={handleSave} disabled={saving || !form.company.trim() || !form.role.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                {saving
                  ? <><div className="w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" /> Saving…</>
                  : <><Check size={15} /> {isEdit ? 'Save Changes' : 'Save Application'}</>
                }
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const inputCls = 'w-full h-10 px-3.5 rounded-lg border border-gray-200 dark:border-[#252a3a] bg-white dark:bg-[#1a1e2a] text-sm text-gray-800 dark:text-[#e8eaf2] placeholder:text-gray-400 dark:placeholder:text-[#4e5470] focus:outline-none focus:ring-2 focus:ring-[#2f54c8]/20 focus:border-[#2f54c8] transition-all'

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</label>
      {children}
    </div>
  )
}