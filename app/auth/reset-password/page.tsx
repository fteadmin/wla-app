"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Eye, EyeOff, Check, X } from "lucide-react";

const CHECKS = [
  { label: "At least 8 characters",  test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter",        test: (p: string) => /[A-Z]/.test(p) },
  { label: "Number",                  test: (p: string) => /[0-9]/.test(p) },
  { label: "Symbol (!@#$…)",          test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const STRENGTH_META = [
  { label: "",            bar: "bg-transparent" },
  { label: "Weak",        bar: "bg-red-500" },
  { label: "Fair",        bar: "bg-yellow-400" },
  { label: "Strong",      bar: "bg-[#D9BA84]" },
  { label: "Very Strong", bar: "bg-emerald-400" },
];

export default function ResetPassword() {
  const [ready, setReady]           = useState(false);
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [showCf, setShowCf]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [done, setDone]             = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const router = useRouter();

  const passed = CHECKS.map(c => c.test(password));
  const score  = passed.filter(Boolean).length;
  const meta   = STRENGTH_META[score];

  // Supabase fires PASSWORD_RECOVERY when the reset link is opened
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (score < 3) { setError("Please choose a stronger password."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setDone(true);
      setTimeout(() => router.push("/login"), 3000);
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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D9BA84] to-[#C8B450] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(217,186,132,0.25)] flex-shrink-0">
            <Sparkles size={18} className="text-black" />
          </div>
          <span className="text-lg font-bold tracking-wider">WLA</span>
        </div>

        {done ? (
          <div className="text-center space-y-3 animate-in fade-in duration-300">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
              <Check size={24} />
            </div>
            <h2 className="text-xl font-extrabold">Password updated!</h2>
            <p className="text-[13px] text-gray-400">Redirecting you to login…</p>
          </div>
        ) : !ready ? (
          <div className="text-center space-y-3">
            <h2 className="text-xl font-extrabold">Verifying link…</h2>
            <p className="text-[13px] text-gray-400">
              If this page stays here, your reset link may have expired.{" "}
              <a href="/forgot-password" className="text-[#D9BA84] underline">Request a new one.</a>
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold tracking-tight mb-1">Set new password</h2>
            <p className="text-[13px] text-gray-400 mb-6">Choose a strong password for your account.</p>
            <div className="h-px bg-[#D9BA84]/15 mb-6 w-full" />

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New password */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-gray-400">New Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    className="w-full bg-[#161616] border border-[#D9BA84]/15 rounded-xl py-2.5 pl-4 pr-10 text-sm outline-none focus:border-[#D9BA84]/60 transition-all"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a0b4] hover:text-white" onClick={() => setShowPw(v => !v)}>
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                {/* Strength bar */}
                {password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? meta.bar : "bg-white/8"}`} />
                      ))}
                    </div>
                    <p className={`text-[11px] font-semibold ${score <= 1 ? "text-red-400" : score === 2 ? "text-yellow-400" : score === 3 ? "text-[#D9BA84]" : "text-emerald-400"}`}>
                      {meta.label}
                    </p>
                    <ul className="space-y-1">
                      {CHECKS.map((c, i) => (
                        <li key={i} className={`flex items-center gap-1.5 text-[11px] ${passed[i] ? "text-emerald-400" : "text-[#a0a0b4]"}`}>
                          {passed[i] ? <Check size={10} /> : <X size={10} />}
                          {c.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-gray-400">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showCf ? "text" : "password"}
                    className={`w-full bg-[#161616] border rounded-xl py-2.5 pl-4 pr-10 text-sm outline-none transition-all ${
                      confirm && confirm !== password ? "border-red-500/60" : "border-[#D9BA84]/15 focus:border-[#D9BA84]/60"
                    }`}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a0b4] hover:text-white" onClick={() => setShowCf(v => !v)}>
                    {showCf ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {confirm && confirm !== password && (
                  <p className="text-[11px] text-red-400">Passwords do not match.</p>
                )}
              </div>

              {error && <div className="text-[11px] text-red-400 bg-red-400/10 border border-red-400/20 p-2.5 rounded-lg text-center">{error}</div>}

              <button
                type="submit"
                disabled={loading || score < 3}
                className="w-full py-3 bg-gradient-to-br from-[#D9BA84] to-[#C8B450] text-black font-bold text-sm rounded-xl hover:translate-y-[-1px] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
