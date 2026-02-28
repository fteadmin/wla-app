
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
// ...existing code...

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [memberName, setMemberName] = useState<string>("");
  const [memberInitials, setMemberInitials] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        navigate("/login");
      } else {
        setUser(data.user);
        // Fetch user role and profile info from user_profiles
        let profile: any = null;
        {
          const { data: p } = await supabase
            .from('user_profiles')
            .select('role,first_name,last_name,email')
            .eq('user_id', data.user.id)
            .single();
          profile = p;
        }
        if (!profile) {
          // Try id column if user_id not found
          const { data: p2 } = await supabase
            .from('user_profiles')
            .select('role,first_name,last_name,email')
            .eq('id', data.user.id)
            .single();
          profile = p2;
        }
        setRole(profile?.role || 'basic');
        let first = profile?.first_name || data.user.user_metadata?.first_name || "";
        let last = profile?.last_name || data.user.user_metadata?.last_name || "";
        let email = profile?.email || data.user.email || "";
        let name = (first + " " + last).trim() || email;
        setMemberName(name);
        let initials = (first[0] || "").toUpperCase() + (last[0] || "").toUpperCase();
        if (!initials.trim()) {
          initials = email.slice(0, 2).toUpperCase();
        }
        setMemberInitials(initials);
      }
      setLoading(false);
    });
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

  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen">
      {/* Sidebar: hidden on mobile, toggled with button */}
      <div className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`fixed z-50 inset-y-0 left-0 w-64 transform bg-[#0a0a0a] border-r border-[rgba(217,186,132,0.12)] transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:w-[220px]`} style={{ minHeight: '100vh' }}>
        <SideNav active={active} memberName={memberName} memberInitials={memberInitials} />
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        {/* TopNav with mobile menu button */}
        <div className="sticky top-0 z-30">
          <TopNav onMenuClick={() => setSidebarOpen(o => !o)} />
        </div>
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
          <Routes>
            <Route path="/" element={role === 'admin' ? <AdminDashboard /> : <BasicDashboard />} />
            <Route path="marketplace" element={role === 'admin' ? <MarketplaceAdmin /> : <MarketplaceBasic />} />
            <Route path="contests" element={role === 'admin' ? <ContestsAdmin /> : <ContestsBasic />} />
            <Route path="content-uploads" element={role === 'admin' ? <ContentUploadsAdmin /> : <ContentUploadsBasic />} />
            <Route path="membership" element={role === 'admin' ? <MembershipAdmin /> : <MembershipBasic />} />
            <Route path="token" element={role === 'admin' ? <TokenAdmin /> : <TokenBasic />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
