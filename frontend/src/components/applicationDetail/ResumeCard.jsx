import { FileText, Download } from "lucide-react";

export default function ResumeCard() {
  return (
    <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm dark:shadow-none p-6">
      <h3 className="font-bold text-gray-900 dark:text-dark-tx1 mb-4">
        Resume Version
      </h3>
      <div className="flex items-center justify-between bg-gray-50 dark:bg-dark-s2 rounded-xl p-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText size={14} className="text-red-500 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-tx1 truncate max-w-[120px]">
              Resume_v3_Goog...
            </p>
            <p className="text-xs text-gray-400 dark:text-dark-tx3">248 KB</p>
          </div>
        </div>
        <button className="text-gray-400 dark:text-dark-tx3 hover:text-gray-700 dark:hover:text-dark-tx1 transition-colors">
          <Download size={15} />
        </button>
      </div>
    </div>
  );
}
