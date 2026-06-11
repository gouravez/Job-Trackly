import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout.jsx";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons.jsx";
import Button from "@/components/ui/Button.jsx";
import Input from "@/components/ui/Input.jsx";
import Logo from "@/components/ui/Logo.jsx";
import useAuthStore from "@/store/authStore";

const FEATURES = [
  "Track every application in one place",
  "Visualize your pipeline with Kanban",
  "Never miss a follow-up or deadline",
];

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const { signIn, isLoading } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: "" }));
    setAuthError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const result = await signIn(form);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setAuthError(result.error);
    }
  };

  return (
    <AuthLayout
      headline="Welcome back to your job search"
      subline="Pick up right where you left off — your applications are waiting."
      features={FEATURES}
    >
      <div className="w-full max-w-[440px] space-y-6">
        <div className="space-y-1">
          <Logo size="lg" />
          <div className="pt-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sign in to Job Trackly
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Continue with your account below
            </p>
          </div>
        </div>

        <SocialAuthButtons action="continue" />

        <form onSubmit={handleSubmit} className="space-y-4">
          {authError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-sm text-red-600">{authError}</p>
            </div>
          )}

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

          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            icon={Lock}
            rightIcon={showPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowPassword((v) => !v)}
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-[#2f54c8] cursor-pointer"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-[#2f54c8] font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={isLoading}
          >
            <LogIn size={16} />
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-[#2f54c8] font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
