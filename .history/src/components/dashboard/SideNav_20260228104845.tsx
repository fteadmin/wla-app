import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, ShoppingBag, Trophy, Upload, CreditCard, Coins,
  ChevronRight, Car, LogOut, Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { key: "dashboard",       label: "Home",            icon: Home,        to: "/dashboard"                 },
  { key: "marketplace",     label: "Marketplace",     icon: ShoppingBag, to: "/dashboard/marketplace"     },
  { key: "contests",        label: "Contests",        icon: Trophy,      to: "/dashboard/contests"        },
  { key: "content-uploads", label: "Content Uploads", icon: Upload,      to: "/dashboard/content-uploads" },
  { key: "membership",      label: "Membership",      icon: CreditCard,  to: "/dashboard/membership"      },
  { key: "token",           label: "Token",           icon: Coins,       to: "/dashboard/token"           },
];

interface SideNavProps {
  active: string;
  memberName?: string;
  memberInitials?: string;
  memberTier?: string;
  open?: boolean;
  onClose?: () => void;
}

  active,
  memberName = "Member",
  memberInitials = "M",
  memberTier = "Gold Member",
    open,
    onClose,
}: SideNavProps) {
  const location = useLocation();
  const currentActive = active || location.pathname.split("/dashboard/")[1] || "dashboard";
  const [open, setOpen] = useState(false);

  // Close on route change (mobile)
  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Floating nav bar (hamburger) for mobile
  return (
    <>
      {/* Floating NavBar for mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-full bg-[#0a0a0a] text-[#D9BA84] shadow-lg focus:outline-none border border-[#D9BA84]/20"
          aria-label="Open navigation"
        >
          {/* Hamburger icon */}
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex flex-col overflow-y-auto
          bg-[#0a0a0a] border-r border-[#D9BA84]/10
          transition-transform duration-200
          lg:sticky lg:top-0 lg:h-screen lg:inset-auto lg:w-[220px] lg:translate-x-0 lg:z-30 lg:flex-shrink-0
          font-sora
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
        aria-label="Sidebar navigation"
      >
        {/* Close button for mobile */}
        <button
          className="lg:hidden absolute top-4 right-4 p-2 rounded-full bg-[#222] text-[#D9BA84] focus:outline-none border border-[#D9BA84]/20 z-50"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Ambient top glow */}
        <div className="absolute top-0 left-0 right-0 h-44 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(217,186,132,0.06) 0%, transparent 100%)" }} />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-2.5 px-3 pt-5 pb-4 border-b border-[#D9BA84]/10">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#D9BA84] to-[#c8b450] flex items-center justify-center flex-shrink-0 shadow-[0_3px_10px_rgba(217,186,132,0.22)]">
            <Car size={15} color="#000" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-black tracking-widest text-white">WLA CRUISER</span>
            <span className="text-[9px] text-[#a0a0b4] tracking-wide mt-0.5 font-code">Member Portal</span>
          </div>
        </div>

        {/* Nav label */}
        <div className="relative z-10 px-4 pt-4 pb-1.5 text-[9px] font-bold tracking-[0.12em] uppercase text-[#a0a0b4]/60">
          Navigation
        </div>

        {/* Nav items */}
        <nav className="relative z-10 flex flex-col gap-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentActive === item.key ||
              (item.key === "dashboard" && currentActive === "dashboard");
            return (
              <Link
                key={item.key}
                to={item.to}
                className={`
                  relative flex items-center gap-2.5 px-3 py-[10px] rounded-xl
                  text-[13px] font-medium border group
                  transition-all duration-200 no-underline
                  ${isActive
                    ? "text-white bg-[#D9BA84]/10 border-[#D9BA84]/22"
                    : "text-[#a0a0b4] border-transparent hover:text-white hover:bg-[#D9BA84]/6 hover:border-[#D9BA84]/12"
                  }
                `}
              >
                {/* Active accent bar */}
                {isActive && (
                  <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-[3px] bg-gradient-to-b from-[#D9BA84] to-[#c8b450] shadow-[0_0_8px_rgba(217,186,132,0.4)]" />
                )}

                {/* Icon box */}
                <div className={`
                  w-[30px] h-[30px] rounded-[8px] flex items-center justify-center flex-shrink-0
                  border transition-all duration-200
                  ${isActive
                    ? "bg-[#D9BA84]/12 border-[#D9BA84]/25 text-[#D9BA84]"
                    : "bg-white/[0.04] border-white/[0.06] text-[#a0a0b4] group-hover:bg-[#D9BA84]/10 group-hover:border-[#D9BA84]/20 group-hover:text-[#D9BA84]"
                  }
                `}>
                  <Icon size={14} />
                </div>

                <span className="flex-1">{item.label}</span>

                <ChevronRight
                  size={12}
                  className={`flex-shrink-0 text-[#D9BA84] transition-all duration-200 ${
                    isActive
                      ? "opacity-100"
                      : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Member pill */}
        <div className="relative z-10 mx-2 mb-2 flex items-center gap-2.5 px-3 py-[10px] rounded-xl bg-[#D9BA84]/6 border border-[#D9BA84]/14 hover:border-[#D9BA84]/28 transition-colors cursor-default">
          <div className="w-[30px] h-[30px] rounded-[8px] flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-[#D9BA84] font-code border border-[#D9BA84]/30"
            style={{ background: "linear-gradient(135deg, rgba(217,186,132,0.2), rgba(200,180,80,0.1))" }}>
            {memberInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-white truncate">{memberName}</div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#D9BA84] mt-0.5">
              <span className="w-[5px] h-[5px] rounded-full bg-[#D9BA84] shadow-[0_0_4px_rgba(217,186,132,0.6)] animate-dot-pulse" />
              {memberTier}
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="relative z-10 mx-2 mb-5 flex flex-col gap-0.5 border-t border-[#D9BA84]/10 pt-3">
          <Link
            to="/dashboard/settings"
            className="flex items-center gap-2.5 px-3 py-[9px] rounded-xl text-[13px] font-medium text-[#a0a0b4] border border-transparent hover:text-white hover:bg-[#D9BA84]/6 hover:border-[#D9BA84]/12 transition-all duration-200 no-underline group"
          >
            <div className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center bg-white/[0.04] border border-white/[0.06] group-hover:bg-[#D9BA84]/10 group-hover:border-[#D9BA84]/20 group-hover:text-[#D9BA84] transition-all duration-200">
              <Settings size={14} />
            </div>
            Settings
          </Link>

          <button className="flex items-center gap-2.5 px-3 py-[9px] rounded-xl text-[13px] font-medium text-[#a0a0b4] border border-transparent hover:text-red-400 hover:bg-red-400/[0.06] hover:border-red-400/[0.12] transition-all duration-200 w-full text-left group font-sora">
            <div className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center bg-white/[0.04] border border-white/[0.06] group-hover:bg-red-400/10 group-hover:border-red-400/20 group-hover:text-red-400 transition-all duration-200">
              <LogOut size={14} />
            </div>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
