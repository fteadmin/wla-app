import SideNav from "@/components/dashboard/SideNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-black text-white">
      <SideNav />
      <main className="flex-1 min-h-screen">{children}</main>
    </div>
  );
}
