"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles } from "lucide-react";

export default function Signup() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
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

		setLoading(true);
		try {
			const { data, error: signUpError } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: { first_name: firstName, last_name: lastName },
					emailRedirectTo: `${window.location.origin}/dashboard`
				}
			});

			if (signUpError || !data?.user) {
				console.error("Signup error:", JSON.stringify(signUpError, null, 2));
				throw new Error(signUpError?.message || "Sign up failed.");
			}

			if (data.session) {
				await new Promise(resolve => setTimeout(resolve, 500));
				router.push("/dashboard");
			} else {
				setError("Account created! Please check your email to confirm your account before logging in.");
				setTimeout(() => {
					router.push("/login");
				}, 3000);
			}
		} catch (err: any) {
			console.error("Signup error:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen w-full bg-black font-['Sora'] text-white flex items-center justify-center p-6 relative overflow-hidden">
			{/* Background */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-[-10%] left-[20%] w-[80%] h-[50%] bg-[#D9BA84]/10 blur-[120px] rounded-full" />
				<div
					className="absolute inset-0 opacity-[0.04]"
					style={{ backgroundImage: `linear-gradient(#D9BA84 1px, transparent 1px), linear-gradient(90deg, #D9BA84 1px, transparent 1px)`, backgroundSize: '48px 48px' }}
				/>
			</div>

			<div className="relative z-10 w-full max-w-[420px] bg-[#0d0d0d] border border-[#D9BA84]/15 rounded-[24px] p-9 shadow-[0_32px_64px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in duration-300">
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

				<h2 className="text-2xl font-extrabold tracking-tight mb-1">Create account</h2>
				<p className="text-[13px] text-gray-400 mb-6">Join the WLA community and get started today.</p>
				<div className="h-px bg-[#D9BA84]/15 mb-6 w-full" />

				<form onSubmit={handleSignup} className="space-y-4">
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

					<div className="flex items-start gap-2 pt-2">
						<input type="checkbox" id="terms" className="mt-1 accent-[#D9BA84]" checked={terms} onChange={e => setTerms(e.target.checked)} />
						<label htmlFor="terms" className="text-[11px] text-gray-500">I agree to the <a href="#" className="text-[#D9BA84] underline">Terms</a> and <a href="#" className="text-[#D9BA84] underline">Privacy Policy</a></label>
					</div>

					{error && <div className="text-[11px] text-red-400 bg-red-400/10 border border-red-400/20 p-2.5 rounded-lg text-center">{error}</div>}

					<button type="submit" disabled={loading} className="w-full py-3 mt-2 bg-gradient-to-br from-[#D9BA84] to-[#C8B450] text-black font-bold text-sm rounded-xl hover:translate-y-[-1px] transition-all disabled:opacity-50">
						{loading ? "Creating..." : "Create Account"}
					</button>

					<div className="text-center pt-1">
						<Link href="/login" className="text-[13px] font-semibold text-[#D9BA84] hover:underline">Already have an account? Login</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
