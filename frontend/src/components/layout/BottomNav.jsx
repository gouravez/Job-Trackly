import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, Kanban, BarChart2, Settings,CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Home',     icon: LayoutDashboard, to: '/dashboard'    },
  { label: 'Apps',     icon: FileText,         to: '/applications' },
  { label: 'Calendar', icon: CalendarDays,     to: '/calendar'     },
  { label: 'Stats',    icon: BarChart2,        to: '/analytics'    },
  { label: 'Settings', icon: Settings,         to: '/settings'     },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#13161e] border-t border-gray-100 dark:border-[#252a3a] flex items-center justify-around px-2 pb-safe">
      {NAV.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) => cn(
            'flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl text-xs font-medium transition-colors',
            isActive
              ? 'text-[#2f54c8] dark:text-[#6b8ef5]'
              : 'text-gray-400 dark:text-[#4e5470]',
          )}
        >
          <item.icon size={20} strokeWidth={1.8} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}