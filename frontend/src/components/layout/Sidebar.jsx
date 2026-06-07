import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FileText, BarChart2, Settings, Briefcase, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Dashboard',    icon: LayoutDashboard, to: '/dashboard'    },
  {
    label: 'Applications', icon: FileText,         to: '/applications',
    children: [{ label: 'Kanban Board', to: '/kanban' }],
  },
  { label: 'Analytics',    icon: BarChart2,        to: '/analytics'   },
  { label: 'Settings',     icon: Settings,         to: '/settings'    },
]

const USER = { name: 'Jane Doe', email: 'jane@mail.com', initials: 'JD' }

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation()

  return (
    <aside
      className={cn(
        'min-h-screen bg-white border-r border-gray-100 flex-col fixed top-0 left-0 z-30 transition-all duration-300',
        collapsed ? 'w-[60px]' : 'w-[230px]',
        'hidden md:flex',
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center border-b border-gray-100 transition-all',
        collapsed ? 'justify-center py-5' : 'gap-2.5 px-5 py-5',
      )}>
        <div className="w-8 h-8 rounded-lg bg-[#2f54c8] flex items-center justify-center flex-shrink-0">
          <Briefcase size={16} color="white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-gray-900 text-base tracking-tight">AppTrack</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const isParentActive =
            location.pathname.startsWith(item.to) ||
            item.children?.some((c) => location.pathname === c.to)

          return (
            <div key={item.label}>
              <NavLink
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    collapsed && 'justify-center px-0',
                    isActive || isParentActive
                      ? 'bg-[#eef2ff] text-[#2f54c8]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  )
                }
              >
                <item.icon size={18} strokeWidth={1.8} className="flex-shrink-0" />
                {!collapsed && item.label}
              </NavLink>

              {!collapsed && item.children && isParentActive && (
                <div className="ml-9 mt-0.5 space-y-0.5">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.label}
                      to={child.to}
                      className={({ isActive }) =>
                        cn(
                          'block px-3 py-1.5 rounded-lg text-sm transition-all',
                          isActive ? 'text-[#2f54c8] font-semibold' : 'text-gray-500 hover:text-gray-800',
                        )
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="mx-auto mb-2 w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>

      {/* User */}
      <div className={cn('px-3 py-4 border-t border-gray-100', collapsed && 'flex justify-center')}>
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-full bg-[#2f54c8] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {USER.initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{USER.name}</p>
              <p className="text-xs text-gray-500 truncate">{USER.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}