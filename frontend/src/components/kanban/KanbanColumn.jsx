import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import KanbanCard from './KanbanCard'
import QuickAddForm from './QuickAddForm'

export default function KanbanColumn({ col, cards, isOver, isAdding, onDragOver, onDragLeave, onDrop, onAddCard, onToggleAdd }) {
  return (
    <div className="w-[220px] flex flex-col flex-shrink-0" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <div className={cn(
        'bg-white dark:bg-[#13161e] rounded-xl border border-gray-200 dark:border-[#252a3a] border-t-4 px-3.5 py-3 mb-3 flex items-center justify-between shadow-sm dark:shadow-none',
        col.topBorder
      )}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${col.dot}`} />
          <span className="text-sm font-bold text-gray-800 dark:text-[#e8eaf2]">{col.label}</span>
        </div>
        <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', col.badge)}>
          {cards.length}
        </span>
      </div>

      <div className={cn(
        'flex-1 rounded-xl p-1.5 space-y-2.5 overflow-y-auto transition-all duration-150',
        isOver
          ? 'bg-[#eef2ff] dark:bg-[#0f1a35] ring-2 ring-[#2f54c8]/30 ring-inset'
          : 'bg-gray-50/80 dark:bg-[#13161e]/60',
      )}>
        {isAdding && (
          <QuickAddForm status={col.key} onSave={onAddCard} onCancel={() => onToggleAdd(null)} />
        )}

        {cards.length === 0 && !isAdding && (
          <div className="flex items-center justify-center h-20 text-xs text-gray-300 dark:text-[#252a3a] italic">
            No applications
          </div>
        )}

        {cards.map((app) => <KanbanCard key={app.id} app={app} />)}
      </div>

      <button
        onClick={() => onToggleAdd(isAdding ? null : col.key)}
        className={cn(
          'mt-2.5 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-xl border border-dashed transition-all',
          isAdding
            ? 'border-[#2f54c8] text-[#2f54c8] dark:text-[#6b8ef5] bg-[#eef2ff] dark:bg-[#0f1a35]'
            : 'border-gray-200 dark:border-[#252a3a] text-gray-400 dark:text-[#4e5470] hover:text-[#2f54c8] dark:hover:text-[#6b8ef5] hover:border-[#2f54c8] dark:hover:border-[#2f54c8] hover:bg-white dark:hover:bg-[#13161e]'
        )}
      >
        <Plus size={12} />
        {isAdding ? 'Cancel' : 'Add card'}
      </button>
    </div>
  )
}