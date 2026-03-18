import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ─── Types ─────────────────────────────────────────────
type Mode = "login" | "register";

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// ─── Validation Helpers ────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PW = 6;

function validate(
  mode: Mode,
  email: string,
  password: string,
  confirmPassword: string
): FormErrors {
  const errors: FormErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < MIN_PW) {
    errors.password = `Password must be at least ${MIN_PW} characters`;
  }

  if (mode === "register") {
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  return errors;
}

// ─── Eye Icons ─────────────────────────────────────────
function EyeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function EyeSlashIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}

// ─── Main Component ────────────────────────────────────
export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial mode from the URL path
  const initialMode: Mode = location.pathname === "/register" ? "register" : "login";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [serverError, setServerError] = useState("");

  // Sync mode with URL changes
  useEffect(() => {
    setMode(location.pathname === "/register" ? "register" : "login");
  }, [location.pathname]);

  // Validate on every render (cheap)
  const errors = useMemo(
    () => validate(mode, email, password, confirmPassword),
    [mode, email, password, confirmPassword]
  );

  const isValid = Object.keys(errors).length === 0;

  // Show error only if field was touched or form was submitted
  const showError = useCallback(
    (field: keyof FormErrors) =>
      (touched[field] || submitted) && errors[field] ? errors[field] : "",
    [touched, submitted, errors]
  );

  // Toggle between login ↔ register
  const switchMode = () => {
    const newMode = mode === "login" ? "register" : "login";
    setMode(newMode);
    navigate(newMode === "login" ? "/login" : "/register", { replace: true });
    setTouched({});
    setSubmitted(false);
    setSuccessMsg("");
    setServerError("");
    setConfirmPassword("");
  };

  // Handle form submit — calls the backend API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");

    if (!isValid) return;

    setIsLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body: Record<string, string> = { email, password };
      if (mode === "register") {
        body.name = email.split("@")[0]; // Use part before @ as name
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // send session cookie
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        // Show server error message
        setServerError(data.message || "Something went wrong");
        return;
      }

      // Success!
      setSuccessMsg(
        mode === "login"
          ? "🎉 Login Successful! Redirecting…"
          : "🎉 Registered Successfully! Redirecting…"
      );

      // Redirect to dashboard after a brief pause
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Auth error:", err);
      setServerError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const blur = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  // ─── Render ──────────────────────────────────────────
  return (
    <div className="auth-page">
      {/* Decorative blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />

      <div className="auth-card">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4 cursor-pointer hover:scale-110 transition-transform"
            onClick={() => navigate("/")}
            title="Back to dashboard"
          >
            <span className="text-white font-bold text-lg">MR</span>
          </div>
          <h1 className="auth-title">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="auth-subtitle">
            {mode === "login"
              ? "Sign in to continue to Mini Resume"
              : "Get started with Mini Resume for free"}
          </p>
        </div>

        {/* Success Toast */}
        {successMsg && (
          <div className="auth-success animate-slide-up">{successMsg}</div>
        )}

        {/* Server Error */}
        {serverError && (
          <div className="auth-server-error animate-slide-up">{serverError}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Email */}
          <div className="auth-field">
            <label htmlFor="auth-email" className="auth-label">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setServerError(""); }}
              onBlur={() => blur("email")}
              placeholder="you@example.com"
              autoComplete="email"
              className={`auth-input ${showError("email") ? "auth-input-error" : ""}`}
            />
            {showError("email") && (
              <span className="auth-error">{showError("email")}</span>
            )}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="auth-password" className="auth-label">
              Password
            </label>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setServerError(""); }}
                onBlur={() => blur("password")}
                placeholder="••••••••"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className={`auth-input pr-11 ${showError("password") ? "auth-input-error" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="auth-eye"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
            {showError("password") && (
              <span className="auth-error">{showError("password")}</span>
            )}
          </div>

          {/* Confirm Password (register only) */}
          {mode === "register" && (
            <div className="auth-field animate-slide-up">
              <label htmlFor="auth-confirm" className="auth-label">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="auth-confirm"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => blur("confirmPassword")}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`auth-input pr-11 ${showError("confirmPassword") ? "auth-input-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="auth-eye"
                  tabIndex={-1}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
              {showError("confirmPassword") && (
                <span className="auth-error">
                  {showError("confirmPassword")}
                </span>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || (submitted && !isValid)}
            className="auth-submit"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {mode === "login" ? "Signing in…" : "Creating account…"}
              </span>
            ) : (
              mode === "login" ? "Sign In" : "Create Account"
            )}
          </button>
        </form>

        {/* Toggle */}
        <p className="auth-toggle">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button type="button" onClick={switchMode} className="auth-toggle-btn">
            {mode === "login" ? "Register" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
