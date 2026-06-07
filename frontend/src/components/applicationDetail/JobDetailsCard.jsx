import { MapPin, Briefcase, DollarSign, Globe } from 'lucide-react'

export default function JobDetailsCard({ location }) {
  const details = [
    { icon: MapPin,     label: 'Location',   value: location || 'Mountain View, CA' },
    { icon: Briefcase,  label: 'Job Type',   value: 'Internship'                    },
    { icon: DollarSign, label: 'Salary Range',value: '$25-30/hr'                   },
    { icon: Globe,      label: 'Source',     value: 'LinkedIn'                      },
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-bold text-gray-900 mb-4">Job Details</h3>
      <div className="space-y-3">
        {details.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-2 text-gray-400">
              <Icon size={14} />
              <span className="text-sm text-gray-500">{label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-800">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}