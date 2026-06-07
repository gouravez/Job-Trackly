const FUNNEL = [
  { stage: 'Applied',    count: 84, drop: '78.6% drop-off', color: '#2f54c8', width: '100%' },
  { stage: 'Assessment', count: 18, drop: '33.3% drop-off', color: '#14b8a6', width: '58%'  },
  { stage: 'Interview',  count: 12, drop: '75% drop-off',   color: '#3b82f6', width: '38%'  },
  { stage: 'Offer',      count: 3,  drop: null,              color: '#22c55e', width: '18%'  },
]

export default function ApplicationFunnel() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-bold text-gray-900 mb-5">Application Funnel</h3>
      <div className="space-y-1">
        {FUNNEL.map((f) => (
          <div key={f.stage}>
            <div
              className="flex items-center justify-between text-white text-sm font-semibold px-4 py-3 rounded-xl"
              style={{ backgroundColor: f.color, width: f.width }}
            >
              <span>{f.stage}</span>
              <span>{f.count}</span>
            </div>
            {f.drop && (
              <p className="text-xs text-gray-400 text-center py-1.5">down {f.drop}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}