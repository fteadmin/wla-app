
"use client";
import { useState } from "react";


export default function Auth({ mode = "login" }: { mode?: "login" | "signup" }) {
  const [tier, setTier] = useState<"basic" | "admin" | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="w-full max-w-md mx-auto rounded-2xl shadow-xl bg-white/90 backdrop-blur-lg border border-border p-8">
        {!tier ? (
          <>
            <h2 className="text-3xl font-display font-bold text-center mb-8">{mode === "signup" ? "Sign Up" : "Login"}</h2>
            <div className="flex gap-6 mb-8 justify-center">
              <button
                className="flex-1 py-4 rounded-xl border border-primary bg-primary text-primary-foreground font-semibold text-lg shadow hover:bg-primary/90 transition"
                onClick={() => setTier("basic")}
              >
                Basic User
              </button>
              <button
                className="flex-1 py-4 rounded-xl border border-secondary bg-secondary text-secondary-foreground font-semibold text-lg shadow hover:bg-secondary/90 transition"
                onClick={() => setTier("admin")}
              >
                Admin
              </button>
            </div>
            <p className="text-center text-muted-foreground text-sm mb-2">Choose your role to continue.</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">{tier === "basic" ? "Basic User" : "Admin"} {mode === "signup" ? "Sign Up" : "Login"}</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your email" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input type="password" className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your password" />
              </div>
              <div className="flex gap-4">
                {mode === "login" ? (
                  <button type="submit" className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition">Login</button>
                ) : (
                  <button type="submit" className="flex-1 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold shadow hover:bg-secondary/90 transition">Sign Up</button>
                )}
              </div>
            </form>
            <button className="mt-6 w-full py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition" onClick={() => setTier(null)}>Back</button>
          </>
        )}
      </div>
    </div>
  );
}

