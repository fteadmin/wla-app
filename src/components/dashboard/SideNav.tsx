import { Link, useLocation } from "react-router-dom";
import {
  Home, ShoppingBag, Trophy, Upload, CreditCard, Coins,
  ChevronRight, Car, LogOut, Settings
} from "lucide-react";

const NAV_ITEMS = [
  { key: "dashboard",       label: "Home",            icon: Home,        to: "/dashboard"                },
  { key: "marketplace",     label: "Marketplace",     icon: ShoppingBag, to: "/dashboard/marketplace"    },
  { key: "contests",        label: "Contests",        icon: Trophy,      to: "/dashboard/contests"       },
  { key: "content-uploads", label: "Content Uploads", icon: Upload,      to: "/dashboard/content-uploads"},
  { key: "membership",      label: "Membership",      icon: CreditCard,  to: "/dashboard/membership"     },
  { key: "token",           label: "Token",           icon: Coins,       to: "/dashboard/token"          },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  .sn-root *, .sn-root *::before, .sn-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .sn-root { font-family: 'Sora', sans-serif; }

  .sn-aside {
    width: 220px;
    min-height: 100vh;
    background: #0a0a0a;
    border-right: 1px solid rgba(217,186,132,0.12);
    display: flex;
    flex-direction: column;
    padding: 20px 12px 24px;
    position: relative;
    flex-shrink: 0;
  }

  /* Subtle ambient glow at top */
  .sn-aside::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 180px;
    background: radial-gradient(ellipse 100% 100% at 50% 0%, rgba(217,186,132,0.06) 0%, transparent 100%);
    pointer-events: none;
  }

  /* Right-edge shimmer */
  .sn-aside::after {
    content: '';
    position: absolute; top: 20%; right: 0; bottom: 20%; width: 1px;
    background: linear-gradient(180deg, transparent 0%, rgba(217,186,132,0.25) 50%, transparent 100%);
  }

  /* ── Brand block ── */
  .sn-brand {
    display: flex; align-items: center; gap: 9px;
    padding: 8px 8px 20px;
    border-bottom: 1px solid rgba(217,186,132,0.1);
    margin-bottom: 8px;
    position: relative; z-index: 1;
  }
  .sn-brand-icon {
    width: 32px; height: 32px; flex-shrink: 0;
    background: linear-gradient(135deg, #D9BA84, #c8b450);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 3px 10px rgba(217,186,132,0.22);
  }
  .sn-brand-text { display: flex; flex-direction: column; line-height: 1; }
  .sn-brand-name { font-size: 12px; font-weight: 800; letter-spacing: 0.1em; color: #ffffff; }
  .sn-brand-sub {
    font-size: 9px; color: #a0a0b4;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.05em; margin-top: 2px;
  }

  /* ── Section label ── */
  .sn-section-label {
    font-size: 9px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(160,160,180,0.5);
    padding: 6px 10px 6px;
    position: relative; z-index: 1;
  }

  /* ── Nav items ── */
  .sn-nav { display: flex; flex-direction: column; gap: 2px; position: relative; z-index: 1; }

  .sn-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 11px; border-radius: 12px;
    text-decoration: none;
    color: #a0a0b4;
    font-size: 13px; font-weight: 500;
    position: relative;
    transition: color 0.2s, background 0.2s, border-color 0.2s;
    border: 1px solid transparent;
    group: true;
  }

  .sn-link:hover {
    color: #ffffff;
    background: rgba(217,186,132,0.06);
    border-color: rgba(217,186,132,0.12);
  }

  .sn-link:hover .sn-link-arrow { opacity: 1; transform: translateX(0); }

  .sn-link.active {
    color: #ffffff;
    background: rgba(217,186,132,0.1);
    border-color: rgba(217,186,132,0.22);
  }

  /* Active left accent bar */
  .sn-link.active::before {
    content: '';
    position: absolute; left: -12px; top: 20%; bottom: 20%;
    width: 3px; border-radius: 0 3px 3px 0;
    background: linear-gradient(180deg, #D9BA84, #c8b450);
    box-shadow: 0 0 8px rgba(217,186,132,0.4);
  }

  .sn-link-icon {
    width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    color: #a0a0b4;
  }

  .sn-link:hover .sn-link-icon {
    background: rgba(217,186,132,0.1);
    border-color: rgba(217,186,132,0.2);
    color: #D9BA84;
  }

  .sn-link.active .sn-link-icon {
    background: rgba(217,186,132,0.12);
    border-color: rgba(217,186,132,0.25);
    color: #D9BA84;
  }

  .sn-link-label { flex: 1; }

  .sn-link-arrow {
    color: #D9BA84; opacity: 0;
    transform: translateX(-4px);
    transition: opacity 0.2s, transform 0.2s;
    flex-shrink: 0;
  }

  /* ── Spacer ── */
  .sn-spacer { flex: 1; }

  /* ── Bottom section ── */
  .sn-bottom {
    display: flex; flex-direction: column; gap: 2px;
    border-top: 1px solid rgba(217,186,132,0.1);
    padding-top: 12px;
    position: relative; z-index: 1;
  }

  .sn-bottom-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 11px; border-radius: 12px;
    background: none; border: 1px solid transparent;
    color: #a0a0b4; font-size: 13px; font-weight: 500;
    cursor: pointer; font-family: 'Sora', sans-serif;
    text-align: left; width: 100%;
    transition: color 0.2s, background 0.2s, border-color 0.2s;
    text-decoration: none;
  }
  .sn-bottom-btn:hover {
    color: #ffffff; background: rgba(217,186,132,0.06);
    border-color: rgba(217,186,132,0.12);
  }
  .sn-bottom-btn:hover .sn-link-icon { background: rgba(217,186,132,0.1); border-color: rgba(217,186,132,0.2); color: #D9BA84; }

  .sn-logout:hover {
    color: #ff6b6b !important;
    background: rgba(255,107,107,0.06) !important;
    border-color: rgba(255,107,107,0.12) !important;
  }
  .sn-logout:hover .sn-link-icon { background: rgba(255,107,107,0.1) !important; border-color: rgba(255,107,107,0.2) !important; color: #ff6b6b !important; }

  /* ── Member pill ── */
  .sn-member-pill {
    display: flex; align-items: center; gap: 9px;
    padding: 10px 11px; border-radius: 12px;
    background: rgba(217,186,132,0.06);
    border: 1px solid rgba(217,186,132,0.14);
    margin-bottom: 8px;
    cursor: default;
    transition: border-color 0.2s;
    position: relative; z-index: 1;
  }
  .sn-member-pill:hover { border-color: rgba(217,186,132,0.28); }
  .sn-member-avatar {
    width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
    background: linear-gradient(135deg, rgba(217,186,132,0.2), rgba(200,180,80,0.1));
    border: 1px solid rgba(217,186,132,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #D9BA84;
    font-family: 'JetBrains Mono', monospace;
  }
  .sn-member-info { flex: 1; min-width: 0; }
  .sn-member-name { font-size: 12px; font-weight: 600; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sn-member-tier { font-size: 10px; color: #D9BA84; margin-top: 1px; display: flex; align-items: center; gap: 3px; }
  .sn-member-dot { width: 5px; height: 5px; border-radius: 50%; background: #D9BA84; box-shadow: 0 0 4px rgba(217,186,132,0.6); animation: snPulse 2s infinite; }
  @keyframes snPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* Slide-in */
  .sn-link, .sn-bottom-btn, .sn-member-pill {
    animation: snFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .sn-nav .sn-link:nth-child(1) { animation-delay: 0.05s; }
  .sn-nav .sn-link:nth-child(2) { animation-delay: 0.08s; }
  .sn-nav .sn-link:nth-child(3) { animation-delay: 0.11s; }
  .sn-nav .sn-link:nth-child(4) { animation-delay: 0.14s; }
  .sn-nav .sn-link:nth-child(5) { animation-delay: 0.17s; }
  .sn-nav .sn-link:nth-child(6) { animation-delay: 0.20s; }
  @keyframes snFadeIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
`;

interface SideNavProps {
  active: string;
  memberName?: string;
  memberInitials?: string;
  memberTier?: string;
}

import { useEffect } from "react";

interface ResponsiveSideNavProps extends SideNavProps {
  open?: boolean;
  onClose?: () => void;
}

export default function SideNav({
  active,
  memberName = "Jordan Rivera",
  memberInitials = "JR",
  memberTier = "Gold Member",
  open = true,
  onClose,
}: ResponsiveSideNavProps) {
  const location = useLocation();
  const currentActive = active || location.pathname.split("/dashboard/")[1] || "dashboard";

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (onClose) onClose();
    // eslint-disable-next-line
  }, [location.pathname]);

  return (
    <div className="sn-root">
      <style>{styles}</style>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${open ? 'block' : 'hidden'}`}
        onClick={onClose}
        aria-label="Close sidebar overlay"
      />
      <aside
        className={`sn-aside fixed z-50 inset-y-0 left-0 w-64 transform bg-[#0a0a0a] border-r border-[rgba(217,186,132,0.12)] transition-transform duration-200 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} lg:w-[220px]`}
        style={{ minHeight: '100vh' }}
        aria-label="Sidebar navigation"
      >
        {/* Brand */}
        <div className="sn-brand">
          <div className="sn-brand-icon">
            <Car size={16} color="#000" />
          </div>
          <div className="sn-brand-text">
            <span className="sn-brand-name">WLA CRUISER</span>
            <span className="sn-brand-sub">Member Portal</span>
          </div>
        </div>

        {/* Nav section */}
        <div className="sn-section-label">Navigation</div>
        <nav className="sn-nav">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = currentActive === item.key ||
              (item.key === "dashboard" && currentActive === "dashboard");
            return (
              <Link
                key={item.key}
                to={item.to}
                className={`sn-link${isActive ? " active" : ""}`}
              >
                <div className="sn-link-icon">
                  <Icon size={14} />
                </div>
                <span className="sn-link-label">{item.label}</span>
                <ChevronRight size={12} className="sn-link-arrow" />
              </Link>
            );
          })}
        </nav>

        <div className="sn-spacer" />

        {/* Member pill */}
        <div className="sn-member-pill">
          <div className="sn-member-avatar">{memberInitials}</div>
          <div className="sn-member-info">
            <div className="sn-member-name">{memberName}</div>
            <div className="sn-member-tier">
              <div className="sn-member-dot" />
              {memberTier}
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="sn-bottom">
          <Link to="/dashboard/settings" className="sn-bottom-btn">
            <div className="sn-link-icon">
              <Settings size={14} />
            </div>
            Settings
          </Link>
          <button className="sn-bottom-btn sn-logout">
            <div className="sn-link-icon">
              <LogOut size={14} />
            </div>
            Sign Out
          </button>
        </div>
      </aside>
    </div>
  );
}