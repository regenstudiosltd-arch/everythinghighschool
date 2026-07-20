import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail, Phone, User, UserPlus } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import aehLogo from "@/imports/AEH_LOGO.jpeg";
import { useAuth } from "@/lib/auth";

type AuthMode = "login" | "register";

type AuthPageProps = {
  defaultMode?: AuthMode;
  onSuccess: () => void;
  onBack: () => void;
};

export function AuthPage({ defaultMode = "login", onSuccess, onBack }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const { session, profile, actionLoading, signIn, signUp, sendPasswordResetEmail, error: authError } = useAuth();

  useEffect(() => {
    setMode(defaultMode);
    setResetMode(false);
    setError("");
    setNotice("");
  }, [defaultMode]);

  useEffect(() => {
    if (session && profile?.role !== "admin") {
      onSuccess();
    }
  }, [onSuccess, profile?.role, session]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const validateLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return false;
    }

    return true;
  };

  const validateRegister = () => {
    if (!fullName.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setError("Please complete all registration fields.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (resetMode) {
      if (!email.trim()) {
        setError("Enter the email address to receive a reset link.");
        return;
      }

      const message = await sendPasswordResetEmail(email.trim());
      setNotice(message);
      return;
    }

    if (mode === "login") {
      if (!validateLogin()) {
        return;
      }

      const signedInProfile = await signIn(email.trim(), password);
      if (signedInProfile) {
        onSuccess();
      }
      return;
    }

    if (!validateRegister()) {
      return;
    }

    const { message } = await signUp({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password,
    });

    setNotice(message);
    if (message.includes("created successfully") || message.includes("Check your email")) {
      setMode("login");
      setResetMode(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1F5E] to-[#1D4ED8] flex items-center justify-center p-4 pt-20">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-center mb-7">
          <div className="inline-block mb-4">
            <ImageWithFallback src={aehLogo} alt="Everything HighSchool" className="h-12 w-auto object-contain mx-auto" />
          </div>
          <h1 className="text-xl font-bold text-[#0F172A]">{resetMode ? "Reset Password" : mode === "login" ? "Customer Login" : "Create Account"}</h1>
          <p className="text-[#64748B] text-sm mt-1">
            {resetMode
              ? "Request a password reset link for your account."
              : mode === "login"
                ? "Sign in to manage orders, vouchers, and your dashboard."
                : "Create a customer account to place orders and track progress."}
          </p>
        </div>

        <div className="flex rounded-2xl bg-[#F8FAFC] p-1 mb-5">
          <button type="button" onClick={() => { setMode("login"); setResetMode(false); setError(""); setNotice(""); }} className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${mode === "login" && !resetMode ? "bg-white text-[#1D4ED8] shadow-sm" : "text-[#64748B]"}`}>
            Login
          </button>
          <button type="button" onClick={() => { setMode("register"); setResetMode(false); setError(""); setNotice(""); }} className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${mode === "register" ? "bg-white text-[#1D4ED8] shadow-sm" : "text-[#64748B]"}`}>
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && !resetMode && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0F172A]">Full Name</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" autoComplete="name" className="w-full rounded-xl border border-border py-3 pl-10 pr-4 text-sm transition-all focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0F172A]">Phone Number</label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+233 XX XXX XXXX" autoComplete="tel" className="w-full rounded-xl border border-border py-3 pl-10 pr-4 text-sm transition-all focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#0F172A]">Email Address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" autoComplete="email" className="w-full rounded-xl border border-border py-3 pl-10 pr-4 text-sm transition-all focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20" />
            </div>
          </div>

          {!resetMode && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#0F172A]">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete={mode === "login" ? "current-password" : "new-password"} className="w-full rounded-xl border border-border py-3 pl-10 pr-11 text-sm transition-all focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569]">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {notice && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {notice}
            </div>
          )}

          {mode === "login" && !resetMode && (
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setResetMode(true)} className="text-sm font-semibold text-[#1D4ED8] hover:underline">
                Forgot Password?
              </button>
              <button type="button" onClick={() => { setMode("register"); setResetMode(false); }} className="text-sm font-semibold text-[#475569] hover:text-[#0F172A]">
                Create account
              </button>
            </div>
          )}

          {resetMode && (
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setResetMode(false)} className="text-sm font-semibold text-[#475569] hover:text-[#0F172A]">
                Back to login
              </button>
              <span className="text-xs text-[#94A3B8]">We will send a reset link to your email</span>
            </div>
          )}

          <button type="submit" disabled={actionLoading} className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${actionLoading ? "cursor-wait bg-[#1D4ED8]/60 text-white" : "bg-[#1D4ED8] text-white hover:bg-[#1E40AF]"}`}>
            {actionLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Working…
              </>
            ) : resetMode ? (
              <>
                <ArrowRight className="h-4 w-4" /> Send Reset Email
              </>
            ) : mode === "login" ? (
              <>
                <Lock className="h-4 w-4" /> Sign In
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> Create Account
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button onClick={onBack} className="mx-auto flex items-center gap-1.5 text-sm text-[#64748B] transition-colors hover:text-[#0F172A]">
            <ArrowRight className="h-3.5 w-3.5 rotate-180" /> Back to Website
          </button>
        </div>
      </div>
    </div>
  );
}
