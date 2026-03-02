"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, ShoppingBag, Trophy, Upload, CreditCard, Coins,
  ChevronRight, Car, LogOut, Settings, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const NAV_ITEMS = [
  { key: "dashboard",       label: "Home",            icon: Home,        to: "/dashboard"                 },
  { key: "marketplace",     label: "Marketplace",     icon: ShoppingBag, to: "/dashboard/marketplace"     },
  { key: "contests",        label: "Contests",        icon: Trophy,      to: "/dashboard/contests"        },
  { key: "content-uploads", label: "Content Uploads", icon: Upload,      to: "/dashboard/content-uploads" },
  { key: "membership",      label: "Membership",      icon: CreditCard,  to: "/dashboard/membership"      },
  { key: "token",           label: "Token",           icon: Coins,       to: "/dashboard/token"           },
];

interface SideNavProps {
  active?: string;
  memberName?: string;
  memberInitials?: string;
  memberTier?: string;
}

export default function SideNav({
  active,
  memberName = "Member",
  memberInitials = "M",
  memberTier = "Gold Member",
}: SideNavProps) {

  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const currentActive = active || pathname.split("/dashboard/")[1] || "dashboard";

  // Auto-close on route change for mobile
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      setSigningOut(false);
    }
  };

  // Auto-close on route change for mobile
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* 1. THE FLOATING TOGGLE: Fixed in the same position (top-left) */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[100] w-10 h-10 bg-[#0a0a0a] border border-[#D9BA84]/20 rounded-xl flex items-center justify-center shadow-2xl transition-all duration-200"
      >
        {mobileOpen ? (
          <X className="h-5 w-5 text-[#D9BA84]" />
        ) : (
          <Menu className="h-5 w-5 text-[#a0a0b4]" />
        )}
      </button>

      {/* 2. OVERLAY: Appears behind the sidebar but above the page content */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* 3. SIDEBAR: Slides from the left */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[90] w-64 flex flex-col bg-[#0a0a0a] border-r border-[#D9BA84]/10 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:w-[220px] font-sora",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Ambient top glow */}
        <div className="absolute top-0 left-0 right-0 h-44 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(217,186,132,0.06) 0%, transparent 100%)" }} />

        {/* Brand: Padded more on mobile to account for the floating button */}
        <div className="relative z-10 flex items-center gap-2.5 px-3 pt-16 lg:pt-5 pb-4 border-b border-[#D9BA84]/10">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#D9BA84] to-[#c8b450] flex items-center justify-center flex-shrink-0 shadow-[0_3px_10px_rgba(217,186,132,0.22)]">
            <Car size={15} color="#000" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-black tracking-widest text-white uppercase">WLA CRUISER</span>
            <span className="text-[9px] text-[#a0a0b4] tracking-wide mt-0.5 font-code uppercase">Member Portal</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto relative z-10 px-2 pt-4">
          <div className="px-3 pb-2 text-[9px] font-bold tracking-widest uppercase text-[#a0a0b4]/60">Navigation</div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentActive === item.key;
            return (
              <Link
                key={item.key}
                href={item.to}
                className={cn(
                  "relative flex items-center gap-2.5 px-3 py-[10px] rounded-xl text-[13px] font-medium border group transition-all duration-200 no-underline mb-0.5",
                  isActive ? "text-white bg-[#D9BA84]/10 border-[#D9BA84]/22" : "text-[#a0a0b4] border-transparent hover:text-white hover:bg-[#D9BA84]/6"
                )}
              >
                {isActive && <span className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-[3px] bg-[#D9BA84]" />}
                <div className={cn(
                  "w-[30px] h-[30px] rounded-[8px] flex items-center justify-center border transition-all duration-200",
                  isActive ? "bg-[#D9BA84]/12 border-[#D9BA84]/25 text-[#D9BA84]" : "bg-white/[0.04] border-white/[0.06] group-hover:text-[#D9BA84]"
                )}>
                  <Icon size={14} />
                </div>
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="relative z-10 p-2 border-t border-[#D9BA84]/10 bg-[#0a0a0a]">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#D9BA84]/5 border border-[#D9BA84]/10">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-[#D9BA84] bg-[#D9BA84]/10 border border-[#D9BA84]/20">{memberInitials}</div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-white truncate leading-none">{memberName}</p>
              <p className="text-[9px] text-[#D9BA84] mt-1">{memberTier}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#a0a0b4] hover:text-red-400 transition-colors w-full mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={14} className={signingOut ? "animate-spin" : ""} /> 
            {signingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
}