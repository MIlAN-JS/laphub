import { useState } from "react";
import { useSelector } from "react-redux";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMonitor,
  FiShield,
  FiTag,
  FiShoppingBag,
  FiLoader,
  FiCpu,
  FiAlertCircle,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
// Adjust this import path to wherever your custom hook lives
import useAuth from "../../hook/useAuth.js"

// Same rules as the register form's email check, kept local so this
// component doesn't depend on the register file.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm({ email, password }) {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
}

export default function LoginComponent() {
  // Assumed to mirror useAuth's handleRegister: handleLogin({ email, password })
  // and, for Google, a handleGoogleLogin() that kicks off the OAuth redirect/popup.
  // Adjust names/signatures to match your actual hook.
  const { handleLogin, handleGoogleLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Matches your auth slice's initialState field names.
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    handleLogin(formData);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      {/* Left brand panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#0F172A]">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.07]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="circuit"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 30h20M40 30h20M30 0v20M30 40v20"
                stroke="white"
                strokeWidth="1"
                fill="none"
              />
              <circle cx="30" cy="30" r="3" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <FiCpu className="w-5 h-5 text-[#06B6D4]" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              LapHub
            </span>
          </div>

          <div className="max-w-sm">
            <FiMonitor className="w-12 h-12 text-[#06B6D4] mb-6" />
            <h1 className="text-3xl font-bold leading-tight mb-3">
              Welcome back to the marketplace built for hardware people.
            </h1>
            <p className="text-slate-300 text-sm mb-8">
              Pick up right where you left off — browsing, listing, or both.
            </p>

            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-slate-200">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <FiShield className="w-4 h-4 text-[#06B6D4]" />
                </span>
                Verified sellers, every listing checked
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-200">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <FiTag className="w-4 h-4 text-[#F97316]" />
                </span>
                Real-time price comparisons on every deal
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-200">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <FiShoppingBag className="w-4 h-4 text-[#22C55E]" />
                </span>
                Sell your own gear in minutes
              </li>
            </ul>
          </div>

          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} LapHub. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile-only brand mark */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center">
              <FiCpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-[#0F172A]">
              LapHub
            </span>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-1">
              Sign in to your account
            </h2>
            <p className="text-sm text-[#64748B] mb-6">
              Enter your details to continue.
            </p>

            {error && (
              <div className="mb-5 rounded-lg border border-[#F97316]/30 bg-[#F97316]/10 px-4 py-3 text-sm text-[#F97316]">
                {error}
              </div>
            )}

            {/* Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2.5 border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#334155] text-sm font-medium py-2.5 rounded-lg transition"
            >
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </button>

            <div className="flex items-center gap-3 my-6">
              <span className="h-px flex-1 bg-[#E2E8F0]" />
              <span className="text-xs text-[#64748B]">or sign in with email</span>
              <span className="h-px flex-1 bg-[#E2E8F0]" />
            </div>

            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#334155] mb-1.5"
                >
                  Email address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#64748B]" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={
                      fieldErrors.email ? "email-error" : undefined
                    }
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white text-[#0F172A] placeholder:text-[#64748B]/60 text-sm outline-none transition focus:ring-2 ${
                      fieldErrors.email
                        ? "border-[#F97316] focus:border-[#F97316] focus:ring-[#F97316]/20"
                        : "border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p
                    id="email-error"
                    className="mt-1.5 flex items-center gap-1 text-xs text-[#F97316]"
                  >
                    <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#334155]"
                  >
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-xs font-medium text-[#06B6D4] hover:text-[#2563EB] transition"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#64748B]" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={
                      fieldErrors.password ? "password-error" : undefined
                    }
                    className={`w-full pl-10 pr-11 py-2.5 rounded-lg border bg-white text-[#0F172A] placeholder:text-[#64748B]/60 text-sm outline-none transition focus:ring-2 ${
                      fieldErrors.password
                        ? "border-[#F97316] focus:border-[#F97316] focus:ring-[#F97316]/20"
                        : "border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#334155] transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <FiEye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p
                    id="password-error"
                    className="mt-1.5 flex items-center gap-1 text-xs text-[#F97316]"
                  >
                    <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition shadow-sm"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-[#64748B] mt-6">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="font-medium text-[#06B6D4] hover:text-[#2563EB] transition"
              >
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}