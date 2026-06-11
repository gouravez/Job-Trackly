import { Mail } from 'lucide-react'

export default function ContactCard() {
  return (
    <div className="bg-white dark:bg-[#13161e] rounded-2xl border border-gray-100 dark:border-[#252a3a] shadow-sm dark:shadow-none p-6">
      <h3 className="font-bold text-gray-900 dark:text-[#e8eaf2] mb-4">Contact</h3>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-[#252a3a] flex items-center justify-center text-xs font-bold text-gray-600 dark:text-[#8b91a8] flex-shrink-0">
          SM
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-[#e8eaf2]">Sarah Miller</p>
          <p className="text-xs text-gray-400 dark:text-[#4e5470]">Technical Recruiter</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#8b91a8]">
        <Mail size={13} className="text-gray-400 dark:text-[#4e5470]" />
        sarah.miller@google.com
      </div>
    </div>
  )
}