import { useState } from 'react'
import { MoreHorizontal, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

const PRIORITY_STYLES = {
  High:   'bg-red-50 text-red-500 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  Medium: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
  Low:    'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
}

function Avatar({ name }) {
  const palettes = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
    'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
    'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
    'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  ]
  const idx = (name?.charCodeAt(0) || 0) % palettes.length
  return (
    <div className={`w-7 h-7 rounded-full ${palettes[idx]} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
      {(name || '??').slice(0, 2).toUpperCase()}
    </div>
  )
}

export default function KanbanCard({ app }) {
  const [dragging, setDragging] = useState(false)
  const hasInterview = app.status === 'Interview'
  const dateShort = app.dateApplied?.slice(0, 6)

  return (
    <div
      draggable
      onDragStart={(e) => { e.dataTransfer.setData('cardId', app.id); setDragging(true) }}
      onDragEnd={() => setDragging(false)}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3.5 shadow-sm',
        'hover:shadow-md hover:-translate-y-0.5 transition-all duration-150',
        'cursor-grab active:cursor-grabbing group',
        dragging && 'opacity-40 rotate-1 scale-95',
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar name={app.company} />
          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{app.company}</p>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ml-1 flex-shrink-0">
          <MoreHorizontal size={14} />
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-snug">{app.role}</p>

      {hasInterview && (
        <div className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 rounded-lg px-2.5 py-1.5 mb-2.5 border border-teal-100 dark:border-teal-800">
          <Calendar size={11} />
          <span className="font-medium">Interview</span>
          <span className="text-teal-400 dark:text-teal-500">Mar 08</span>
        </div>
      )}

      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-400 dark:text-gray-500">{dateShort}</span>
        <span className={cn('text-xs font-semibold px-2.5 py-0.5 rounded-full border', PRIORITY_STYLES[app.priority])}>
          {app.priority}
        </span>
      </div>
    </div>
  )
}