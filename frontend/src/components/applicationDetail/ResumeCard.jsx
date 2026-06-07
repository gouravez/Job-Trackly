import { FileText, Download } from 'lucide-react'

export default function ResumeCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-bold text-gray-900 mb-4">Resume Version</h3>
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <FileText size={14} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 truncate max-w-[120px]">Resume_v3_Goog...</p>
            <p className="text-xs text-gray-400">248 KB</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-700 transition-colors">
          <Download size={15} />
        </button>
      </div>
    </div>
  )
}