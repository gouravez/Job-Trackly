import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import KanbanHeader from '@/components/kanban/KanbanHeader'
import KanbanColumn from '@/components/kanban/KanbanColumn'
import useAppStore from '@/store/appStore'

const COLUMNS = [
  { key: 'Saved',      label: 'Saved',      dot: 'bg-gray-400',   topBorder: 'border-t-gray-300',   badge: 'bg-gray-100 text-gray-500',    colBg: 'bg-gray-50'      },
  { key: 'Applied',    label: 'Applied',    dot: 'bg-blue-500',   topBorder: 'border-t-blue-500',   badge: 'bg-blue-50 text-blue-600',     colBg: 'bg-blue-50/30'   },
  { key: 'Assessment', label: 'Assessment', dot: 'bg-purple-500', topBorder: 'border-t-purple-500', badge: 'bg-purple-50 text-purple-600', colBg: 'bg-purple-50/30' },
  { key: 'Interview',  label: 'Interview',  dot: 'bg-teal-500',   topBorder: 'border-t-teal-500',   badge: 'bg-teal-50 text-teal-600',     colBg: 'bg-teal-50/30'   },
  { key: 'Offer',      label: 'Offer',      dot: 'bg-green-500',  topBorder: 'border-t-green-500',  badge: 'bg-green-50 text-green-600',   colBg: 'bg-green-50/20'  },
  { key: 'Rejected',   label: 'Rejected',   dot: 'bg-red-500',    topBorder: 'border-t-red-500',    badge: 'bg-red-50 text-red-500',       colBg: 'bg-red-50/20'    },
]

export default function KanbanPage() {
  const { applications, addApplication, moveApplication } = useAppStore()

  const [search, setSearch]     = useState('')
  const [dragOver, setDragOver] = useState(null)
  const [addingTo, setAddingTo] = useState(null)

  const filtered = applications.filter((a) => {
    const q = search.toLowerCase()
    return a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)
  })

  const byStatus = (status) => filtered.filter((a) => a.status === status)

  const handleDrop = (e, colKey) => {
    e.preventDefault()
    moveApplication(e.dataTransfer.getData('cardId'), colKey)
    setDragOver(null)
  }

  const handleAddCard = (newCard) => {
    addApplication(newCard)
    setAddingTo(null)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen overflow-hidden">
        <KanbanHeader search={search} onSearch={setSearch} />

        <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 sm:px-8 pb-4 sm:pb-8">
          <div className="flex gap-3 sm:gap-4 h-full" style={{ minWidth: 'max-content' }}>
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.key}
                col={col}
                cards={byStatus(col.key)}
                isOver={dragOver === col.key}
                isAdding={addingTo === col.key}
                onDragOver={(e) => { e.preventDefault(); setDragOver(col.key) }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => handleDrop(e, col.key)}
                onAddCard={handleAddCard}
                onToggleAdd={setAddingTo}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}