const HISTORY = [
  { text: 'Status changed to Interview', date: 'May 15, 2025', dot: 'bg-teal-500'   },
  { text: 'Assessment completed',        date: 'May 8, 2025',  dot: 'bg-purple-500' },
  { text: 'Application submitted',       date: 'May 1, 2025',  dot: 'bg-blue-500'   },
  { text: 'Job saved',                   date: 'Apr 24, 2025', dot: 'bg-gray-400'   },
]

export default function ActivityHistory() {
  return (
    <div className="bg-white dark:bg-[#13161e] rounded-2xl border border-gray-100 dark:border-[#252a3a] shadow-sm dark:shadow-none p-6">
      <h3 className="font-bold text-gray-900 dark:text-[#e8eaf2] mb-4">Activity History</h3>
      <div className="space-y-3">
        {HISTORY.map((a, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className={`w-2 h-2 rounded-full ${a.dot} mt-1.5 flex-shrink-0`} />
            <div>
              <p className="text-sm text-gray-700 dark:text-[#8b91a8]">{a.text}</p>
              <p className="text-xs text-gray-400 dark:text-[#4e5470]">{a.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}