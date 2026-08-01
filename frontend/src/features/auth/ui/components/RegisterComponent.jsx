import { useState } from "react";
import { useSelector } from "react-redux";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiShoppingBag,
  FiMonitor,
  FiShield,
  FiTag,
  FiLoader,
  FiCpu,
  FiAlertCircle,
} from "react-icons/fi";
// Adjust this import path to wherever your custom hook lives
import useAuth from "../../hook/useAuth";
import Loader from "../../../../components/Loader";

// Keep validation rules in one place so they're easy to tune.
const USERNAME_REGEX = /^[a-zA-Z0-9_ ]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm({ username, email, password }) {
  const errors = {};

  if (!username.trim()) {
    errors.username = "Username is required";
  } else if (username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = "Include at least one letter and one number";
  }

  return errors;
}

export default function RegisterComponent() {
  const { handleRegister } = useAuth();

  // useAuth takes a plain { username, email, password, isSeller } object,
  // so the form owns its own local state and hands it off on submit.
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    isSeller: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Matches your auth slice's initialState field names.
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear that field's error as soon as the user edits it.
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

    console.log(formData)

    handleRegister(formData);
  };

  if(isLoading){
    return <Loader/>
  }

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC]">
      {/* Left brand panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#0F172A]">
        {/* subtle circuit-board pattern */}
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
              Buy, sell and trade laptops &amp; computers — all in one place.
            </h1>
            <p className="text-slate-300 text-sm mb-8">
              Join a marketplace built for people who know their hardware.
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
              CoreTrade
            </span>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-1">
              Create your account
            </h2>
            <p className="text-sm text-[#64748B] mb-6">
              Start buying or listing hardware today.
            </p>

            {error && (
              <div className="mb-5 rounded-lg border border-[#F97316]/30 bg-[#F97316]/10 px-4 py-3 text-sm text-[#F97316]">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-[#334155] mb-1.5"
                >
                  Username
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#64748B]" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="e.g. techscout_23"
                    value={formData.username}
                    onChange={handleChange}
                    aria-invalid={!!fieldErrors.username}
                    aria-describedby={
                      fieldErrors.username ? "username-error" : undefined
                    }
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white text-[#0F172A] placeholder:text-[#64748B]/60 text-sm outline-none transition focus:ring-2 ${
                      fieldErrors.username
                        ? "border-[#F97316] focus:border-[#F97316] focus:ring-[#F97316]/20"
                        : "border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                    }`}
                  />
                </div>
                {fieldErrors.username && (
                  <p
                    id="username-error"
                    className="mt-1.5 flex items-center gap-1 text-xs text-[#F97316]"
                  >
                    <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {fieldErrors.username}
                  </p>
                )}
              </div>

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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#334155] mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#64748B]" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
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

              {/* Register as seller */}
              <label
                htmlFor="isSeller"
                className="flex items-start gap-3 rounded-lg border border-[#E2E8F0] px-4 py-3 cursor-pointer transition hover:border-[#2563EB]/40 hover:bg-[#2563EB]/[0.03] has-[:checked]:border-[#2563EB] has-[:checked]:bg-[#2563EB]/5"
              >
                <input
                  id="isSeller"
                  name="isSeller"
                  type="checkbox"
                  checked={formData.isSeller}
                  onChange={handleChange}
                  className="mt-0.5 w-4 h-4 rounded border-[#E2E8F0] text-[#2563EB] accent-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                />
                <span className="flex-1">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-[#0F172A]">
                    <FiShoppingBag className="w-4 h-4 text-[#2563EB]" />
                    Register as a seller
                  </span>
                  <span className="block text-xs text-[#64748B] mt-0.5">
                    List and sell your own laptops &amp; computers on LapHub
                  </span>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition shadow-sm"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-[#64748B] mt-6">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-[#06B6D4] hover:text-[#2563EB] transition"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}