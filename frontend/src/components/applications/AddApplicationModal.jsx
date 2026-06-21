// frontend/src/components/applications/AddApplicationModal.jsx
import { useState, useRef } from "react";
import {
  X,
  Link as LinkIcon,
  Calendar,
  Check,
  Upload,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useResumeStore from "@/store/resumeStore";

const STATUSES = [
  "Saved",
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
];
const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Freelance",
];
const STATUS_DOTS = {
  Saved: "bg-gray-400",
  Applied: "bg-blue-500",
  Assessment: "bg-purple-500",
  Interview: "bg-teal-500",
  Offer: "bg-green-500",
  Rejected: "bg-red-500",
};

const EMPTY = {
  company: "",
  role: "",
  jobUrl: "",
  status: "Applied",
  dateApplied: new Date().toISOString().slice(0, 10),
  location: "",
  jobType: "Internship",
  priority: "Medium",
  salary: "",
  notes: "",
  contactName: "",
  contactEmail: "",
  contactTitle: "",
  source: "LinkedIn",
};

// initialData is passed when editing an existing application.
// When absent the modal behaves exactly as before (add mode).
export default function AddApplicationModal({
  onClose,
  onSave,
  saveError,
  initialData,
}) {
  const isEdit = Boolean(initialData);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(
    isEdit ? { ...EMPTY, ...initialData } : EMPTY,
  );
  const [saving, setSaving] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);

  const fileInputRef = useRef(null);
  const { uploadResume, isUploading } = useResumeStore();

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);

    // 1. Save the application — onSave returns the saved app (with real id) on success
    const result = await onSave({
      company: form.company,
      role: form.role,
      location: form.location || undefined,
      status: form.status,
      priority: form.priority,
      jobUrl: form.jobUrl || undefined,
      jobType: form.jobType || undefined,
      salary: form.salary || undefined,
      notes: form.notes || undefined,
      dateApplied: form.dateApplied || undefined,
      contactName: form.contactName || undefined,
      contactEmail: form.contactEmail || undefined,
      contactTitle: form.contactTitle || undefined,
    });

    // 2. If a resume was staged and we have a real application id, upload it
    if (pendingFile && result?.id) {
      await uploadResume({ file: pendingFile, applicationId: result.id });
    }

    setSaving(false);
  };

  const isBusy = saving || isUploading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-dark-s1 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 sm:px-7 pt-7 pb-5 border-b border-gray-100 dark:border-dark-border">
          <h2 className="text-xl font-bold text-gray-900 dark:text-dark-tx1">
            {isEdit ? "Edit Application" : "Add New Application"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-dark-tx1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Step tabs ──────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3 px-4 sm:px-7 py-4 border-b border-gray-100 dark:border-dark-border">
          {[
            { n: 1, label: "Job Details" },
            { n: 2, label: "Resume & Contact" },
          ].map((s) => (
            <button
              key={s.n}
              onClick={() => setStep(s.n)}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                step === s.n
                  ? "text-gray-900 dark:text-dark-tx1"
                  : "text-gray-400",
              )}
            >
              <span
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  step === s.n
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "bg-gray-200 dark:bg-dark-s3 text-gray-500 dark:text-dark-tx2",
                )}
              >
                {s.n}
              </span>
              {s.label}
            </button>
          ))}
          <div className="flex-1 h-px bg-gray-100 dark:bg-dark-s2 mx-2" />
        </div>

        {/* ── Form body ──────────────────────────────────────────────────── */}
        <div className="px-4 sm:px-7 py-6 space-y-5">
          {/* API error */}
          {saveError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
              <p className="text-sm text-red-600 dark:text-red-400">
                {saveError}
              </p>
            </div>
          )}

          {/* ── Step 1 — Job Details ──────────────────────────────────────── */}
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Company Name">
                  <input
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                    placeholder="e.g. Google"
                    className={inputCls}
                  />
                </Field>
                <Field label="Job Role">
                  <input
                    value={form.role}
                    onChange={(e) => set("role", e.target.value)}
                    placeholder="e.g. Software Engineer Intern"
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Job URL">
                <div className="relative">
                  <LinkIcon
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={form.jobUrl}
                    onChange={(e) => set("jobUrl", e.target.value)}
                    placeholder="Paste job posting URL..."
                    className={cn(inputCls, "pl-8")}
                  />
                </div>
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Status">
                  <div className="relative">
                    <select
                      value={form.status}
                      onChange={(e) => set("status", e.target.value)}
                      className={inputCls}
                    >
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <span
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${STATUS_DOTS[form.status]}`}
                    />
                  </div>
                </Field>
                <Field label="Application Date">
                  <div className="relative">
                    <Calendar
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="date"
                      value={form.dateApplied}
                      onChange={(e) => set("dateApplied", e.target.value)}
                      className={cn(inputCls, "pl-8")}
                    />
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Location">
                  <input
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className={inputCls}
                  />
                </Field>
                <Field label="Job Type">
                  <select
                    value={form.jobType}
                    onChange={(e) => set("jobType", e.target.value)}
                    className={inputCls}
                  >
                    {JOB_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Priority">
                  <div className="flex rounded-lg border border-gray-200 dark:border-dark-border overflow-hidden">
                    {["Low", "Medium", "High"].map((p) => {
                      const dotColor =
                        p === "Low"
                          ? "bg-green-500"
                          : p === "Medium"
                            ? "bg-amber-400"
                            : "bg-red-500";
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => set("priority", p)}
                          className={cn(
                            "flex-1 py-2 text-sm flex items-center justify-center gap-1.5 transition-all",
                            form.priority === p
                              ? "bg-gray-100 dark:bg-dark-s3 font-semibold text-gray-900 dark:text-dark-tx1"
                              : "text-gray-500 dark:text-dark-tx2 hover:bg-gray-50 dark:hover:bg-dark-s2",
                          )}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${dotColor}`}
                          />
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </Field>
                <Field label="Salary / Compensation">
                  <input
                    value={form.salary}
                    onChange={(e) => set("salary", e.target.value)}
                    placeholder="e.g. $120k"
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Notes">
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Add any notes about this application..."
                  rows={3}
                  className={cn(inputCls, "resize-none h-auto py-2.5")}
                />
              </Field>
            </>
          )}

          {/* ── Step 2 — Resume & Contact ─────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Resume upload */}
              <Field label="Resume Version">
                {pendingFile ? (
                  // Staged file preview
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-dark-s2 rounded-xl p-3 border border-gray-200 dark:border-dark-border">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText
                          size={14}
                          className="text-red-500 dark:text-red-400"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-dark-tx1 truncate max-w-[220px]">
                          {pendingFile.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-dark-tx3">
                          {(pendingFile.size / 1024).toFixed(1)} KB · will
                          upload on save
                        </p>
                      </div>
                    </div>
                    {/* Remove staged file */}
                    <button
                      type="button"
                      onClick={() => setPendingFile(null)}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 flex-shrink-0"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  // Drop zone
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center gap-2 py-7 border-2 border-dashed border-gray-200 dark:border-dark-border rounded-xl text-gray-400 dark:text-dark-tx3 hover:border-dark-accent hover:text-dark-accent dark:hover:border-dark-accent transition-all"
                  >
                    <Upload size={22} />
                    <span className="text-xs font-medium">
                      Click to attach resume
                    </span>
                    <span className="text-xs opacity-70">
                      PDF or Word · max 5 MB
                    </span>
                  </button>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPendingFile(file);
                    e.target.value = "";
                  }}
                />
              </Field>

              {/* Divider */}
              <div className="h-px bg-gray-100 dark:bg-dark-border" />

              {/* Contact fields */}
              <p className="text-xs text-gray-400 dark:text-dark-tx2">
                Optional — contact details for this application.
              </p>

              <Field label="Contact Name">
                <input
                  value={form.contactName}
                  onChange={(e) => set("contactName", e.target.value)}
                  placeholder="e.g. Sarah Miller"
                  className={inputCls}
                />
              </Field>

              <Field label="Contact Email">
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => set("contactEmail", e.target.value)}
                  placeholder="e.g. sarah@company.com"
                  className={inputCls}
                />
              </Field>

              <Field label="Contact Title">
                <input
                  value={form.contactTitle}
                  onChange={(e) => set("contactTitle", e.target.value)}
                  placeholder="e.g. Technical Recruiter"
                  className={inputCls}
                />
              </Field>

              <Field label="Source">
                <select
                  value={form.source}
                  onChange={(e) => set("source", e.target.value)}
                  className={inputCls}
                >
                  {[
                    "LinkedIn",
                    "Company Website",
                    "Referral",
                    "Job Board",
                    "Other",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-7 py-5 border-t border-gray-100 dark:border-dark-border">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-dark-border text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-s2 transition-colors"
          >
            Cancel
          </button>

          <div className="flex gap-3">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                disabled={isBusy}
                className="px-5 py-2.5 rounded-lg border border-gray-200 dark:border-dark-border text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-s2 disabled:opacity-40 transition-colors"
              >
                ← Back
              </button>
            )}

            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                disabled={!form.company.trim() || !form.role.trim()}
                className="px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isBusy || !form.company.trim() || !form.role.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isBusy ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    {saving ? "Saving…" : "Uploading resume…"}
                  </>
                ) : (
                  <>
                    <Check size={15} />
                    {isEdit ? "Save Changes" : "Save Application"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared styles ───────────────────────────────────────────────────────────

const inputCls =
  "w-full h-10 px-3.5 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-s2 text-sm text-gray-800 dark:text-dark-tx1 placeholder:text-gray-400 dark:placeholder:text-dark-tx3 focus:outline-none focus:ring-2 focus:ring-dark-accent/20 focus:border-dark-accent transition-all";

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
        {label}
      </label>
      {children}
    </div>
  );
}