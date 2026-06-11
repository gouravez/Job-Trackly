import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ApplicationsPagination({ page, totalPages, filtered, ROWS_PER_PAGE, setPage }) {
  if (filtered.length === 0) return null

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50 dark:border-[#1f2436] bg-white dark:bg-[#13161e]">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#8b91a8]">
        Rows per page
        <select className="border border-gray-200 dark:border-[#252a3a] bg-white dark:bg-[#1a1e2a] text-gray-700 dark:text-[#8b91a8] rounded-lg px-2 py-1 text-sm ml-1 focus:outline-none">
          <option>8</option><option>16</option><option>32</option>
        </select>
      </div>

      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-[#8b91a8]">
        <span>{(page - 1) * ROWS_PER_PAGE + 1}–{Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length}</span>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
          className="ml-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1e2a] disabled:opacity-40 transition-colors">
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
          <button key={n} onClick={() => setPage(n)}
            className={cn('w-8 h-8 rounded-lg text-sm font-medium transition-colors',
              page === n
                ? 'bg-[#2f54c8] text-white'
                : 'hover:bg-gray-100 dark:hover:bg-[#1a1e2a] text-gray-600 dark:text-[#8b91a8]')}>
            {n}
          </button>
        ))}
        {totalPages > 5 && <span className="px-1">…</span>}
        {totalPages > 5 && (
          <button onClick={() => setPage(totalPages)}
            className={cn('w-8 h-8 rounded-lg text-sm font-medium transition-colors',
              page === totalPages
                ? 'bg-[#2f54c8] text-white'
                : 'hover:bg-gray-100 dark:hover:bg-[#1a1e2a] text-gray-600 dark:text-[#8b91a8]')}>
            {totalPages}
          </button>
        )}
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1e2a] disabled:opacity-40 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}