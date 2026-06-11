// frontend/src/components/settings/AppearanceSection.jsx
import { Sun, Moon, Monitor } from "lucide-react";
import useThemeStore from "@/store/themeStore";
import { SettingsCard } from "./SettingsPrimitives";
import { cn } from "@/lib/utils";

const THEMES = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
  { key: "system", label: "System", icon: Monitor },
];

export default function AppearanceSection() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="space-y-5">
      <SettingsCard
        title="Theme"
        description="Choose how Job Trackly looks for you"
      >
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                theme === key
                  ? "border-dark-accent bg-[#eef2ff] dark:bg-dark-accent/20"
                  : "border-gray-200 dark:border-dark-border bg-white dark:bg-dark-s2 hover:border-gray-300",
              )}
            >
              <Icon
                size={20}
                className={theme === key ? "text-dark-accent" : "text-gray-400"}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  theme === key
                    ? "text-dark-accent"
                    : "text-gray-500 dark:text-dark-tx2",
                )}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}
