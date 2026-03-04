"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import TopNav from "../../../src/components/dashboard/TopNav";
import MessagesBasic from "../../../src/components/dashboard/MessagesBasic";

export default function MessagesPage() {
  const [userId, setUserId]   = useState<string | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) { router.push("/login"); return; }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", auth.user.id)
        .single();

      const role = profile?.role;
      if (role === "community" || role === "admin") {
        setUserId(auth.user.id);
        setAllowed(true);
      } else {
        setAllowed(false);
      }
    }
    check();
  }, [router]);

  if (allowed === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sora">
        <div className="text-[#a0a0b4]">Loading…</div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sora">
        <div className="text-[#a0a0b4] text-sm">Messaging is available to members only.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sora">
      <TopNav />
      <main className="flex-1 w-full overflow-hidden">
        <MessagesBasic userId={userId!} />
      </main>
    </div>
  );
}
