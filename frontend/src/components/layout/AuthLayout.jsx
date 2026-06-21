import { Check } from "lucide-react";
import Logo from "@/components/ui/Logo.jsx";
import AvatarStack from "@/components/ui/AvatarStack.jsx";

export default function AuthLayout({ children, headline, subline, features }) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[45%] xl:w-[40%] flex-col justify-between p-10 xl:p-14 bg-light-auth-2"
      >
        <Logo size="md" />

        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl xl:text-4xl font-extrabold text-gray-900 leading-tight">
              {headline}
            </h1>
            {subline && (
              <p className="text-gray-600 text-base leading-relaxed max-w-sm">
                {subline}
              </p>
            )}
          </div>

          {features && (
            <ul className="space-y-3">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-dark-accent flex items-center justify-center">
                    <Check size={11} color="white" strokeWidth={3} />
                  </span>
                  <span className="text-gray-700 text-sm">{f}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <AvatarStack />
      </div>

      {/* ── Right panel ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-white overflow-y-auto">
        {children}
      </div>
    </div>
  );
}