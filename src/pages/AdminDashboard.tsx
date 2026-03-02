"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      // Check role
      let profile: any = null;
      {
        const { data: p, error: error1 } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("user_id", data.user.id)
          .single();
        if (!error1 && p) {
          profile = p;
        } else {
          const { data: p2, error: error2 } = await supabase
            .from("user_profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();
          if (!error2 && p2) {
            profile = p2;
          }
        }
      }
      if (!profile || profile.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      setRole(profile.role);
      setLoading(false);
    });
  }, [router]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-2">Hello, {user.email}!</p>
      <p>This is the admin dashboard.</p>
    </div>
  );
}
