"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home, ShoppingBag, Trophy, Upload, CreditCard, Coins,
  ChevronRight, Car, LogOut, Settings, Menu, X, CalendarDays, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const NAV_ITEMS = [
  { key: "dashboard",       label: "Home",            icon: Home,        to: "/dashboard"                 },
  { key: "marketplace",     label: "Marketplace",     icon: ShoppingBag, to: "/dashboard/marketplace"     },
  { key: "contests",        label: "Contests",        icon: Trophy,       to: "/dashboard/contests"        },
  { key: "events",          label: "Events",          icon: CalendarDays, to: "/dashboard/events"          },
  { key: "my-contents",     label: "My Contents",     icon: Upload,       to: "/dashboard/my-contents"     },
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [displayName, setDisplayName] = useState(memberName);
  const [savingName, setSavingName] = useState(false);
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

  const handleSaveDisplayName = async () => {
    setSavingName(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const [firstName, ...lastNameParts] = displayName.split(" ");
      const lastName = lastNameParts.join(" ");

      const { error } = await supabase
        .from("user_profiles")
        .update({ first_name: firstName, last_name: lastName })
        .eq("id", auth.user.id);

      if (!error) {
        setSettingsOpen(false);
      }
    } catch (error) {
      console.error("Error updating display name:", error);
    } finally {
      setSavingName(false);
    }
  };

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
        <div className="relative z-10 p-2 space-y-1 border-t border-[#D9BA84]/10 bg-[#0a0a0a]">
          <button 
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#a0a0b4] hover:text-[#D9BA84] transition-colors w-full rounded-lg hover:bg-[#D9BA84]/6"
          >
            <Settings size={14} /> 
            Settings
          </button>
          <button 
            onClick={() => setHelpOpen(true)}
            className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#a0a0b4] hover:text-[#D9BA84] transition-colors w-full rounded-lg hover:bg-[#D9BA84]/6"
          >
            <HelpCircle size={14} /> 
            Help
          </button>
          <button 
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#a0a0b4] hover:text-red-400 transition-colors w-full rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={14} className={signingOut ? "animate-spin" : ""} /> 
            {signingOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 lg:p-0">
          <div className="bg-[#0d0d0d] border border-[#D9BA84]/20 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <p className="text-sm text-[#a0a0b4]">Edit your display name</p>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 bg-[#161616] border border-[#D9BA84]/20 rounded-lg text-white placeholder-[#a0a0b4] focus:outline-none focus:border-[#D9BA84]/50 transition-colors"
              placeholder="Your name"
            />
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setSettingsOpen(false)}
                className="flex-1 px-4 py-2 bg-[#161616] border border-[#D9BA84]/20 text-[#a0a0b4] hover:text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDisplayName}
                disabled={savingName || displayName === memberName}
                className="flex-1 px-4 py-2 bg-[#D9BA84] text-black font-semibold rounded-lg hover:bg-[#c8b450] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {savingName ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {helpOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 lg:p-0">
          <div className="bg-[#0d0d0d] border border-[#D9BA84]/20 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white">About WLA</h2>
            <div className="space-y-3 text-sm text-[#a0a0b4]">
              <p>Welcome to the <span className="text-[#D9BA84] font-semibold">World Lowrider Association</span> portal.</p>
              <div>
                <p className="text-white font-semibold mb-1">Features:</p>
                <ul className="space-y-1 ml-3 list-disc">
                  <li><span className="text-white">Marketplace</span> — Buy, sell, and trade lowrider parts & builds</li>
                  <li><span className="text-white">Contests</span> — Compete in photo contests and earn BLVD tokens</li>
                  <li><span className="text-white">Events</span> — Discover and attend lowrider events worldwide</li>
                  <li><span className="text-white">Membership</span> — Manage your WLA membership status</li>
                  <li><span className="text-white">Token System</span> — Earn and spend BLVD tokens within the community</li>
                </ul>
              </div>
              <p>Join a global community of builders, collectors, and enthusiasts united by lowrider culture.</p>
            </div>
            <button
              onClick={() => setHelpOpen(false)}
              className="w-full px-4 py-2 bg-[#D9BA84] text-black font-semibold rounded-lg hover:bg-[#c8b450] transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}