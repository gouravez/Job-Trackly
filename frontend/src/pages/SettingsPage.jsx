// frontend/src/pages/SettingsPage.jsx
import { useState } from "react";
import { User, Palette, Bell, Shield } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProfileSection from "@/components/settings/ProfileSection";
import AppearanceSection from "@/components/settings/AppearanceSection";
import NotificationsSection from "@/components/settings/NotificationsSection";
import AccountSection from "@/components/settings/AccountSection";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "account", label: "Account", icon: Shield },
];

const SECTION_MAP = {
  profile: ProfileSection,
  appearance: AppearanceSection,
  notifications: NotificationsSection,
  account: AccountSection,
};

export default function SettingsPage() {
  const [active, setActive] = useState("profile");
  const ActiveSection = SECTION_MAP[active];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-dark-tx1">
            Settings
          </h1>
          <p className="text-gray-400 mt-0.5 text-sm">
            Manage your account and preferences
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-gray-100 dark:bg-dark-s2 p-1 rounded-xl w-fit flex-wrap">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                active === key
                  ? "bg-white dark:bg-dark-s1 text-gray-900 dark:text-dark-tx1 shadow-sm"
                  : "text-gray-500 dark:text-dark-tx2 hover:text-gray-700 dark:hover:text-dark-tx1",
              )}
            >
              <Icon size={15} strokeWidth={1.8} />
              {label}
            </button>
          ))}
        </div>

        <ActiveSection />
      </div>
    </DashboardLayout>
  );
}
