import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShoppingBag,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiUpload,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import useAuth from "../../hook/useAuth.js";
import Loader from "../../../../components/Loader.jsx";
import ecomLaptop from "../../../../assets/ecom-laptop.jpg";
import logo from "../../../../assets/logo.png";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{7,15}$/;
const PAN_REGEX = /^\d{9}$/;

const BUSINESS_TYPES = [
  { value: "individual", label: "Individual" },
  { value: "company", label: "Company" },
];

function validateForm({
  email,
  password,
  storeName,
  storeNumber,
  businessType,
  street,
  city,
  state,
  country,
  postalCode,
  panNumber,
  panImage,
}) {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (!storeName.trim()) {
    errors.storeName = "Store name is required";
  } else if (storeName.trim().length < 3 || storeName.trim().length > 50) {
    errors.storeName = "Store name must be between 3 and 50 characters";
  }

  if (!storeNumber.trim()) {
    errors.storeNumber = "Phone number is required";
  } else if (!PHONE_REGEX.test(storeNumber.trim())) {
    errors.storeNumber = "Enter a valid phone number";
  }

  if (!businessType) {
    errors.businessType = "Select a business type";
  }

  if (!street.trim()) {
    errors.street = "Street address is required";
  }

  if (!city.trim()) {
    errors.city = "City is required";
  }

  if (!state.trim()) {
    errors.state = "State is required";
  }

  if (!country.trim()) {
    errors.country = "Country is required";
  }

  if (!postalCode.trim()) {
    errors.postalCode = "Postal code is required";
  }

  if (!panNumber.trim()) {
    errors.panNumber = "PAN number is required";
  } else if (!PAN_REGEX.test(panNumber.trim())) {
    errors.panNumber = "PAN must be exactly 9 digits";
  }

  if (!panImage) {
    errors.panImage = "Upload a photo of your PAN card";
  }

  return errors;
}

export default function SellerRegisterComponent() {
  const { handleSellerRegister } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    storeName: "",
    storeNumber: "",
    businessType: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    panNumber: "",
    panImage: null,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { isLoading, error } = useSelector((state) => state.auth);

  const clearFieldError = (name) => {
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, panImage: file }));
    clearFieldError("panImage");
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setSubmitted(true);
    handleSellerRegister(formData);
  };

  if (isLoading) return <Loader />;

  const inputClass = (name) =>
    `w-full pl-10 pr-4 py-2.5 rounded-lg border bg-cream text-ink placeholder:text-neutral/70 text-sm outline-none transition focus:ring-2 ${
      fieldErrors[name]
        ? "border-accent focus:border-accent focus:ring-accent/20"
        : "border-neutral/40 focus:border-olive focus:ring-olive/20"
    }`;

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
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-transparent" />

        <Link
          to="/"
          className="absolute top-8 left-8 z-10 flex items-center gap-2.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm overflow-hidden">
            <img src={logo} alt="Laphub" className="h-8 w-8 object-contain" />
          </span>
          <div className="leading-tight">
            <span className="block text-lg font-bold text-white">Laphub</span>
            <span className="block text-xs text-white/80">
              Laptops, bought and sold right.
            </span>
          </div>
        </Link>

        <div className="relative z-10 flex flex-col justify-end h-full p-12 text-white">
          <h1 className="text-3xl font-bold leading-tight mb-3">
            Sell your laptops to buyers worldwide.
          </h1>
          <p className="text-white/90 text-sm">
            Set up your storefront on LapHub and reach thousands of business
            buyers.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-xl">
          <div className="bg-white border border-neutral/30 rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-ink mb-1">
              Create your seller account
            </h2>
            <p className="text-sm text-neutral mb-6">
              Tell us about your business to start selling on Laphub.
            </p>

            {submitted && error && (
              <div className="mb-5 flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              {/* Account section */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Account
                </p>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
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
                      className={inputClass("email")}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-accent">
                      <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={formData.password}
                      onChange={handleChange}
                      aria-invalid={!!fieldErrors.password}
                      className={`${inputClass("password")} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral hover:text-ink transition"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff className="w-4.5 h-4.5" /> : <FiEye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-accent">
                      <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {fieldErrors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-neutral/20" />

              {/* Business section */}
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral">
                  Business Details
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Store name */}
                  <div>
                    <label htmlFor="storeName" className="block text-sm font-medium text-ink mb-1.5">
                      Store Name
                    </label>
                    <div className="relative">
                      <FiShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral" />
                      <input
                        id="storeName"
                        name="storeName"
                        type="text"
                        placeholder="e.g. Milan's Laptop Emporium"
                        value={formData.storeName}
                        onChange={handleChange}
                        aria-invalid={!!fieldErrors.storeName}
                        className={inputClass("storeName")}
                      />
                    </div>
                    {fieldErrors.storeName && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-accent">
                        <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fieldErrors.storeName}
                      </p>
                    )}
                  </div>

                  {/* Store phone number */}
                  <div>
                    <label htmlFor="storeNumber" className="block text-sm font-medium text-ink mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral" />
                      <input
                        id="storeNumber"
                        name="storeNumber"
                        type="tel"
                        placeholder="+977 98XXXXXXXX"
                        value={formData.storeNumber}
                        onChange={handleChange}
                        aria-invalid={!!fieldErrors.storeNumber}
                        className={inputClass("storeNumber")}
                      />
                    </div>
                    {fieldErrors.storeNumber && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-accent">
                        <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fieldErrors.storeNumber}
                      </p>
                    )}
                  </div>

                  {/* Business type */}
                  <div>
                    <label htmlFor="businessType" className="block text-sm font-medium text-ink mb-1.5">
                      Business Type
                    </label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      aria-invalid={!!fieldErrors.businessType}
                      className={`w-full px-4 py-2.5 rounded-lg border bg-cream text-ink text-sm outline-none transition focus:ring-2 ${
                        fieldErrors.businessType
                          ? "border-accent focus:border-accent focus:ring-accent/20"
                          : "border-neutral/40 focus:border-olive focus:ring-olive/20"
                      }`}
                    >
                      <option value="" disabled>
                        Select business type
                      </option>
                      {BUSINESS_TYPES.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.businessType && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-accent">
                        <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fieldErrors.businessType}
                      </p>
                    )}
                  </div>

                  {/* PAN number */}
                  <div>
                    <label htmlFor="panNumber" className="block text-sm font-medium text-ink mb-1.5">
                      PAN Number
                    </label>
                    <div className="relative">
                      <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral" />
                      <input
                        id="panNumber"
                        name="panNumber"
                        type="text"
                        inputMode="numeric"
                        placeholder="9-digit PAN number"
                        value={formData.panNumber}
                        onChange={handleChange}
                        aria-invalid={!!fieldErrors.panNumber}
                        className={inputClass("panNumber")}
                      />
                    </div>
                    {fieldErrors.panNumber && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-accent">
                        <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fieldErrors.panNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Business address */}
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-ink mb-1.5">
                    Street Address
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral" />
                    <input
                      id="street"
                      name="street"
                      type="text"
                      placeholder="123 Main Street"
                      value={formData.street}
                      onChange={handleChange}
                      aria-invalid={!!fieldErrors.street}
                      className={inputClass("street")}
                    />
                  </div>
                  {fieldErrors.street && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-accent">
                      <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {fieldErrors.street}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-ink mb-1.5">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Kathmandu"
                      value={formData.city}
                      onChange={handleChange}
                      aria-invalid={!!fieldErrors.city}
                      className={`w-full px-4 py-2.5 rounded-lg border bg-cream text-ink placeholder:text-neutral/70 text-sm outline-none transition focus:ring-2 ${
                        fieldErrors.city
                          ? "border-accent focus:border-accent focus:ring-accent/20"
                          : "border-neutral/40 focus:border-olive focus:ring-olive/20"
                      }`}
                    />
                    {fieldErrors.city && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-accent">
                        <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fieldErrors.city}
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-ink mb-1.5">
                      State / Province
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      placeholder="Bagmati"
                      value={formData.state}
                      onChange={handleChange}
                      aria-invalid={!!fieldErrors.state}
                      className={`w-full px-4 py-2.5 rounded-lg border bg-cream text-ink placeholder:text-neutral/70 text-sm outline-none transition focus:ring-2 ${
                        fieldErrors.state
                          ? "border-accent focus:border-accent focus:ring-accent/20"
                          : "border-neutral/40 focus:border-olive focus:ring-olive/20"
                      }`}
                    />
                    {fieldErrors.state && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-accent">
                        <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fieldErrors.state}
                      </p>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-ink mb-1.5">
                      Country
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      placeholder="Nepal"
                      value={formData.country}
                      onChange={handleChange}
                      aria-invalid={!!fieldErrors.country}
                      className={`w-full px-4 py-2.5 rounded-lg border bg-cream text-ink placeholder:text-neutral/70 text-sm outline-none transition focus:ring-2 ${
                        fieldErrors.country
                          ? "border-accent focus:border-accent focus:ring-accent/20"
                          : "border-neutral/40 focus:border-olive focus:ring-olive/20"
                      }`}
                    />
                    {fieldErrors.country && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-accent">
                        <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fieldErrors.country}
                      </p>
                    )}
                  </div>

                  {/* Postal code */}
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-ink mb-1.5">
                      Postal Code
                    </label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      placeholder="44600"
                      value={formData.postalCode}
                      onChange={handleChange}
                      aria-invalid={!!fieldErrors.postalCode}
                      className={`w-full px-4 py-2.5 rounded-lg border bg-cream text-ink placeholder:text-neutral/70 text-sm outline-none transition focus:ring-2 ${
                        fieldErrors.postalCode
                          ? "border-accent focus:border-accent focus:ring-accent/20"
                          : "border-neutral/40 focus:border-olive focus:ring-olive/20"
                      }`}
                    />
                    {fieldErrors.postalCode && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-accent">
                        <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fieldErrors.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                {/* PAN image */}
                <div>
                  <label htmlFor="panImage" className="block text-sm font-medium text-ink mb-1.5">
                    PAN Card Photo
                  </label>
                  <label
                    htmlFor="panImage"
                    className={`flex items-center gap-2.5 w-full px-4 py-2.5 rounded-lg border bg-cream text-sm cursor-pointer transition ${
                      fieldErrors.panImage
                        ? "border-accent text-accent"
                        : "border-neutral/40 text-neutral hover:border-olive"
                    }`}
                  >
                    <FiUpload className="w-4.5 h-4.5 shrink-0" />
                    <span className="truncate">
                      {formData.panImage ? formData.panImage.name : "Upload a photo of your PAN card"}
                    </span>
                  </label>
                  <input
                    id="panImage"
                    name="panImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  {fieldErrors.panImage && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-accent">
                      <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {fieldErrors.panImage}
                    </p>
                  )}
                </div>
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
                    Creating account...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-neutral mt-6">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-olive hover:text-accent transition">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
