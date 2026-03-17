
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, Shield, ArrowLeft, Sparkles } from "lucide-react";

export default function Login() {
  const [tier, setTier] = useState<"community" | "admin" | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

      if (loginError || !data.user) {
        throw new Error(loginError?.message || "Login failed.");
      }

      // Fetch user profile using maybeSingle to avoid 406 errors
      let profile: any = null;
      const { data: p, error: error1 } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!error1 && p) {
        profile = p;
      }

      // If profile doesn't exist, create it automatically
      if (!profile) {
        console.log("Profile not found, creating one for user:", data.user.id);
        const firstName = data.user.user_metadata?.first_name || "";
        const lastName = data.user.user_metadata?.last_name || "";
        const userEmail = data.user.email || "";
        
        const { data: newProfile, error: createError } = await supabase
          .from("user_profiles")
          .insert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            email: userEmail,
            role: "community",
            tokens: 0
          })
          .select("role")
          .maybeSingle();

        if (createError) {
          console.error("Failed to create profile:", createError);
          console.error("Error details:", JSON.stringify(createError, null, 2));
          throw new Error("Could not create user profile. Please contact support.");
        }

        profile = newProfile;
      }

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-black font-['Sora'] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Shared Background: Grid & Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[80%] h-[50%] bg-[#D9BA84]/10 blur-[120px] rounded-full" />
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ backgroundImage: `linear-gradient(#D9BA84 1px, transparent 1px), linear-gradient(90deg, #D9BA84 1px, transparent 1px)`, backgroundSize: '48px 48px' }}
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

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D9BA84] to-[#C8B450] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(217,186,132,0.25)] flex-shrink-0">
            <Sparkles size={18} className="text-black" />
          </div>
          <span className="text-lg font-bold tracking-wider">WLA</span>
          <span className="ml-auto font-mono text-[10px] text-[#D9BA84] bg-[#D9BA84]/10 border border-[#D9BA84]/20 px-2 py-1 rounded">
            Community
          </span>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight mb-1">Welcome back</h2>
        <p className="text-[13px] text-gray-400 mb-6">Sign in to access your WLA account.</p>
        <div className="h-px bg-[#D9BA84]/15 mb-6 w-full" />

        {!tier ? (
          <div className="animate-in slide-in-from-bottom-2 duration-300">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3">Sign in as</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                className={`flex flex-col gap-2 p-4 rounded-xl border-2 transition-all text-left ${hovered === "community" ? "border-[#D9BA84] bg-[#D9BA84]/10" : "border-[#D9BA84]/15 bg-[#161616]"}`}
                onClick={() => setTier("community")}
                onMouseEnter={() => setHovered("community")}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="w-8 h-8 bg-[#D9BA84]/15 text-[#D9BA84] rounded-lg flex items-center justify-center"><LogIn size={15} /></div>
                <span className="text-[13px] font-bold">Community Member</span>
                <span className="text-[11px] text-gray-400">Member sign in</span>
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
              <Link href="/signup" className="text-[13px] font-semibold text-[#D9BA84] hover:underline">Create account</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
            <button type="button" onClick={() => setTier(null)} className="flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold mb-4 bg-[#D9BA84]/10 text-[#D9BA84] border border-[#D9BA84]/20">
              <ArrowLeft size={11} /> Back to role selection
            </button>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-gray-400">Email Address</label>
              <input type="email" className="w-full bg-[#161616] border border-[#D9BA84]/15 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-[#D9BA84]/60 transition-all" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center"><label className="text-[12px] font-medium text-gray-400">Password</label><Link href="/forgot-password" className="text-[11px] text-[#D9BA84] hover:underline">Forgot password?</Link></div>
              <input type="password" className="w-full bg-[#161616] border border-[#D9BA84]/15 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-[#D9BA84]/60 transition-all" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            {error && <div className="text-[11px] text-red-400 bg-red-400/10 border border-red-400/20 p-2.5 rounded-lg text-center">{error}</div>}

            <button type="submit" disabled={loading} className="w-full py-3 mt-2 bg-gradient-to-br from-[#D9BA84] to-[#C8B450] text-black font-bold text-sm rounded-xl hover:translate-y-[-1px] transition-all">
              {loading ? "Signing in..." : "Sign in to WLA"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
