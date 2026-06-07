import { Link } from 'react-router-dom'
import { Eye, Pencil, Plus } from 'lucide-react'
import CompanyAvatar from '@/components/common/CompanyAvatar'
import StatusBadge from '@/components/common/StatusBadge'
import useAppStore from '@/store/appStore'

export default function RecentApplicationsTable() {
  const applications = useAppStore((s) => s.applications)
  const recent = applications.slice(0, 5)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-50">
        <h3 className="font-bold text-gray-900 text-sm sm:text-base">Recent Applications</h3>
        <Link to="/applications">
          <button className="flex items-center gap-1.5 text-sm text-[#2f54c8] font-medium hover:underline">
            <Plus size={15} /> New
          </button>
        </Link>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-50">
              <th className="text-left px-6 py-3 font-medium">Company</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Date Applied</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((app) => (
              <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <CompanyAvatar name={app.company} size="sm" />
                    <span className="text-sm font-semibold text-gray-900">{app.company}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{app.role}</td>
                <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                <td className="px-4 py-3 text-sm text-gray-500">{app.dateApplied}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link to={`/applications/${app.id}`}>
                      <button className="text-gray-400 hover:text-gray-700 transition-colors"><Eye size={15} /></button>
                    </Link>
                    <button className="text-gray-400 hover:text-gray-700 transition-colors"><Pencil size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden divide-y divide-gray-50">
        {recent.map((app) => (
          <div key={app.id} className="flex items-center justify-between px-4 py-3 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <CompanyAvatar name={app.company} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{app.company}</p>
                <p className="text-xs text-gray-400 truncate">{app.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <StatusBadge status={app.status} />
              <Link to={`/applications/${app.id}`}>
                <Eye size={14} className="text-gray-400" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}