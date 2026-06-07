import { Mail } from 'lucide-react'

export default function ContactCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-bold text-gray-900 mb-4">Contact</h3>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
          SM
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Sarah Miller</p>
          <p className="text-xs text-gray-400">Technical Recruiter</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Mail size={13} className="text-gray-400" />
        sarah.miller@google.com
      </div>
    </div>
  )
}