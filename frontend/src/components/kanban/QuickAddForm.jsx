import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function QuickAddForm({ status, onSave, onCancel }) {
  const [company, setCompany]   = useState('')
  const [role, setRole]         = useState('')
  const [priority, setPriority] = useState('Medium')

  const handleSave = () => {
    if (!company.trim()) return
    onSave({
      id: Date.now(),
      company: company.trim(),
      role: role.trim() || 'Unspecified Role',
      status,
      priority,
      location: '',
      dateApplied: new Date().toLocaleDateString('en-US', {
        month: 'short', day: '2-digit', year: 'numeric',
      }),
    })
  }

  const handleKey = (e) => {
    if (e.key === 'Enter')  handleSave()
    if (e.key === 'Escape') onCancel()
  }

  const PRIORITY_COLORS = {
    Low:    { active: 'bg-green-500 text-white border-green-500',  idle: 'bg-green-50 text-green-600 border-green-100' },
    Medium: { active: 'bg-amber-400 text-white border-amber-400',  idle: 'bg-amber-50 text-amber-600 border-amber-100' },
    High:   { active: 'bg-red-500 text-white border-red-500',      idle: 'bg-red-50 text-red-500 border-red-100' },
  }

  return (
    <div className="bg-white rounded-xl border-2 border-[#2f54c8] shadow-md p-3 space-y-2.5">
      <input
        autoFocus
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Company name *"
        className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2f54c8]/20 focus:border-[#2f54c8] transition-all"
      />

      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Job role"
        className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2f54c8]/20 focus:border-[#2f54c8] transition-all"
      />

      <div className="flex gap-1.5">
        {['Low', 'Medium', 'High'].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(p)}
            className={cn(
              'flex-1 text-xs font-semibold py-1 rounded-lg border transition-all',
              priority === p ? PRIORITY_COLORS[p].active : PRIORITY_COLORS[p].idle
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex gap-2 pt-0.5">
        <button
          onClick={handleSave}
          disabled={!company.trim()}
          className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg bg-[#2f54c8] text-white text-xs font-semibold hover:bg-[#2645b0] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Check size={13} /> Add Card
        </button>
        <button
          onClick={onCancel}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  )
}