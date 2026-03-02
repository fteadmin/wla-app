

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Shield, ArrowLeft, Sparkles } from "lucide-react";

export default function Signup() {
	const [tier, setTier] = useState<"basic" | "admin" | null>(null);
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
	const router = useRouter();

	async function handleSignup(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		if (!firstName || !lastName || !email || !password || !confirm) {
			setError("Please fill in all fields.");
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
				options: { data: { first_name: firstName, last_name: lastName } }
			});

			if (signUpError || !data?.user) throw new Error(signUpError?.message || "Sign up failed.");

			// Insert user profile with correct user_id
			const { error: profileError } = await supabase.from("user_profiles").insert([
				{
					user_id: data.user.id,
					role: tier,
					first_name: firstName,
					last_name: lastName,
					email: email,
				}
			]);

			if (profileError) {
				console.error("Failed to save user profile:", profileError);
				throw new Error("Failed to save user profile: " + profileError.message);
			}

			router.push(tier === "admin" ? "/admin-dashboard" : "/dashboard");
		} catch (err: any) {
			console.error("Signup error:", err);
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
				{/* Brand Header (Consistent with Login) */}
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 bg-gradient-to-br from-[#D9BA84] to-[#C8B450] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(217,186,132,0.25)] flex-shrink-0">
						<Sparkles size={18} className="text-black" />
					</div>
					<span className="text-lg font-bold tracking-wider">WLA</span>
					<span className="ml-auto font-mono text-[10px] text-[#D9BA84] bg-[#D9BA84]/10 border border-[#D9BA84]/20 px-2 py-1 rounded">
						Community
					</span>
				</div>

				<h2 className="text-2xl font-extrabold tracking-tight mb-1">Create account</h2>
				<p className="text-[13px] text-gray-400 mb-6">Join the WLA community and get started today.</p>
				<div className="h-px bg-[#D9BA84]/15 mb-6 w-full" />

				{!tier ? (
					<div className="animate-in slide-in-from-bottom-2 duration-300">
						<p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3">I am signing up as</p>
						<div className="grid grid-cols-2 gap-3 mb-5">
							<button
								className={`flex flex-col gap-2 p-4 rounded-xl border-2 transition-all text-left ${hovered === "basic" ? "border-[#D9BA84] bg-[#D9BA84]/10" : "border-[#D9BA84]/15 bg-[#161616]"}`}
								onClick={() => setTier("basic")}
								onMouseEnter={() => setHovered("basic")}
								onMouseLeave={() => setHovered(null)}
							>
								<div className="w-8 h-8 bg-[#D9BA84]/15 text-[#D9BA84] rounded-lg flex items-center justify-center"><UserPlus size={15} /></div>
								<span className="text-[13px] font-bold">Basic User</span>
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

						<div className="space-y-1.5">
							<label className="text-[12px] font-medium text-gray-400">Password</label>
							<input type="password" className="w-full bg-[#161616] border border-[#D9BA84]/15 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-[#D9BA84]/60 transition-all" value={password} onChange={e => setPassword(e.target.value)} />
						</div>

						<div className="space-y-1.5">
							<label className="text-[12px] font-medium text-gray-400">Confirm Password</label>
							<input type="password" className="w-full bg-[#161616] border border-[#D9BA84]/15 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-[#D9BA84]/60 transition-all" value={confirm} onChange={e => setConfirm(e.target.value)} />
						</div>

						{tier === "admin" && (
							<div className="space-y-1.5">
								<label className="text-[12px] font-bold text-[#D9BA84]">Admin Access Code</label>
								<input className="w-full bg-[#D9BA84]/5 border border-[#D9BA84]/30 rounded-xl py-2.5 px-4 text-sm text-[#D9BA84] outline-none" placeholder="Enter code" value={adminCode} onChange={e => setAdminCode(e.target.value)} />
							</div>
						)}

						<div className="flex items-start gap-2 pt-2">
							<input type="checkbox" id="terms" className="mt-1 accent-[#D9BA84]" checked={terms} onChange={e => setTerms(e.target.checked)} />
							<label htmlFor="terms" className="text-[11px] text-gray-500">I agree to the <a href="#" className="text-[#D9BA84] underline">Terms</a> and <a href="#" className="text-[#D9BA84] underline">Privacy Policy</a></label>
						</div>

						{error && <div className="text-[11px] text-red-400 bg-red-400/10 border border-red-400/20 p-2.5 rounded-lg text-center">{error}</div>}

						<button type="submit" disabled={loading} className="w-full py-3 mt-2 bg-gradient-to-br from-[#D9BA84] to-[#C8B450] text-black font-bold text-sm rounded-xl hover:translate-y-[-1px] transition-all disabled:opacity-50">
							{loading ? "Creating..." : "Create Account"}
						</button>
					</form>
				)}
			</div>
		</div>
	);
}