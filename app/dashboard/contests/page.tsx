"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import TopNav from "../../../src/components/dashboard/TopNav";
import ContestsAdmin from "../../../src/components/dashboard/ContestsAdmin";
import ContestsBasic from "../../../src/components/dashboard/ContestsBasic";

export default function ContestsDashboard() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", auth.user.id)
        .single();

      setRole(profile?.role || "community");
      setLoading(false);
    }
    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sora">
        <div className="text-[#a0a0b4]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sora">
      <TopNav />
      <main className="flex-1 w-full">
        <div className="p-8">
          {role === "admin" ? <ContestsAdmin /> : <ContestsBasic />}
        </div>
      </main>
    </div>
  );
}
