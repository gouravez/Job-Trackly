import { Mail, Briefcase, UserRound } from "lucide-react";

function initialsOf(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function ContactCard({ contactName, contactEmail, contactTitle }) {
  const hasContact = contactName || contactEmail || contactTitle;

  return (
    <div className="bg-white dark:bg-dark-s1 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm dark:shadow-none p-6">
      <h3 className="font-bold text-gray-900 dark:text-dark-tx1 mb-4">
        Contact
      </h3>

      {!hasContact ? (
        <div className="flex flex-col items-center text-center py-4 gap-2">
          <UserRound size={20} className="text-gray-300 dark:text-dark-tx3" />
          <p className="text-xs text-gray-400 dark:text-dark-tx3">
            No contact saved for this application yet.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-dark-border flex items-center justify-center text-xs font-bold text-gray-600 dark:text-dark-tx2 flex-shrink-0">
              {initialsOf(contactName)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-dark-tx1 truncate">
                {contactName || "Unnamed contact"}
              </p>
              {contactTitle && (
                <p className="text-xs text-gray-400 dark:text-dark-tx3 truncate flex items-center gap-1">
                  <Briefcase size={11} />
                  {contactTitle}
                </p>
              )}
            </div>
          </div>

          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-tx2 hover:text-dark-accent dark:hover:text-dark-accent3 transition-colors"
            >
              <Mail size={13} className="text-gray-400 dark:text-dark-tx3" />
              {contactEmail}
            </a>
          )}
        </>
      )}
    </div>
  );
}