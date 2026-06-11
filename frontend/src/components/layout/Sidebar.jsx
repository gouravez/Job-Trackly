import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  Settings,
  CalendarDays,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/authStore";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  {
    label: "Applications",
    icon: FileText,
    to: "/applications",
    children: [{ label: "Kanban Board", to: "/kanban" }],
  },
  { label: "Calendar", icon: CalendarDays, to: "/calendar" },
  { label: "Analytics", icon: BarChart2, to: "/analytics" },
  { label: "Settings", icon: Settings, to: "/settings" },
];
export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/signin", { replace: true });
  };
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      "U"
    : "U";
  const displayName = user ? `${user.firstName} ${user.lastName}` : "User";
  const displayEmail = user?.email || "";

  return (
    <aside
      className={cn(
        "min-h-screen flex-col fixed top-0 left-0 z-30 transition-all duration-300",
        "bg-white dark:bg-dark-s1 border-r border-gray-100 dark:border-dark-border",
        collapsed ? "w-[60px]" : "w-[230px]",
        "hidden md:flex",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center border-b border-gray-100 dark:border-dark-border transition-all",
          collapsed ? "justify-center py-5" : "gap-2.5 px-5 py-5",
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-dark-accent flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(47,84,200,0.35)] dark:shadow-[0_0_16px_rgba(47,84,200,0.4)]">
          <Briefcase size={16} color="white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-gray-900 dark:text-dark-tx1 text-base tracking-tight">
            Job Trackly
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const isParentActive =
            location.pathname.startsWith(item.to) ||
            item.children?.some((c) => location.pathname === c.to);

          return (
            <div key={item.label}>
              <NavLink
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    collapsed && "justify-center px-0",
                    isActive || isParentActive
                      ? "bg-dark-accent-bg dark:bg-dark-s4 text-dark-accent dark:text-dark-accent3"
                      : "text-gray-600 dark:text-dark-tx2 hover:bg-gray-50 dark:hover:bg-dark-s2 hover:text-gray-900 dark:hover:text-dark-tx1",
                  )
                }
              >
                <item.icon
                  size={18}
                  strokeWidth={1.8}
                  className="flex-shrink-0"
                />
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
                          "block px-3 py-1.5 rounded-lg text-sm transition-all",
                          isActive
                            ? "text-dark-accent dark:text-dark-accent3 font-semibold"
                            : "text-gray-500 dark:text-dark-tx3 hover:text-gray-800 dark:hover:text-dark-tx2",
                        )
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="mx-auto mb-2 w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 dark:border-dark-border text-gray-400 dark:text-dark-tx3 hover:bg-gray-50 dark:hover:bg-dark-s2 hover:text-gray-700 dark:hover:text-dark-tx2 transition-colors"
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>

      {/* User */}
      <div
        className={cn(
          "px-3 py-4 border-t border-gray-100 dark:border-dark-border",
          collapsed && "flex justify-center",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center",
          )}
        >
          <div className="w-8 h-8 rounded-full bg-dark-s4 dark:bg-dark-s4 border border-dark-accent/40 flex items-center justify-center text-dark-accent3 text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-dark-tx1 truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-tx3 truncate">
                {displayEmail}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              title="Sign out"
              className="text-gray-400 dark:text-dark-tx3 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={handleLogout}
            title="Sign out"
            className="mt-2 text-gray-400 dark:text-dark-tx3 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
