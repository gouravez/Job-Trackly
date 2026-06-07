import { useState } from 'react'
import { Plus } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ApplicationsFilters from '@/components/applications/ApplicationsFilters'
import ApplicationsTable from '@/components/applications/ApplicationsTable'
import ApplicationsPagination from '@/components/applications/ApplicationsPagination'
import AddApplicationModal from '@/components/applications/AddApplicationModal'
import useAppStore from '@/store/appStore'

const ROWS_PER_PAGE = 8

export default function ApplicationsPage() {
  const { applications, addApplication, deleteApplication } = useAppStore()

  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showModal, setShowModal]       = useState(false)
  const [page, setPage]                 = useState(1)

  const filtered = applications.filter((a) => {
    const q = search.toLowerCase()
    const matchesSearch =
      a.company.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q)
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE)
  const paginated  = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  const handleSearch = (val) => { setSearch(val); setPage(1) }
  const handleStatusFilter = (val) => { setStatusFilter(val); setPage(1) }

  const handleSave = (form) => {
    addApplication({
      ...form,
      id: Date.now(),
      company: form.company || 'New Company',
      role: form.role || 'Unknown Role',
    })
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">My Applications</h1>
            <p className="text-gray-400 mt-0.5 text-sm">{filtered.length} Applications</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gray-900 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Application</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Filters */}
        <ApplicationsFilters
          search={search}
          onSearch={handleSearch}
          statusFilter={statusFilter}
          onStatusFilter={handleStatusFilter}
        />

        {/* Table + Pagination */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <ApplicationsTable applications={paginated} onDelete={deleteApplication} />
          <ApplicationsPagination
            page={page}
            totalPages={totalPages}
            filtered={filtered}
            ROWS_PER_PAGE={ROWS_PER_PAGE}
            setPage={setPage}
          />
        </div>
      </div>

      {showModal && (
        <AddApplicationModal onClose={() => setShowModal(false)} onSave={handleSave} />
      )}
    </DashboardLayout>
  )
}