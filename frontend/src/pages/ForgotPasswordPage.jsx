import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout.jsx";
import Button from "@/components/ui/Button.jsx";
import Input from "@/components/ui/Input.jsx";
import Logo from "@/components/ui/Logo.jsx";
import { authService } from "@/services/api.js";

const FEATURES = [
  "Track every application in one place",
  "Visualize your pipeline with Kanban",
  "Never miss a follow-up or deadline",
];

// ── Step indicators ──────────────────────────────────────────────────────────
function Steps({ current }) {
  const steps = ["Email", "Verify", "New Password"];
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${done   ? "bg-green-500 text-white"
                  : active ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                           : "bg-gray-100 dark:bg-dark-s2 text-gray-400"}`}
              >
                {done ? "✓" : idx}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block
                  ${active ? "text-gray-900 dark:text-dark-tx1" : "text-gray-400 dark:text-dark-tx3"}`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px w-6 ${done ? "bg-green-400" : "bg-gray-200 dark:bg-dark-s3"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1 — Email ───────────────────────────────────────────────────────────
function StepEmail({ onNext }) {
  const [email, setEmail]     = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword({ email: email.trim() });
      onNext(email.trim());
    } catch (err) {
      // Still advance — backend returns generic message to prevent enumeration
      onNext(email.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-tx1">
          Forgot your password?
        </h2>
        <p className="text-sm text-gray-500 dark:text-dark-tx2">
          Enter your email and we'll send you a 6-digit reset code.
        </p>
      </div>

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        icon={Mail}
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(""); }}
        error={error}
        autoFocus
      />

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        <Mail size={16} />
        Send Reset Code
      </Button>

      <p className="text-center text-sm text-gray-500">
        <Link to="/signin" className="text-dark-accent font-semibold hover:underline inline-flex items-center gap-1">
          <ArrowLeft size={13} /> Back to Sign In
        </Link>
      </p>
    </form>
  );
}

// ── Step 2 — OTP ─────────────────────────────────────────────────────────────
function StepOtp({ email, onNext, onBack }) {
  const [otp, setOtp]         = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    // We don't verify OTP here separately — backend verifies during reset
    onNext(otp);
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await authService.forgotPassword({ email });
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch {
      setError("Could not resend code. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-tx1">
          Check your email
        </h2>
        <p className="text-sm text-gray-500 dark:text-dark-tx2">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-gray-700 dark:text-dark-tx1">{email}</span>.
          It expires in 10 minutes.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-dark-tx2">
          Reset Code
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          value={otp}
          onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
          autoFocus
          className={`w-full text-center text-3xl font-bold tracking-[0.5em] py-3 px-4 rounded-xl border
            bg-white dark:bg-dark-s2 text-gray-900 dark:text-dark-tx1
            outline-none transition-colors
            ${error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-200 dark:border-dark-border focus:border-dark-accent focus:ring-2 focus:ring-dark-accent/20"
            }`}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {resent && (
        <p className="text-xs text-green-600 dark:text-green-400 text-center">
          ✓ A new code was sent to {email}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={otp.length !== 6}>
        <ShieldCheck size={16} />
        Verify Code
      </Button>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-tx1 inline-flex items-center gap-1"
        >
          <ArrowLeft size={13} /> Change email
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="text-dark-accent font-semibold hover:underline disabled:opacity-50"
        >
          {resending ? "Sending…" : "Resend code"}
        </button>
      </div>
    </form>
  );
}

// ── Step 3 — New password ────────────────────────────────────────────────────
function StepNewPassword({ email, otp, onDone }) {
  const [form, setForm]       = useState({ newPassword: "", confirm: "" });
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [showCf, setShowCf]   = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const errs = {};
    if (form.newPassword.length < 8) errs.newPassword = "At least 8 characters";
    if (form.confirm !== form.newPassword) errs.confirm = "Passwords don't match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await authService.resetPassword({ email, otp, newPassword: form.newPassword });
      onDone();
    } catch (err) {
      setApiError(err?.response?.data?.message || "Reset failed. The code may have expired — go back and request a new one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-tx1">
          Set a new password
        </h2>
        <p className="text-sm text-gray-500 dark:text-dark-tx2">
          Choose a strong password for your account.
        </p>
      </div>

      {apiError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3">
          <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
        </div>
      )}

      <Input
        label="New Password"
        name="newPassword"
        type={showPw ? "text" : "password"}
        placeholder="At least 8 characters"
        icon={Lock}
        rightIcon={showPw ? EyeOff : Eye}
        onRightIconClick={() => setShowPw((v) => !v)}
        value={form.newPassword}
        onChange={handleChange}
        error={errors.newPassword}
      />

      <Input
        label="Confirm Password"
        name="confirm"
        type={showCf ? "text" : "password"}
        placeholder="Repeat your new password"
        icon={Lock}
        rightIcon={showCf ? EyeOff : Eye}
        onRightIconClick={() => setShowCf((v) => !v)}
        value={form.confirm}
        onChange={handleChange}
        error={errors.confirm}
      />

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        <KeyRound size={16} />
        Reset Password
      </Button>
    </form>
  );
}

// ── Step 4 — Success ─────────────────────────────────────────────────────────
function StepSuccess() {
  return (
    <div className="space-y-5 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
        <ShieldCheck size={32} className="text-green-500" />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-tx1">
          Password reset!
        </h2>
        <p className="text-sm text-gray-500 dark:text-dark-tx2">
          Your password has been updated. You can now sign in with your new password.
        </p>
      </div>
      <Link
        to="/signin"
        className="inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900
          px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
      >
        Go to Sign In
      </Link>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function ForgotPasswordPage() {
  const [step, setStep]   = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp]     = useState("");

  return (
    <AuthLayout
      headline="Regain access to your job search"
      subline="Reset your password in seconds — your applications will be right where you left them."
      features={FEATURES}
    >
      <div className="w-full max-w-[440px] space-y-6">
        <Logo size="lg" />

        {step < 4 && <Steps current={step} />}

        {step === 1 && (
          <StepEmail
            onNext={(e) => { setEmail(e); setStep(2); }}
          />
        )}
        {step === 2 && (
          <StepOtp
            email={email}
            onNext={(o) => { setOtp(o); setStep(3); }}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepNewPassword
            email={email}
            otp={otp}
            onDone={() => setStep(4)}
          />
        )}
        {step === 4 && <StepSuccess />}
      </div>
    </AuthLayout>
  );
}