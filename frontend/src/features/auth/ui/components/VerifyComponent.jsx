import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FiLoader, FiAlertCircle } from "react-icons/fi";
import useAuth from "../../hook/useAuth.js";
import Loader from "../../../../components/Loader.jsx";
import ecomLaptop from "../../../../assets/ecom-laptop.jpg";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60 * 5;

function maskEmail(email) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 3);
  return `${visible}${"*".repeat(Math.max(local.length - visible.length, 3))}@${domain}`;
}

export default function VerifyComponent() {
  const { handleVerify } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, error, user } = useSelector((state) => state.auth);
  // Captured once on mount so a later authFailure (e.g. a wrong code)
  // can't wipe out the email we're meant to be verifying.
  const [email] = useState(() => location.state?.email || user?.email);

  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputRefs = useRef([]);

  // Nothing to verify without an email — this page only makes sense
  // right after registration, which hands it off via router state.
  useEffect(() => {
    if (!email) navigate("/register/buyer", { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
  };

  const handleDigitChange = (index, value) => {
    const clean = value.replace(/\D/g, "");

    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean ? clean[clean.length - 1] : "";
      return next;
    });

    if (clean && index < CODE_LENGTH - 1) focusInput(index + 1);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();

    setDigits((prev) => {
      const next = [...prev];
      pasted.split("").forEach((char, i) => {
        next[i] = char;
      });
      return next;
    });
    focusInput(Math.min(pasted.length, CODE_LENGTH - 1));
  };

  const handleResend = () => {
    console.log("dont forget to wire up resend verification code endpoint");
    setSecondsLeft(RESEND_SECONDS);
  };

  const code = digits.join("");
  const isComplete = code.length === CODE_LENGTH;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isComplete) return;
    setSubmitted(true);
    handleVerify({ email, code });
  };

  if (isLoading) return <Loader />;
  if (!email) return null;

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
            Almost there.
          </h1>
          <p className="text-white/90 text-sm">
            Verify your email to start browsing and buying laptops on
            LapHub.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-ink mb-1">
            Verify your email
          </h2>
          <p className="text-sm text-neutral mb-6">
            We&apos;ve sent an email to{" "}
            <span className="font-semibold text-ink">{maskEmail(email)}</span>
          </p>

          {submitted && error && (
            <div className="mb-5 flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
              <FiAlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="flex gap-2 sm:gap-3" onPaste={handlePaste}>
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-lg font-semibold rounded-lg border border-neutral/40 bg-white text-ink outline-none focus:border-olive focus:ring-2 focus:ring-olive/20 transition"
                />
              ))}
            </div>

            <p className="text-sm text-neutral mt-4">
              Didn&apos;t receive the code?{" "}
              {secondsLeft > 0 ? (
                <span className="text-neutral/70">
                  Get a new one in {secondsLeft}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-medium text-olive hover:text-accent underline transition"
                >
                  Get a new one
                </button>
              )}
            </p>

            <button
              type="submit"
              disabled={!isComplete || isLoading}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition shadow-sm mt-8"
            >
              {isLoading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Continue"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full border border-neutral/40 bg-white text-ink text-sm font-semibold py-2.5 rounded-lg mt-3 hover:bg-cream transition"
            >
              Go back
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
