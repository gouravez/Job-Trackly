import { useState } from 'react'

export default function FilterDropdown({ icon: Icon, label, children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-10 px-3.5 rounded-xl border border-gray-200 dark:border-[#252a3a] bg-white dark:bg-[#13161e] text-sm text-gray-600 dark:text-[#8b91a8] hover:bg-gray-50 dark:hover:bg-[#1a1e2a] transition-colors"
      >
        <Icon size={14} />
        {label}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 8L1 3h10z" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 bg-white dark:bg-[#1a1e2a] border border-gray-200 dark:border-[#252a3a] rounded-xl shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-20 py-1 min-w-[160px]">
            {children}
          </div>
        </>
      )}
    </div>
  )
}