import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, ShoppingBag, Trophy, Upload, CreditCard, Coins,
  ChevronRight, Car, LogOut, Settings, Menu, X
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
  active?: string;
  memberName?: string;
  memberInitials?: string;
  memberTier?: string;
  open?: boolean;
  onClose?: () => void;
  onOpen?: () => void; // Added to trigger opening from the hamburger
}

export default function SideNav({
  active,
  memberName = "Member",
  memberInitials = "M",
  memberTier = "Gold Member",
  open = false,
  onClose,
  onOpen,
}: SideNavProps) {
  const location = useLocation();
  const currentActive = active || location.pathname.split("/dashboard/")[1] || "dashboard";

  // Auto-close sidebar when route changes on mobile
  useEffect(() => {
    if (open && onClose) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      {/* --- MOBILE FLOATING HEADER --- */}
      <div className="lg:hidden fixed top-4 left-4 right-4 z-[60] flex items-center justify-between px-4 py-3 bg-[#0a0a0a]/80 backdrop-blur-md border border-[#D9BA84]/20 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#D9BA84] flex items-center justify-center">
            <Car size={14} color="#000" />
          </div>
          <span className="text-[10px] font-black tracking-widest text-white uppercase">WLA</span>
        </div>
        
        <button 
          onClick={open ? onClose : onOpen}
          className="p-2 rounded-lg bg-[#D9BA84]/10 border border-[#D9BA84]/20 text-[#D9BA84] active:scale-95 transition-transform"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* --- SIDEBAR --- */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex flex-col
          bg-[#0a0a0a] border-r border-[#D9BA84]/10
          transition-all duration-300 ease-in-out
          lg:sticky lg:top-0 lg:h-screen lg:w-[220px] lg:translate-x-0 lg:z-30 lg:flex-shrink-0
          font-sora
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        aria-label="Sidebar navigation"
      >
        {/* Glow & Brand */}
        <div className="absolute top-0 left-0 right-0 h-44 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(217,186,132,0.06) 0%, transparent 100%)" }} />

        <div className="relative z-10 flex items-center gap-2.5 px-3 pt-5 pb-4 border-b border-[#D9BA84]/10">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#D9BA84] to-[#c8b450] flex items-center justify-center flex-shrink-0 shadow-[0_3px_10px_rgba(217,186,132,0.22)]">
            <Car size={15} color="#000" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-black tracking-widest text-white uppercase">WLA CRUISER</span>
            <span className="text-[9px] text-[#a0a0b4] tracking-wide mt-0.5 font-code">Member Portal</span>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
            <div className="px-4 pt-4 pb-1.5 text-[9px] font-bold tracking-[0.12em] uppercase text-[#a0a0b4]/60">
            Navigation
            </div>
            <nav className="flex flex-col gap-0.5 px-2">
            {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentActive === item.key;
                return (
                <Link
                    key={item.key}
                    to={item.to}
                    className={`relative flex items-center gap-2.5 px-3 py-[10px] rounded-xl text-[13px] font-medium border group transition-all duration-200 no-underline
                    ${isActive ? "text-white bg-[#D9BA84]/10 border-[#D9BA84]/22" : "text-[#a0a0b4] border-transparent hover:text-white hover:bg-[#D9BA84]/6"}`}
                >
                    {isActive && <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-[3px] bg-[#D9BA84] shadow-[0_0_8px_rgba(217,186,132,0.4)]" />}
                    <div className={`w-[30px] h-[30px] rounded-[8px] flex items-center justify-center border transition-all duration-200
                    ${isActive ? "bg-[#D9BA84]/12 border-[#D9BA84]/25 text-[#D9BA84]" : "bg-white/[0.04] border-white/[0.06] group-hover:text-[#D9BA84]"}`}>
                    <Icon size={14} />
                    </div>
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight size={12} className={`transition-all ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                </Link>
                );
            })}
            </nav>
        </div>

        {/* Footer Area */}
        <div className="relative z-10 p-2 border-t border-[#D9BA84]/10 bg-[#0a0a0a]">
          <div className="mb-2 flex items-center gap-2.5 px-3 py-[10px] rounded-xl bg-[#D9BA84]/5 border border-[#D9BA84]/10">
            <div className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-[11px] font-bold text-[#D9BA84] border border-[#D9BA84]/20 bg-[#D9BA84]/10">
              {memberInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-white truncate">{memberName}</div>
              <div className="text-[10px] text-[#D9BA84]">{memberTier}</div>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <Link to="/dashboard/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-[#a0a0b4] hover:text-white hover:bg-white/5 transition-all no-underline">
              <Settings size={14} /> Settings
            </Link>
            <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-[#a0a0b4] hover:text-red-400 hover:bg-red-400/5 transition-all text-left">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}