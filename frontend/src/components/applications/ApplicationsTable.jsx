import { Link } from 'react-router-dom'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import CompanyAvatar from '@/components/common/CompanyAvatar'
import StatusBadge from '@/components/common/StatusBadge'
import { PRIORITY_COLORS } from '@/lib/mockData'

const COLUMNS = ['Company', 'Role', 'Location', 'Status', 'Date Applied', 'Priority', 'Actions']

export default function ApplicationsTable({ applications, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
            {COLUMNS.map((h) => (
              <th key={h} className="text-left px-5 py-3.5 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => {
            const p = PRIORITY_COLORS[app.priority]
            return (
              <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <CompanyAvatar name={app.company} size="sm" />
                    <span className="text-sm font-semibold text-gray-900">{app.company}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{app.role}</td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{app.location}</td>
                <td className="px-5 py-3.5"><StatusBadge status={app.status} /></td>
                <td className="px-5 py-3.5 text-sm text-gray-500">{app.dateApplied}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                    <span className={`text-sm font-medium ${p.text}`}>{app.priority}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Link to={`/applications/${app.id}`}>
                      <button className="text-gray-400 hover:text-gray-700 transition-colors">
                        <Eye size={15} />
                      </button>
                    </Link>
                    <button className="text-gray-400 hover:text-gray-700 transition-colors">
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(app.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}