"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError("Please enter your email address."); return; }
    setLoading(true);
    setError(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setLoading(false);
    if (resetError) {
      setError(resetError.message);
    } else {
      setSent(true);
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

        {sent ? (
          <div className="text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#D9BA84]/10 border border-[#D9BA84]/20 flex items-center justify-center text-[#D9BA84]">
              <Mail size={24} />
            </div>
            <h2 className="text-xl font-extrabold">Check your inbox</h2>
            <p className="text-[13px] text-gray-400">
              We sent a password reset link to <span className="text-white font-semibold">{email}</span>. Click the link in the email to set a new password.
            </p>
            <p className="text-[11px] text-[#a0a0b4]">Didn&apos;t get it? Check your spam folder.</p>
            <Link href="/login" className="inline-flex items-center gap-2 text-[13px] text-[#D9BA84] font-semibold hover:underline mt-2">
              <ArrowLeft size={13} /> Back to login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold tracking-tight mb-1">Forgot password?</h2>
            <p className="text-[13px] text-gray-400 mb-6">Enter your email and we&apos;ll send you a reset link.</p>
            <div className="h-px bg-[#D9BA84]/15 mb-6 w-full" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-gray-400">Email Address</label>
                <input
                  type="email"
                  className="w-full bg-[#161616] border border-[#D9BA84]/15 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-[#D9BA84]/60 transition-all"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              {error && <div className="text-[11px] text-red-400 bg-red-400/10 border border-red-400/20 p-2.5 rounded-lg text-center">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-br from-[#D9BA84] to-[#C8B450] text-black font-bold text-sm rounded-xl hover:translate-y-[-1px] transition-all disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="text-center">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-[13px] text-[#a0a0b4] hover:text-[#D9BA84] transition-colors">
                  <ArrowLeft size={12} /> Back to login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
