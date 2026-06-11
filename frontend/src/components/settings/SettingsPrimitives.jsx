// frontend/src/components/settings/SettingsPrimitives.jsx
// Shared building blocks used by every settings section.
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SettingsInput({ label, type = 'text', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      )}
      <input
        type={type}
        className="w-full h-10 px-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2f54c8]/20 focus:border-[#2f54c8] focus:bg-white dark:focus:bg-gray-700 transition-all"
        {...props}
      />
    </div>
  )
}

export function SettingsCard({ title, description, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-800">
        <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
        {description && (
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  )
}

export function SaveButton({ saved, loading, onClick, label = 'Save Changes' }) {
  return (
    <div className="flex justify-end pt-2">
      <button
        onClick={onClick}
        disabled={loading}
        className={cn(
          'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60',
          saved ? 'bg-green-500 text-white' : 'bg-[#2f54c8] hover:bg-[#2645b0] text-white'
        )}
      >
        {loading
          ? <Loader2 size={14} className="animate-spin" />
          : saved
            ? <><Check size={14} /> Saved!</>
            : label}
      </button>
    </div>
  )
}

export function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
        {description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative flex-shrink-0 w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2f54c8]/30',
          checked ? 'bg-[#2f54c8]' : 'bg-gray-200 dark:bg-gray-700'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  )
}