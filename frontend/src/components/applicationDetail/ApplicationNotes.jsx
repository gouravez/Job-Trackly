import { Pencil } from "lucide-react";

export default function ApplicationNotes() {
  return (
    <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm dark:shadow-none p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-dark-tx1">Notes</h3>
        <button className="text-gray-400 dark:text-dark-tx3 hover:text-gray-700 dark:hover:text-dark-tx1 transition-colors">
          <Pencil size={15} />
        </button>
      </div>
      <div className="bg-gray-50 dark:bg-dark-s2 rounded-xl p-4">
        <p className="text-sm text-gray-700 dark:text-dark-tx2 leading-relaxed">
          Recruiter mentioned the team works heavily with distributed systems.
          Prepare for system design questions and review past projects. Follow
          up with thank-you email after the interview.
        </p>
      </div>
      <p className="text-xs text-gray-400 dark:text-dark-tx3 mt-3">
        Last edited May 14, 2025 · 3:42 PM
      </p>
    </div>
  );
}
