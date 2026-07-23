import React, { useState } from "react";
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdCheckCircle,
} from "react-icons/md";
// import { FaThumbtack , FaLaptop } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useSelector } from "react-redux";
import useAuth from "../../hook/useAuth";
import { FaLaptop } from "react-icons/fa";

/**
 * Pinterest-inspired Login Page
 * ------------------------------
 * Fields: email, password
 * Includes: "remember me", forgot password link, Google OAuth button
 *
 * Usage:
 *   <LoginPage
 *     onLogin={(data) => console.log(data)}
 *     onGoogleLogin={() => triggerGoogleOAuthFlow()}
 *   />
 */

const PIN_TILES = [
  { grad: "from-teal-400 to-cyan-500", h: "h-36", mt: "mt-2" },
  { grad: "from-rose-400 to-red-500", h: "h-52", mt: "mt-0" },
  { grad: "from-amber-300 to-orange-500", h: "h-40", mt: "mt-6" },
  { grad: "from-violet-400 to-indigo-600", h: "h-48", mt: "mt-0" },
  { grad: "from-lime-300 to-green-500", h: "h-32", mt: "mt-4" },
  { grad: "from-pink-400 to-rose-600", h: "h-44", mt: "mt-0" },
  { grad: "from-sky-400 to-indigo-500", h: "h-28", mt: "mt-3" },
  { grad: "from-yellow-300 to-amber-500", h: "h-56", mt: "mt-0" },
  { grad: "from-fuchsia-400 to-purple-600", h: "h-36", mt: "mt-8" },
];

function PinMasonry() {
  const columns = [
    PIN_TILES.slice(0, 3),
    PIN_TILES.slice(3, 6),
    PIN_TILES.slice(6, 9),
  ];
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-md">
      {columns.map((col, i) => (
        <div key={i} className="flex flex-col gap-3">
          {col.map((tile, j) => (
            <div
              key={j}
              className={`${tile.h} ${tile.mt} rounded-2xl bg-gradient-to-br ${tile.grad} shadow-lg shadow-black/10`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p>;
}

export default function LoginComponent({ onLogin, onGoogleLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const loading = useSelector(state => state.auth.loading)
  const user  = useSelector(state => state.auth.user)

  const { handleLogin } = useAuth()
  

  const handleChange = (field) => (e) => {
    const value = field === "rememberMe" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) next.email = "Enter your email";
    else if (!emailRegex.test(formData.email)) next.email = "Enter a valid email address";
    if (!formData.password) next.password = "Enter your password";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
   

    handleLogin({email : formData.email , password : formData.password})

  };

  const handleGoogleClick = async () => {
    setGoogleLoading(true);
    try {
      if (onGoogleLogin) await onGoogleLogin();
      else console.log("Google OAuth login clicked");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col md:flex-row">
      {/* Left visual panel — hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-rose-50 items-center justify-center p-10 lg:p-16">
        <div className="absolute -top-16 -left-16 h-72 w-72 rounded-full bg-red-200/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-orange-200/40 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg">
          <PinMasonry />
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              Welcome back
            </h2>
            <p className="mt-3 text-neutral-600 text-base lg:text-lg">
              Pick up right where you left off — your saved finds and your
              store are both waiting.
            </p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8 md:px-10 lg:px-16">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-14 w-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
              <FaLaptop className="text-white text-2xl rotate-180" />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold text-neutral-900 tracking-tight">
              Log in to your account
            </h1>
            <p className="mt-1 text-sm text-neutral-500 text-center">
              Enter your details or continue with Google
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
              <MdCheckCircle className="mx-auto text-4xl text-green-600" />
              <p className="mt-3 font-semibold text-green-800">
                Logged in successfully!
              </p>
              <p className="mt-1 text-sm text-green-700">
                Welcome back, {formData.email.split("@")[0]}.
              </p>
            </div>
          ) : (
            <>
              {/* Google OAuth button */}
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 active:bg-neutral-100 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-semibold text-neutral-800 py-3.5 transition-colors shadow-sm"
              >
                <FcGoogle className="text-xl" />
                {googleLoading ? "Connecting..." : "Continue with Google"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <span className="h-px flex-1 bg-neutral-200" />
                <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                  or
                </span>
                <span className="h-px flex-1 bg-neutral-200" />
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Email */}
                <div>
                  <div
                    className={`flex items-center gap-3 rounded-2xl border bg-neutral-50 px-4 py-3.5 transition-colors focus-within:border-red-500 focus-within:bg-white ${
                      errors.email ? "border-red-400" : "border-neutral-200"
                    }`}
                  >
                    <MdEmail className="text-neutral-400 text-xl shrink-0" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange("email")}
                      className="w-full bg-transparent outline-none text-sm font-medium text-neutral-900 placeholder:text-neutral-400"
                    />
                  </div>
                  <FieldError message={errors.email} />
                </div>

                {/* Password */}
                <div>
                  <div
                    className={`flex items-center gap-3 rounded-2xl border bg-neutral-50 px-4 py-3.5 transition-colors focus-within:border-red-500 focus-within:bg-white ${
                      errors.password ? "border-red-400" : "border-neutral-200"
                    }`}
                  >
                    <MdLock className="text-neutral-400 text-xl shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange("password")}
                      className="w-full bg-transparent outline-none text-sm font-medium text-neutral-900 placeholder:text-neutral-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="text-neutral-400 hover:text-neutral-600 shrink-0"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <MdVisibilityOff className="text-xl" />
                      ) : (
                        <MdVisibility className="text-xl" />
                      )}
                    </button>
                  </div>
                  <FieldError message={errors.password} />
                </div>

                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange("rememberMe")}
                      className="h-4 w-4 rounded border-neutral-300 text-red-600 focus:ring-red-500"
                    />
                    Remember me
                  </label>
                  <a href="#" className="text-sm font-semibold text-red-600 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-base py-3.5 transition-colors shadow-md shadow-red-600/20"
                >
                  Log in
                </button>

                <p className="text-center text-sm text-neutral-600 pt-2">
                  Don't have an account?{" "}
                  <a href="#" className="font-semibold text-red-600 hover:underline">
                    Sign up
                  </a>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}