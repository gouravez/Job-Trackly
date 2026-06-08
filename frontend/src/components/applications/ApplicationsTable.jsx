import { Link } from 'react-router-dom'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import CompanyAvatar from '@/components/common/CompanyAvatar'
import StatusBadge from '@/components/common/StatusBadge'
import { formatDate } from '@/lib/utils'

const COLUMNS = ['Company', 'Role', 'Location', 'Status', 'Date Applied', 'Priority', 'Actions']

const PRIORITY = {
  High:   { dot: 'bg-red-500',   light: 'text-red-500',   dark: 'dark:text-red-400'   },
  Medium: { dot: 'bg-amber-400', light: 'text-amber-600', dark: 'dark:text-amber-400' },
  Low:    { dot: 'bg-green-500', light: 'text-green-600', dark: 'dark:text-green-400' },
}

export default function ApplicationsTable({ applications, onDelete }) {
  if (applications.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 dark:text-gray-600 text-sm">
        No applications found
      </div>
    )
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          {COLUMNS.map((h) => (
            <th key={h} className="text-left px-5 py-3.5 font-medium">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {applications.map((app) => {
          const p = PRIORITY[app.priority] || PRIORITY.Medium
          return (
            <tr
              key={app.id}
              className="bg-white dark:bg-gray-900 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <CompanyAvatar name={app.company} size="sm" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{app.company}</span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{app.role}</td>
              <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{app.location || '—'}</td>
              <td className="px-5 py-3.5"><StatusBadge status={app.status} /></td>
              <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{formatDate(app.dateApplied)}</td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                  <span className={`text-sm font-medium ${p.light} ${p.dark}`}>{app.priority}</span>
                </div>
              </td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <Link to={`/applications/${app.id}`}>
                    <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><Eye size={15} /></button>
                  </Link>
                  <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => onDelete(app.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}