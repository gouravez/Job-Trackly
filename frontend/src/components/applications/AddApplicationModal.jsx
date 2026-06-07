import { useState } from 'react'
import { X, Link as LinkIcon, Calendar, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUSES = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected']
const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance']
const STATUS_DOTS = {
  Saved: 'bg-gray-400', Applied: 'bg-blue-500', Assessment: 'bg-purple-500',
  Interview: 'bg-teal-500', Offer: 'bg-green-500', Rejected: 'bg-red-500',
}

const EMPTY = {
  company: '', role: '', jobUrl: '', status: 'Applied',
  dateApplied: new Date().toISOString().slice(0, 10),
  location: '', jobType: 'Internship', priority: 'Medium', salary: '', notes: '',
}

export default function AddApplicationModal({ onClose, onSave }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(EMPTY)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSave = () => {
    onSave?.(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Add New Application</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-3 px-7 py-4 border-b border-gray-100">
          {[{ n: 1, label: 'Job Details' }, { n: 2, label: 'Additional Info' }].map((s) => (
            <button
              key={s.n}
              onClick={() => setStep(s.n)}
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors',
                step === s.n ? 'text-gray-900' : 'text-gray-400'
              )}
            >
              <span className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                step === s.n ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
              )}>
                {s.n}
              </span>
              {s.label}
            </button>
          ))}
          <div className="flex-1 h-px bg-gray-100 mx-2" />
        </div>

        {/* Form */}
        <div className="px-7 py-6 space-y-5">
          {step === 1 && (
            <>
              {/* Company + Role */}
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

              {/* Job URL */}
              <Field label="Job URL">
                <div className="relative">
                  <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={form.jobUrl} onChange={(e) => set('jobUrl', e.target.value)}
                    placeholder="Paste job posting URL..." className={cn(inputCls, 'pl-8')} />
                </div>
              </Field>

              {/* Status + Date */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Status">
                  <div className="relative">
                    <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${STATUS_DOTS[form.status]}`} />
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

              {/* Location + Job Type */}
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

              {/* Priority + Salary */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Priority">
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                    {['Low', 'Medium', 'High'].map((p) => {
                      const dotColor = p === 'Low' ? 'bg-green-500' : p === 'Medium' ? 'bg-amber-400' : 'bg-red-500'
                      return (
                        <button
                          key={p} type="button"
                          onClick={() => set('priority', p)}
                          className={cn(
                            'flex-1 py-2 text-sm flex items-center justify-center gap-1.5 transition-all',
                            form.priority === p ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-500 hover:bg-gray-50'
                          )}
                        >
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

              {/* Notes */}
              <Field label="Notes">
                <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
                  placeholder="Add any notes about this application..."
                  rows={3} className={cn(inputCls, 'resize-none')} />
              </Field>
            </>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <Field label="Contact Name">
                <input placeholder="e.g. Sarah Miller" className={inputCls} />
              </Field>
              <Field label="Contact Email">
                <input type="email" placeholder="e.g. sarah@company.com" className={inputCls} />
              </Field>
              <Field label="Source">
                <select className={inputCls}>
                  {['LinkedIn', 'Company Website', 'Referral', 'Job Board', 'Other'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Resume Version">
                <input placeholder="e.g. Resume_v3_Google.pdf" className={inputCls} />
              </Field>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-5 border-t border-gray-100">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <div className="flex gap-3">
            {step === 2 && (
              <button onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Back
              </button>
            )}
            {step === 1 ? (
              <button onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                Next →
              </button>
            ) : (
              <button onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                <Check size={15} /> Save Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const inputCls = 'w-full h-10 px-3.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2f54c8]/20 focus:border-[#2f54c8] transition-all'

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      {children}
    </div>
  )
}