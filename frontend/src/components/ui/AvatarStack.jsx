export default function AvatarStack({ count = '2,400+', label = 'students staying organized' }) {
  const colors = ['bg-amber-400', 'bg-sky-400', 'bg-rose-400', 'bg-emerald-400']
  const initials = ['J', 'M', 'A', 'S']

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {colors.map((color, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
          >
            {initials[i]}
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-600">
        Join <span className="font-semibold text-gray-900">{count}</span> {label}
      </p>
    </div>
  )
}
