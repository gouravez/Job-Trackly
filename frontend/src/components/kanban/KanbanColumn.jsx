import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import KanbanCard from './KanbanCard'
import QuickAddForm from './QuickAddForm'

export default function KanbanColumn({ col, cards, isOver, isAdding, onDragOver, onDragLeave, onDrop, onAddCard, onToggleAdd }) {
  return (
    <div
      className="w-[220px] flex flex-col flex-shrink-0"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Header */}
      <div className={cn(
        'bg-white rounded-xl border border-gray-200 border-t-4 px-3.5 py-3 mb-3 flex items-center justify-between shadow-sm',
        col.topBorder
      )}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${col.dot}`} />
          <span className="text-sm font-bold text-gray-800">{col.label}</span>
        </div>
        <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', col.badge)}>
          {cards.length}
        </span>
      </div>

      {/* Drop zone */}
      <div className={cn(
        'flex-1 rounded-xl p-1.5 space-y-2.5 overflow-y-auto transition-all duration-150',
        isOver ? 'bg-[#eef2ff] ring-2 ring-[#2f54c8]/30 ring-inset' : col.colBg,
      )}>
        {isAdding && (
          <QuickAddForm
            status={col.key}
            onSave={onAddCard}
            onCancel={() => onToggleAdd(null)}
          />
        )}

        {cards.length === 0 && !isAdding && (
          <div className="flex items-center justify-center h-20 text-xs text-gray-300 italic">
            No applications
          </div>
        )}

        {cards.map((app) => (
          <KanbanCard key={app.id} app={app} />
        ))}
      </div>

      {/* Add card button */}
      <button
        onClick={() => onToggleAdd(isAdding ? null : col.key)}
        className={cn(
          'mt-2.5 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-xl border border-dashed transition-all',
          isAdding
            ? 'border-[#2f54c8] text-[#2f54c8] bg-[#eef2ff]'
            : 'border-gray-200 text-gray-400 hover:text-[#2f54c8] hover:border-[#2f54c8] hover:bg-white'
        )}
      >
        <Plus size={12} />
        {isAdding ? 'Cancel' : 'Add card'}
      </button>
    </div>
  )
}