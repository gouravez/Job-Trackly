import useAuthStore from '@/store/authStore'

export default function DashboardHeader() {
  const user = useAuthStore((s) => s.user)
  const displayName = user?.firstName || user?.name?.split(' ')[0] || 'there'
  const now      = new Date()
  const hour     = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const dateStr  = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-[#e8eaf2]">
          {greeting}, {displayName} 👋
        </h1>
        <p className="text-gray-500 dark:text-[#8b91a8] mt-1 text-sm">Here's what's happening with your job search today.</p>
      </div>
      <span className="text-xs sm:text-sm text-gray-400 dark:text-[#4e5470] sm:mt-2">{dateStr}</span>
    </div>
  )
}