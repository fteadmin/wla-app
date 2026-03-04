"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { useRouter, usePathname } from "next/navigation";

export default function Dashboard() {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<any>(null);
	const [role, setRole] = useState<string | null>(null);
	const [memberName, setMemberName] = useState<string>("");
	const [memberInitials, setMemberInitials] = useState<string>("");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [active, setActive] = useState("dashboard");
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const fetchUserProfile = async () => {
			const { data } = await supabase.auth.getUser();
			if (!data.user) {
				router.push("/login");
				return;
			}

			setUser(data.user);

			try {
				const { data: profileData, error } = await supabase
					.from("user_profiles")
					.select("role, tokens")
					.eq("id", String(data.user.id))
					.maybeSingle();

				if (error) {
					console.error("Profile fetch error:", error);
				}

				if (!profileData) {
					setRole("community");
					setMemberName(data.user.email || "");
					setMemberInitials((data.user.email || "").slice(0, 2).toUpperCase());
				} else {
					setRole(profileData.role || "community");
					const name = profileData.role === "admin" ? "Admin" : data.user.email;
					setMemberName(name);
					setMemberInitials(name.slice(0, 2).toUpperCase());
				}
			} catch (err) {
				console.error("Error fetching profile:", err);
				setRole("community");
			} finally {
				setLoading(false);
			}
		};

		fetchUserProfile();
	}, [router]);

	useEffect(() => {
		if (pathname.endsWith("/dashboard")) setActive("dashboard");
		else if (pathname.endsWith("/marketplace")) setActive("marketplace");
		else if (pathname.endsWith("/contests")) setActive("contests");
		else if (pathname.endsWith("/events")) setActive("events");
		else if (pathname.endsWith("/my-contents")) setActive("my-contents");
	}, [pathname]);

	if (loading) return <div className="p-10 text-center">Loading...</div>;
	if (!user) return null;
	if (!role) return <div className="p-10 text-center">Loading role...</div>;

	// Render dashboard content based on role
	 return (
	   <div className="flex-1 flex flex-col overflow-hidden min-w-0">
	     <TopNav
	       onMenuClick={() => setSidebarOpen((o) => !o)}
	       sidebarOpen={sidebarOpen}
	     />
	     <main className="flex-1 overflow-y-auto">
	       {/* Render the main dashboard page based on role */}
	       {role === "admin" ? <AdminDashboard /> : <BasicDashboard />}
	     </main>
	   </div>
	 );
}