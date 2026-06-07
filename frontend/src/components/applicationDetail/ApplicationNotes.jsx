import { Pencil } from 'lucide-react'

export default function ApplicationNotes() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Notes</h3>
        <button className="text-gray-400 hover:text-gray-700 transition-colors">
          <Pencil size={15} />
        </button>
      </div>
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          Recruiter mentioned the team works heavily with distributed systems. Prepare for system design questions
          and review past projects. Follow up with thank-you email after the interview.
        </p>
      </div>
      <p className="text-xs text-gray-400 mt-3">Last edited May 14, 2025 · 3:42 PM</p>
    </div>
  )
}