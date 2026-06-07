export default function CompanyAvatar({ name, color, size = 'md' }) {
  const initials = name?.slice(0, 2).toUpperCase() || '??'
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  }
  // Generate a consistent pastel bg from name
  const pastelColors = [
    'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700',
    'bg-rose-100 text-rose-700', 'bg-amber-100 text-amber-700',
    'bg-green-100 text-green-700', 'bg-teal-100 text-teal-700',
    'bg-indigo-100 text-indigo-700', 'bg-pink-100 text-pink-700',
  ]
  const idx = name?.charCodeAt(0) % pastelColors.length || 0

  return (
    <div className={`${sizes[size]} rounded-full ${pastelColors[idx]} flex items-center justify-center font-bold flex-shrink-0`}>
      {initials}
    </div>
  )
}