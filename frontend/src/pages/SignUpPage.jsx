import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout.jsx";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons.jsx";
import Button from "@/components/ui/Button.jsx";
import Input from "@/components/ui/Input.jsx";
import Logo from "@/components/ui/Logo.jsx";
import useAuthStore from "@/store/authStore";
import { authService } from "@/services/api";
import { cn } from "@/lib/utils.js";

const FEATURES = [
  "Free forever for students",
  "Track unlimited applications in one place",
  "Visualize your progress with Kanban & analytics",
  "Never miss a follow-up or deadline",
];

const USER_TYPES = ["College Student", "Recent Graduate", "Job Seeker"];

const PASSWORD_STRENGTH = (pwd) => {
  if (!pwd) return { score: 0, label: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = [
    "",
    "text-red-500",
    "text-amber-500",
    "text-blue-500",
    "text-green-600",
  ];
  return { score, label: labels[score], color: colors[score] };
};

// ── Step 1 — Sign up form ─────────────────────────────────────────────────────

function SignUpForm({ onOtpSent }) {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("College Student");
  const [agreed, setAgreed] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const strength = PASSWORD_STRENGTH(form.password);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Required";
    else if (form.password.length < 8) e.password = "Min 8 characters";
    if (form.confirmPassword !== form.password)
      e.confirmPassword = "Passwords do not match";
    if (!agreed) e.agreed = "You must agree to continue";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSending(true);
    try {
      await authService.sendOtp({ email: form.email });
      onOtpSent({ ...form, userType });
    } catch (err) {
      setApiError(
        err?.response?.data?.message || "Failed to send OTP. Try again.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] space-y-6">
      <div className="space-y-1">
        <Logo size="lg" />
        <div className="pt-3">
          <h2 className="text-2xl font-bold text-gray-900">
            Create your free account
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Start organizing your job search in minutes
          </p>
        </div>
      </div>

      <SocialAuthButtons action="sign up" />

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-sm text-red-600">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            name="firstName"
            placeholder="Jane"
            icon={User}
            value={form.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <Input
            label="Last Name"
            name="lastName"
            placeholder="Doe"
            value={form.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@university.edu"
          icon={Mail}
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <div className="space-y-1.5">
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            icon={Lock}
            rightIcon={showPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowPassword((v) => !v)}
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          {form.password && (
            <div className="flex items-center gap-2">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-all duration-300",
                      strength.score >= n
                        ? strength.score <= 1
                          ? "bg-red-400"
                          : strength.score === 2
                            ? "bg-amber-400"
                            : strength.score === 3
                              ? "bg-blue-400"
                              : "bg-green-500"
                        : "bg-gray-200",
                    )}
                  />
                ))}
              </div>
              <span className={cn("text-xs font-medium", strength.color)}>
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          icon={Lock}
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-800">
            Where are you in your job search?
          </label>
          <div className="flex gap-2 flex-wrap">
            {USER_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setUserType(type)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                  userType === type
                    ? "bg-[#eef2ff] border-dark-accent text-dark-accent"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300",
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setErrors((err) => ({ ...err, agreed: "" }));
              }}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-dark-accent cursor-pointer"
            />
            <span className="text-sm text-gray-600">
              I agree to the{""}
              <Link
                to="/terms"
                className="text-dark-accent hover:underline font-medium"
              >
                Terms of Service
              </Link>
              {""}
              and{""}
              <Link
                to="/privacy"
                className="text-dark-accent hover:underline font-medium"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.agreed && (
            <p className="text-xs text-red-500 mt-1 ml-6">{errors.agreed}</p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" loading={sending}>
          Send Verification Code
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{""}
        <Link
          to="/signin"
          className="text-dark-accent font-semibold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

// ── Step 2 — OTP entry ────────────────────────────────────────────────────────

function OtpStep({ formData, onBack }) {
  const navigate = useNavigate();
  const { signUp, isLoading } = useAuthStore();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length < 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    const result = await signUp({ ...formData, otp: code });
    if (result.success) {
      navigate("/dashboard", { replace: true });
    } else {
      setError(result.error);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await authService.sendOtp({ email: formData.email });
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to resend. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] space-y-6">
      <Logo size="lg" />

      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
        <p className="text-sm text-gray-500 mt-1">
          We sent a 6-digit code to{""}
          <span className="font-semibold text-gray-800">{formData.email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP boxes */}
        <div className="flex gap-3 justify-center" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(e.target.value, idx)}
              onKeyDown={(e) => handleOtpKey(e, idx)}
              autoFocus={idx === 0}
              className={cn(
                "w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all outline-none",
                "bg-white text-gray-900",
                digit
                  ? "border-dark-accent bg-[#eef2ff]"
                  : "border-gray-200 focus:border-dark-accent",
              )}
            />
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isLoading}
          disabled={otp.join("").length < 6}
        >
          Verify & Create Account
        </Button>
      </form>

      {/* Resend */}
      <div className="text-center text-sm text-gray-500">
        Didn't get the code?{""}
        {countdown > 0 ? (
          <span className="text-gray-400">Resend in {countdown}s</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-dark-accent font-semibold hover:underline inline-flex items-center gap-1 disabled:opacity-50"
          >
            <RefreshCw size={13} className={resending ? "animate-spin" : ""} />
            {resending ? "Sending…" : "Resend code"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SignUpPage() {
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [formData, setFormData] = useState(null);

  const handleOtpSent = (data) => {
    setFormData(data);
    setStep(2);
  };

  return (
    <AuthLayout
      headline="Stay on top of every application you send"
      subline="Your personal workspace to organize applications, track progress, and never miss a follow-up."
      features={FEATURES}
    >
      {step === 1 ? (
        <SignUpForm onOtpSent={handleOtpSent} />
      ) : (
        <OtpStep formData={formData} onBack={() => setStep(1)} />
      )}
    </AuthLayout>
  );
}
