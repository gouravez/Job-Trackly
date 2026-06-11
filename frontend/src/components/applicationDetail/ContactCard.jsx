import { Mail } from "lucide-react";

export default function ContactCard() {
  return (
    <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm dark:shadow-none p-6">
      <h3 className="font-bold text-gray-900 dark:text-dark-tx1 mb-4">
        Contact
      </h3>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-dark-border flex items-center justify-center text-xs font-bold text-gray-600 dark:text-dark-tx2 flex-shrink-0">
          SM
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-dark-tx1">
            Sarah Miller
          </p>
          <p className="text-xs text-gray-400 dark:text-dark-tx3">
            Technical Recruiter
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-tx2">
        <Mail size={13} className="text-gray-400 dark:text-dark-tx3" />
        sarah.miller@google.com
      </div>
    </div>
  );
}
