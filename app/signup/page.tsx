"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Shield, ArrowLeft, Sparkles, Eye, EyeOff, Check, X } from "lucide-react";

// ── Password strength ─────────────────────────────────────────────────────────
const CHECKS = [
  { label: "At least 8 characters",  test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter",        test: (p: string) => /[A-Z]/.test(p) },
  { label: "Number",                  test: (p: string) => /[0-9]/.test(p) },
  { label: "Symbol (!@#$…)",          test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const STRENGTH_META = [
  { label: "",             bar: "bg-transparent" },
  { label: "Weak",         bar: "bg-red-500" },
  { label: "Fair",         bar: "bg-yellow-400" },
  { label: "Strong",       bar: "bg-[#D9BA84]" },
  { label: "Very Strong",  bar: "bg-emerald-400" },
];

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const passed = CHECKS.map(c => c.test(password));
  const score  = passed.filter(Boolean).length;
  const meta   = STRENGTH_META[score];

  return (
    <div className="mt-2 space-y-2">
      {/* Bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? meta.bar : "bg-white/8"}`}
          />
        ))}
      </div>
      {/* Label */}
      <p className={`text-[11px] font-semibold ${score <= 1 ? "text-red-400" : score === 2 ? "text-yellow-400" : score === 3 ? "text-[#D9BA84]" : "text-emerald-400"}`}>
        {meta.label}
      </p>
      {/* Criteria */}
      <ul className="space-y-1">
        {CHECKS.map((c, i) => (
          <li key={i} className={`flex items-center gap-1.5 text-[11px] ${passed[i] ? "text-emerald-400" : "text-[#a0a0b4]"}`}>
            {passed[i] ? <Check size={10} /> : <X size={10} />}
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Signup() {
  const [tier, setTier] = useState<"community" | "admin" | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const passwordScore = CHECKS.filter(c => c.test(password)).length;

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!firstName || !lastName || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (passwordScore < 3) {
      setError("Please choose a stronger password.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!terms) {
      setError("You must agree to the terms.");
      return;
    }
    if (tier === "admin" && adminCode !== "WLA-ADMIN-2026") {
      setError("Invalid admin access code.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { first_name: firstName, last_name: lastName },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (signUpError || !data?.user) {
        throw new Error(signUpError?.message || "Sign up failed.");
      }

      if (data.session) {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (tier === "admin") {
          await supabase.from("user_profiles").update({ role: "admin" }).eq("id", data.user.id);
        }
        router.push("/dashboard");
      } else {
        setError("Account created! Please check your email to confirm your account before logging in.");
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-black font-['Sora'] text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[80%] h-[50%] bg-[#D9BA84]/10 blur-[120px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `linear-gradient(#D9BA84 1px, transparent 1px), linear-gradient(90deg, #D9BA84 1px, transparent 1px)`, backgroundSize: "48px 48px" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[420px] bg-[#0d0d0d] border border-[#D9BA84]/15 rounded-[24px] p-9 shadow-[0_32px_64px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in duration-300">
        {/* Back to Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 mb-5 px-3 py-1.5 rounded-lg border border-[#D9BA84]/20 bg-[#161616] hover:bg-[#D9BA84]/10 hover:border-[#D9BA84]/40 text-[12px] font-semibold text-[#a0a0b4] hover:text-[#D9BA84] transition-all"
        >
          <ArrowLeft size={13} />
          Back to home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D9BA84] to-[#C8B450] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(217,186,132,0.25)] flex-shrink-0">
            <Sparkles size={18} className="text-black" />
          </div>
          <span className="text-lg font-bold tracking-wider">WLA</span>
          <span className="ml-auto font-mono text-[10px] text-[#D9BA84] bg-[#D9BA84]/10 border border-[#D9BA84]/20 px-2 py-1 rounded">Community</span>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight mb-1">Create account</h2>
        <p className="text-[13px] text-gray-400 mb-6">Join the WLA community and get started today.</p>
        <div className="h-px bg-[#D9BA84]/15 mb-6 w-full" />

        {!tier ? (
          <div className="animate-in slide-in-from-bottom-2 duration-300">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3">I am signing up as</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                className={`flex flex-col gap-2 p-4 rounded-xl border-2 transition-all text-left ${hovered === "community" ? "border-[#D9BA84] bg-[#D9BA84]/10" : "border-[#D9BA84]/15 bg-[#161616]"}`}
                onClick={() => setTier("community")}
                onMouseEnter={() => setHovered("community")}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="w-8 h-8 bg-[#D9BA84]/15 text-[#D9BA84] rounded-lg flex items-center justify-center"><UserPlus size={15} /></div>
                <span className="text-[13px] font-bold">Community Member</span>
                <span className="text-[11px] text-gray-400">Standard member</span>
              </button>
              <button
                className={`flex flex-col gap-2 p-4 rounded-xl border-2 transition-all text-left ${hovered === "admin" ? "border-[#C8B450] bg-[#C8B450]/10" : "border-[#D9BA84]/15 bg-[#161616]"}`}
                onClick={() => setTier("admin")}
                onMouseEnter={() => setHovered("admin")}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="w-8 h-8 bg-[#C8B450]/15 text-[#C8B450] rounded-lg flex items-center justify-center"><Shield size={15} /></div>
                <span className="text-[13px] font-bold">Admin</span>
                <span className="text-[11px] text-gray-400">Management</span>
              </button>
            </div>
            <div className="text-center">
              <Link href="/login" className="text-[13px] font-semibold text-[#D9BA84] hover:underline">Already have an account? Login</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
            <button type="button" onClick={() => setTier(null)} className="flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold mb-4 bg-[#D9BA84]/10 text-[#D9BA84] border border-[#D9BA84]/20">
              <ArrowLeft size={11} /> Back to selection
            </button>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-gray-400">First Name</label>
                <input className="w-full bg-[#161616] border border-[#D9BA84]/15 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-[#D9BA84]/60 transition-all" value={firstName} onChange={e => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-gray-400">Last Name</label>
                <input className="w-full bg-[#161616] border border-[#D9BA84]/15 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-[#D9BA84]/60 transition-all" value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-gray-400">Email Address</label>
              <input type="email" className="w-full bg-[#161616] border border-[#D9BA84]/15 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-[#D9BA84]/60 transition-all" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            {/* Password with strength meter */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-gray-400">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-[#161616] border border-[#D9BA84]/15 rounded-xl py-2.5 pl-4 pr-10 text-sm outline-none focus:border-[#D9BA84]/60 transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a0b4] hover:text-white transition-colors" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-gray-400">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  className={`w-full bg-[#161616] border rounded-xl py-2.5 pl-4 pr-10 text-sm outline-none transition-all ${
                    confirm && confirm !== password ? "border-red-500/60" : "border-[#D9BA84]/15 focus:border-[#D9BA84]/60"
                  }`}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a0b4] hover:text-white transition-colors" onClick={() => setShowConfirm(v => !v)}>
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {confirm && confirm !== password && (
                <p className="text-[11px] text-red-400">Passwords do not match.</p>
              )}
            </div>

            {tier === "admin" && (
              <div className="space-y-2">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-[#D9BA84]">Admin Access Code</label>
                  <input className="w-full bg-[#D9BA84]/5 border border-[#D9BA84]/30 rounded-xl py-2.5 px-4 text-sm text-[#D9BA84] outline-none" placeholder="Enter code" value={adminCode} onChange={e => setAdminCode(e.target.value)} />
                </div>
                <div className="text-xs text-[#a0a0b4] bg-[#D9BA84]/5 border border-[#D9BA84]/10 rounded-lg p-2">
                  <span className="font-semibold text-[#D9BA84]">Note:</span> Users with <code className="text-[#D9BA84]">@futuretrendsent.info</code> email addresses automatically receive admin access.
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 pt-2">
              <input type="checkbox" id="terms" className="mt-1 accent-[#D9BA84]" checked={terms} onChange={e => setTerms(e.target.checked)} />
              <label htmlFor="terms" className="text-[11px] text-gray-500">I agree to the <a href="#" className="text-[#D9BA84] underline">Terms</a> and <a href="#" className="text-[#D9BA84] underline">Privacy Policy</a></label>
            </div>

            {error && <div className="text-[11px] text-red-400 bg-red-400/10 border border-red-400/20 p-2.5 rounded-lg text-center">{error}</div>}

            <button
              type="submit"
              disabled={loading || passwordScore < 3}
              className="w-full py-3 mt-2 bg-gradient-to-br from-[#D9BA84] to-[#C8B450] text-black font-bold text-sm rounded-xl hover:translate-y-[-1px] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
