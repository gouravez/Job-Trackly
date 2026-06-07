import { Search, SlidersHorizontal } from 'lucide-react'

export default function KanbanHeader({ search, onSearch }) {
  return (
    <div className="px-8 pt-8 pb-5 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Kanban Board</h1>
          <p className="text-gray-400 mt-0.5 text-sm">Drag and drop to update application status</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search applications..."
              className="pl-9 pr-4 h-10 w-56 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2f54c8]/20 focus:border-[#2f54c8] shadow-sm transition-all"
            />
          </div>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 shadow-sm transition-colors">
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}