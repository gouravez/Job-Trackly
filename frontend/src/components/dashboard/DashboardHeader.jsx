export default function DashboardHeader() {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">{greeting}, Alex 👋</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your job search today.</p>
      </div>
      <span className="text-sm text-gray-400 mt-2">{dateStr}</span>
    </div>
  )
}