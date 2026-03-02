import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Route, Routes, useLocation } from "react-router-dom";
import SideNav from "@/components/dashboard/SideNav";
import TopNav from "@/components/dashboard/TopNav";
import MarketplaceBasic from "@/components/dashboard/MarketplaceBasic";
import MarketplaceAdmin from "@/components/dashboard/MarketplaceAdmin";
import ContestsBasic from "@/components/dashboard/ContestsBasic";
import ContestsAdmin from "@/components/dashboard/ContestsAdmin";
import ContentUploadsBasic from "@/components/dashboard/ContentUploadsBasic";
import ContentUploadsAdmin from "@/components/dashboard/ContentUploadsAdmin";
import MembershipBasic from "@/components/dashboard/MembershipBasic";
import MembershipAdmin from "@/components/dashboard/MembershipAdmin";
import TokenBasic from "@/components/dashboard/TokenBasic";
import TokenAdmin from "@/components/dashboard/TokenAdmin";
import BasicDashboard from "@/components/dashboard/BasicDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [memberName, setMemberName] = useState<string>("");
  const [memberInitials, setMemberInitials] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate("/login");
        return;
      }

      setUser(data.user);

      try {
        const { data: profileData, error } = await supabase
          .from("user_profiles")
          .select("role, tokens")
          .eq("user_id", String(data.user.id))
          .maybeSingle();

        if (error) {
          console.error("Profile fetch error:", error);
        }

        if (!profileData) {
          setRole("basic");
          setMemberName(data.user.email || "");
          setMemberInitials((data.user.email || "").slice(0, 2).toUpperCase());
        } else {
          setRole(profileData.role || "basic");
          const name = profileData.role === "admin" ? "Admin" : data.user.email;
          setMemberName(name);
          setMemberInitials(name.slice(0, 2).toUpperCase());
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setRole("basic");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    if (location.pathname.endsWith("/dashboard")) setActive("dashboard");
    else if (location.pathname.endsWith("/marketplace")) setActive("marketplace");
    else if (location.pathname.endsWith("/contests")) setActive("contests");
    else if (location.pathname.endsWith("/content-uploads")) setActive("content-uploads");
  }, [location.pathname]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return null;
  if (!role) return <div className="p-10 text-center">Loading role...</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <SideNav
        active={active}
        memberName={memberName}
        memberInitials={memberInitials}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopNav
          onMenuClick={() => setSidebarOpen((o) => !o)}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={role === "admin" ? <AdminDashboard /> : <BasicDashboard />} />
            <Route path="marketplace" element={role === "admin" ? <MarketplaceAdmin /> : <MarketplaceBasic />} />
            <Route path="contests" element={role === "admin" ? <ContestsAdmin /> : <ContestsBasic />} />
            <Route path="content-uploads" element={role === "admin" ? <ContentUploadsAdmin /> : <ContentUploadsBasic />} />
            <Route path="membership" element={role === "admin" ? <MembershipAdmin /> : <MembershipBasic />} />
            <Route path="token" element={role === "admin" ? <TokenAdmin /> : <TokenBasic />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
