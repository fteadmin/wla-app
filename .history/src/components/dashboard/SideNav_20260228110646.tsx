import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, ShoppingBag, Trophy, Upload, CreditCard, Coins,
  ChevronRight, Car, LogOut, Settings, X
} from "lucide-react";

const NAV_ITEMS = [
  { key: "dashboard", label: "Home", icon: Home, to: "/dashboard" },
  { key: "marketplace", label: "Marketplace", icon: ShoppingBag, to: "/dashboard/marketplace" },
  { key: "contests", label: "Contests", icon: Trophy, to: "/dashboard/contests" },
  { key: "content-uploads", label: "Content Uploads", icon: Upload, to: "/dashboard/content-uploads" },
  { key: "membership", label: "Membership", icon: CreditCard, to: "/dashboard/membership" },
  { key: "token", label: "Token", icon: Coins, to: "/dashboard/token" },
];

interface SideNavProps {
  active: string;
  memberName?: string;
  memberInitials?: string;
  memberTier?: string;
  open?: boolean;
  onClose?: () => void;
}

export default function SideNav({
  active,
  memberName = "Member",
  memberInitials = "M",
  memberTier = "Gold Member",
  open = false,
  onClose,
}: SideNavProps) {
  const location = useLocation();
  const currentActive = active || location.pathname.split("/dashboard/")[1] || "dashboard";

  useEffect(() => {
    if (open && onClose) onClose();
  }, [location.pathname]);

  return (
    <>
      {/* Dimmed Background Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-[70] w-64 flex flex-col
          bg-[#0a0a0a] border-r border-[#D9BA84]/10
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:h-screen lg:w-[220px] lg:translate-x-0 lg:z-30 lg:flex-shrink-0
          font-sora
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* --- THE FLOATING TAB CLOSE BUTTON --- */}
        {/* Positoned outside the sidebar so it moves with the slide animation */}
        <button
          onClick={onClose}
          className={`
            lg:hidden absolute top-3.5 -right-12 w-10 h-10 
            flex items-center justify-center 
            bg-[#0a0a0a] border border-[#D9BA84]/20 rounded-xl
            text-[#D9BA84] shadow-2xl transition-all duration-300
            ${open ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}
          `}
        >
          <X size={20} />
        </button>

        {/* Ambient top glow */}
        <div className="absolute top-0 left-0 right-0 h-44 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(217,186,132,0.06) 0%, transparent 100%)" }} />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-2.5 px-3 pt-5 pb-4 border-b border-[#D9BA84]/10">
          <div className="w-8 h-8 rounded-[9px] bg-[#D9BA84] flex items-center justify-center flex-shrink-0 shadow-[0_3px_10px_rgba(217,186,132,0.22)]">
            <Car size={15} color="#000" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-black tracking-widest text-white uppercase">WLA CRUISER</span>
            <span className="text-[9px] text-[#a0a0b4] tracking-wide mt-0.5 font-code">Member Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto relative z-10 px-2 pt-4">
          <div className="px-3 pb-2 text-[9px] font-bold tracking-widest uppercase text-[#a0a0b4]/60">Navigation</div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentActive === item.key;
            return (
              <Link
                key={item.key} to={item.to}
                className={`relative flex items-center gap-2.5 px-3 py-[10px] rounded-xl text-[13px] font-medium border group transition-all duration-200 no-underline mb-0.5
                ${isActive ? "text-white bg-[#D9BA84]/10 border-[#D9BA84]/22" : "text-[#a0a0b4] border-transparent hover:text-white hover:bg-[#D9BA84]/6"}`}
              >
                {isActive && <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-[3px] bg-[#D9BA84]" />}
                <div className={`w-[30px] h-[30px] rounded-[8px] flex items-center justify-center border transition-all duration-200
                  ${isActive ? "bg-[#D9BA84]/12 border-[#D9BA84]/25 text-[#D9BA84]" : "bg-white/[0.04] border-white/[0.06] group-hover:text-[#D9BA84]"}`}>
                  <Icon size={14} />
                </div>
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="relative z-10 p-2 border-t border-[#D9BA84]/10">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#D9BA84]/5 border border-[#D9BA84]/10">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-[#D9BA84] bg-[#D9BA84]/10 border border-[#D9BA84]/20">{memberInitials}</div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-white truncate leading-none">{memberName}</p>
              <p className="text-[9px] text-[#D9BA84] mt-1">{memberTier}</p>
            </div>
          </div>
          <button className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-[#a0a0b4] hover:text-red-400 transition-colors w-full mt-1">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}