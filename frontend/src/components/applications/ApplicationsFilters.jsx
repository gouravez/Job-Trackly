import { Search, SlidersHorizontal, ArrowUpDown, Calendar, LayoutGrid, Table2 } from 'lucide-react'
import FilterDropdown from '@/components/common/FilterDropdown'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS = ['All', 'Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected']
const SORT_OPTIONS   = ['Date Applied', 'Company A-Z', 'Priority']
const DATE_OPTIONS   = ['Last 7 days', 'Last 30 days', 'Last 3 months', 'All time']

export default function ApplicationsFilters({ search, onSearch, statusFilter, onStatusFilter }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[240px]">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#4e5470]" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by company, role, or location"
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 dark:border-[#252a3a] bg-white dark:bg-[#13161e] text-sm text-gray-800 dark:text-[#e8eaf2] placeholder:text-gray-400 dark:placeholder:text-[#4e5470] focus:outline-none focus:ring-2 focus:ring-[#2f54c8]/20 focus:border-[#2f54c8] transition-all"
        />
      </div>

      <FilterDropdown icon={SlidersHorizontal} label={`Status: ${statusFilter}`}>
        {STATUS_OPTIONS.map((s) => (
          <button key={s} onClick={() => onStatusFilter(s)}
            className={cn('block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#1f2436] transition-colors',
              statusFilter === s ? 'text-[#2f54c8] dark:text-[#6b8ef5] font-semibold' : 'text-gray-700 dark:text-[#8b91a8]')}>
            {s}
          </button>
        ))}
      </FilterDropdown>

      <FilterDropdown icon={ArrowUpDown} label="Sort: Date Applied">
        {SORT_OPTIONS.map((s) => (
          <button key={s} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-[#8b91a8] hover:bg-gray-50 dark:hover:bg-[#1f2436]">{s}</button>
        ))}
      </FilterDropdown>

      <FilterDropdown icon={Calendar} label="Date Range">
        {DATE_OPTIONS.map((s) => (
          <button key={s} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-[#8b91a8] hover:bg-gray-50 dark:hover:bg-[#1f2436]">{s}</button>
        ))}
      </FilterDropdown>

      <div className="flex items-center border border-gray-200 dark:border-[#252a3a] rounded-xl overflow-hidden">
        <button className="flex items-center gap-1.5 px-3 py-2 bg-[#2f54c8] text-white text-sm font-medium">
          <Table2 size={15} /> Table
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 text-gray-500 dark:text-[#4e5470] text-sm hover:bg-gray-50 dark:hover:bg-[#1a1e2a]">
          <LayoutGrid size={15} />
        </button>
      </div>
    </div>
  )
}