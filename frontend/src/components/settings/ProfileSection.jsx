// frontend/src/components/settings/ProfileSection.jsx
import { useState } from "react";
import useAuthStore from "@/store/authStore";
import { userService } from "@/services/api";
import { SettingsInput, SettingsCard, SaveButton } from "./SettingsPrimitives";

export default function ProfileSection() {
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    university: user?.university || "",
    graduationYear: user?.graduationYear || "",
    userType: user?.userType || "College Student",
    linkedin: user?.linkedin || "",
    github: user?.github || "",
    portfolio: user?.portfolio || "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const initials =
    `${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}`.toUpperCase() ||
    "?";

  const handleSave = async () => {
    setLoading(true);
    try {
      await userService.updateProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Profile update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Avatar */}
      <SettingsCard title="Profile Photo">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-dark-accent flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {form.firstName} {form.lastName}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{form.email}</p>
          </div>
        </div>
      </SettingsCard>

      {/* Personal info */}
      <SettingsCard
        title="Personal Info"
        description="Your name and email address"
      >
        <div className="grid grid-cols-2 gap-4">
          <SettingsInput
            label="First Name"
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            placeholder="First name"
          />
          <SettingsInput
            label="Last Name"
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            placeholder="Last name"
          />
        </div>
        <SettingsInput
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="you@email.com"
        />
        <SaveButton saved={saved} loading={loading} onClick={handleSave} />
      </SettingsCard>

      {/* Academic info */}
      <SettingsCard title="Academic Info" description="Your education details">
        <div className="grid grid-cols-2 gap-4">
          <SettingsInput
            label="University"
            value={form.university}
            onChange={(e) => set("university", e.target.value)}
            placeholder="e.g. UC Berkeley"
          />
          <SettingsInput
            label="Graduation Year"
            value={form.graduationYear}
            onChange={(e) => set("graduationYear", e.target.value)}
            placeholder="e.g. 2026"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Job Search Status
          </label>
          <select
            value={form.userType}
            onChange={(e) => set("userType", e.target.value)}
            className="w-full h-10 px-3.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-s2 text-sm text-gray-700 dark:text-dark-tx1 focus:outline-none focus:ring-2 focus:ring-dark-accent/20 focus:border-dark-accent transition-all"
          >
            {["College Student", "Recent Graduate", "Job Seeker"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <SaveButton saved={saved} loading={loading} onClick={handleSave} />
      </SettingsCard>

      {/* Social links */}
      <SettingsCard title="Social Links">
        <SettingsInput
          label="LinkedIn"
          value={form.linkedin}
          onChange={(e) => set("linkedin", e.target.value)}
          placeholder="https://linkedin.com/in/..."
        />
        <SettingsInput
          label="GitHub"
          value={form.github}
          onChange={(e) => set("github", e.target.value)}
          placeholder="https://github.com/..."
        />
        <SettingsInput
          label="Portfolio"
          value={form.portfolio}
          onChange={(e) => set("portfolio", e.target.value)}
          placeholder="https://yoursite.com"
        />
        <SaveButton saved={saved} loading={loading} onClick={handleSave} />
      </SettingsCard>
    </div>
  );
}
