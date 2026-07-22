import React, { useState } from "react";
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdPhone,
  MdVisibility,
  MdVisibilityOff,
  MdStorefront,
  MdCheckCircle,
} from "react-icons/md";
import { FaLaptop } from "react-icons/fa";
import useAuth from "../../hook/useAuth.js";
import { useSelector } from "react-redux";
/**
 * Pinterest-inspired Register Page
 * ---------------------------------
 * Fields: email, password, fullName, contact, isSeller (register as a seller)
 *
 * Usage:
 *   <RegisterPage onRegister={(data) => console.log(data)} />
 */

const PIN_TILES = [
  { grad: "from-rose-400 to-red-500", h: "h-40", mt: "mt-0" },
  { grad: "from-amber-300 to-orange-500", h: "h-56", mt: "mt-6" },
  { grad: "from-teal-400 to-cyan-500", h: "h-32", mt: "mt-0" },
  { grad: "from-fuchsia-400 to-purple-600", h: "h-48", mt: "mt-4" },
  { grad: "from-lime-300 to-green-500", h: "h-36", mt: "mt-2" },
  { grad: "from-sky-400 to-indigo-500", h: "h-52", mt: "mt-0" },
  { grad: "from-pink-400 to-rose-600", h: "h-28", mt: "mt-8" },
  { grad: "from-yellow-300 to-amber-500", h: "h-44", mt: "mt-0" },
  { grad: "from-violet-400 to-indigo-600", h: "h-40", mt: "mt-3" },
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

function ToggleSwitch({ checked, onChange, label, icon }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 hover:border-neutral-300 transition-colors"
    >
      <span className="flex items-center gap-2.5 text-sm font-semibold text-neutral-800">
        <span className="text-red-600 text-lg">{icon}</span>
        {label}
      </span>
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
          checked ? "bg-red-600" : "bg-neutral-300"
        }`}
      >
        <span
          className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-600">{message}</p>;
}

export default function RegisterComponent({ onRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    contact: "",
    isSeller: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // custom register hook 
  const {handleRegister} = useAuth()
  const loading = useSelector(state => state.auth.isLoading)

  
 

  const handleChange = (field) => (e) => {
    const value = field === "isSeller" ? e : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) next.fullName = "Enter your full name";
    if (!formData.email.trim()) next.email = "Enter your email";
    else if (!emailRegex.test(formData.email)) next.email = "Enter a valid email address";
    if (!formData.password) next.password = "Create a password";
    else if (formData.password.length < 8)
      next.password = "Password must be at least 8 characters";
    if (!formData.contact.trim()) next.contact = "Enter a contact number";
    else if (!/^[0-9+\-\s()]{7,15}$/.test(formData.contact))
      next.contact = "Enter a valid contact number";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitted(true);

       handleRegister(formData)


       
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
            <h2 className="text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight ">
             One place to buy and sell laptops.

            </h2>
            <p className="mt-3 text-neutral-600 text-base lg:text-lg ">
              Discover products from real sellers, or list your own and start reaching buyers today.
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
  <FaLaptop className="text-white text-2xl" />
</div>
            <h1 className="mt-4 text-2xl font-extrabold text-neutral-900 tracking-tight">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-neutral-500 text-center">
              Sign up and start buying and selling your laptops today
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Full name */}
              <div>
                <div
                  className={`flex items-center gap-3 rounded-2xl border bg-neutral-50 px-4 py-3.5 transition-colors focus-within:border-red-500 focus-within:bg-white ${
                    errors.fullName ? "border-red-400" : "border-neutral-200"
                  }`}
                >
                  <MdPerson className="text-neutral-400 text-xl shrink-0" />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={formData.fullName}
                    onChange={handleChange("fullName")}
                    className="w-full bg-transparent outline-none text-sm font-medium text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
                <FieldError message={errors.fullName} />
              </div>

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

              {/* Contact */}
              <div>
                <div
                  className={`flex items-center gap-3 rounded-2xl border bg-neutral-50 px-4 py-3.5 transition-colors focus-within:border-red-500 focus-within:bg-white ${
                    errors.contact ? "border-red-400" : "border-neutral-200"
                  }`}
                >
                  <MdPhone className="text-neutral-400 text-xl shrink-0" />
                  <input
                    type="tel"
                    placeholder="Contact number"
                    value={formData.contact}
                    onChange={handleChange("contact")}
                    className="w-full bg-transparent outline-none text-sm font-medium text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
                <FieldError message={errors.contact} />
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
                    placeholder="Create a password"
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
                <p className="mt-1.5 text-xs text-neutral-400">
                  Use at least 8 characters.
                </p>
              </div>

              {/* Register as seller toggle */}
              <ToggleSwitch
                checked={formData.isSeller}
                onChange={(val) => handleChange("isSeller")(val)}
                label="Register as a seller"
                icon={<MdStorefront />}
              />

              <button
                type="submit"
                className="w-full rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-base py-3.5 transition-colors shadow-md shadow-red-600/20"
              >
                Sign up
              </button>

              <p className="text-center text-xs text-neutral-500 leading-relaxed pt-1">
                By continuing, you agree to our Terms of Service and
                acknowledge our Privacy Policy.
              </p>

              <p className="text-center text-sm text-neutral-600 pt-2">
                Already have an account?{" "}
                <a href="#" className="font-semibold text-red-600 hover:underline">
                  Log in
                </a>
              </p>
            </form>
        </div>
      </div>

    </div>
  );
}



