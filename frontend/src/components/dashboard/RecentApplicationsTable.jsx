import { Link } from 'react-router-dom'
import { Eye, Pencil, Plus } from 'lucide-react'
import CompanyAvatar from '@/components/common/CompanyAvatar'
import StatusBadge from '@/components/common/StatusBadge'
import useAppStore from '@/store/appStore'

export default function RecentApplicationsTable() {
  const applications = useAppStore((s) => s.applications)
  const recent = applications.slice(0, 5)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-50 dark:border-gray-800">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Recent Applications</h3>
        <Link to="/applications">
          <button className="flex items-center gap-1.5 text-sm text-[#2f54c8] dark:text-[#7b9ef8] font-medium hover:underline">
            <Plus size={15} /> New
          </button>
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide border-b border-gray-50 dark:border-gray-800">
              {['Company', 'Role', 'Status', 'Date Applied', 'Actions'].map((h) => (
                <th key={h} className="text-left px-6 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((app) => (
              <tr key={app.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <CompanyAvatar name={app.company} size="sm" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{app.company}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{app.role}</td>
                <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{app.dateApplied}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link to={`/applications/${app.id}`}>
                      <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><Eye size={15} /></button>
                    </Link>
                    <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><Pencil size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y divide-gray-50 dark:divide-gray-800">
        {recent.map((app) => (
          <div key={app.id} className="flex items-center justify-between px-4 py-3 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <CompanyAvatar name={app.company} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{app.company}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{app.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <StatusBadge status={app.status} />
              <Link to={`/applications/${app.id}`}><Eye size={14} className="text-gray-400" /></Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}