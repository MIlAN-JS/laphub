import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import useAuth from "../../hook/useAuth.js";
import Loader from "../../../../components/Loader.jsx";
import ecomLaptop from "../../../../assets/ecom-laptop.jpg";

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
  const { handleLogin, handleGoogleLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  // Only show state.auth.error once this form has actually been
  // submitted — otherwise the leftover error from App.jsx's silent
  // refresh-token check on load (unrelated to login) shows up.
  const [submitted, setSubmitted] = useState(false);

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

    setSubmitted(true);
    handleLogin(formData);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen w-full flex bg-cream">
      {/* Left image panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={ecomLaptop}
          alt="LapHub marketplace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />

        <div className="relative z-10 flex flex-col justify-end h-full p-12 text-white">
          <h1 className="text-3xl font-bold leading-tight mb-3">
            Welcome back to Laphub.
          </h1>
          <p className="text-white/90 text-sm">
            Sign in to browse listings, track your orders, and chat directly
            with sellers.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="bg-white border border-neutral/30 rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-ink mb-1">Sign in</h2>
            <p className="text-sm text-neutral mb-6">
              Welcome back, enter your details below.
            </p>

            {submitted && error && (
              <div className="mb-5 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-ink mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="hello@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={
                      fieldErrors.email ? "email-error" : undefined
                    }
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-cream text-ink placeholder:text-neutral/70 text-sm outline-none transition focus:ring-2 ${
                      fieldErrors.email
                        ? "border-accent focus:border-accent focus:ring-accent/20"
                        : "border-neutral/40 focus:border-olive focus:ring-olive/20"
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p
                    id="email-error"
                    className="mt-1.5 flex items-center gap-1 text-xs text-accent"
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
                    className="block text-sm font-medium text-ink"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-olive hover:text-accent transition"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral" />
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
                    className={`w-full pl-10 pr-11 py-2.5 rounded-lg border bg-cream text-ink placeholder:text-neutral/70 text-sm outline-none transition focus:ring-2 ${
                      fieldErrors.password
                        ? "border-accent focus:border-accent focus:ring-accent/20"
                        : "border-neutral/40 focus:border-olive focus:ring-olive/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral hover:text-ink transition"
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
                    className="mt-1.5 flex items-center gap-1 text-xs text-accent"
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
                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition shadow-sm"
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

            <div className="flex items-center gap-3 my-6">
              <span className="h-px flex-1 bg-neutral/30" />
              <span className="text-xs tracking-wider text-neutral">
                OR CONTINUE WITH
              </span>
              <span className="h-px flex-1 bg-neutral/30" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  handleGoogleLogin();
                }}
                className="flex items-center justify-center gap-2 border border-neutral/40 bg-white hover:bg-cream text-ink text-sm font-medium py-2.5 rounded-lg transition"
              >
                <FcGoogle className="w-5 h-5" />
                Google
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log("dont forget to add facebook login ");
                }}
                className="flex items-center justify-center gap-2 border border-neutral/40 bg-white hover:bg-cream text-ink text-sm font-medium py-2.5 rounded-lg transition"
              >
                <FaFacebook className="w-5 h-5 text-[#1877F2]" />
                Facebook
              </button>
            </div>

            <p className="text-center text-sm text-neutral mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-olive hover:text-accent transition"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
