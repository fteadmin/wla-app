import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Car, ChevronRight, Calendar, Coins, Trophy, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Notification {
  id: number;
  type: "event" | "reward" | "contest" | "system";
  title: string;
  time: string;
  unread: boolean;
}

const INITIAL_NOTIFS: Notification[] = [
  { id: 1, type: "event",   title: "Monthly Cruise this Saturday",    time: "2h ago",  unread: true  },
  { id: 2, type: "reward",  title: "You earned 150 tokens!",          time: "1d ago",  unread: true  },
  { id: 3, type: "contest", title: "Photo Contest ends in 3 days",    time: "2d ago",  unread: false },
  { id: 4, type: "system",  title: "Membership renewed successfully", time: "5d ago",  unread: false },
];

const notifConfig = {
  event:   { icon: Calendar,     color: "#D9BA84" },
  reward:  { icon: Coins,        color: "#c8b450" },
  contest: { icon: Trophy,       color: "#D9BA84" },
  system:  { icon: CheckCircle,  color: "#a0a0b4" },
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  .tn-root *, .tn-root *::before, .tn-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .tn-root { font-family: 'Sora', sans-serif; }

  .tn-bar {
    position: sticky; top: 0; z-index: 50;
    height: 60px;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(217,186,132,0.12);
    display: flex; align-items: center;
    padding: 0 24px;
    gap: 16px;
  }

  /* Subtle shimmer line at bottom */
  .tn-bar::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(217,186,132,0.3) 30%, rgba(200,180,80,0.3) 70%, transparent 100%);
  }

  /* Logo */
  .tn-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
  .tn-logo-icon {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #D9BA84, #c8b450);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 3px 12px rgba(217,186,132,0.25);
    flex-shrink: 0;
  }
  .tn-logo-text {
    display: flex; flex-direction: column; line-height: 1;
  }
  .tn-logo-name {
    font-size: 13px; font-weight: 800; letter-spacing: 0.12em;
    color: #ffffff;
  }
  .tn-logo-tagline {
    font-size: 9px; letter-spacing: 0.06em; color: #a0a0b4;
    font-family: 'JetBrains Mono', monospace; margin-top: 2px;
  }

  /* Divider */
  .tn-divider { width: 1px; height: 24px; background: rgba(217,186,132,0.15); flex-shrink: 0; }

  /* Spacer */
  .tn-spacer { flex: 1; }

  /* Right cluster */
  .tn-right { display: flex; align-items: center; gap: 10px; }

  /* Token chip */
  .tn-token-chip {
    display: flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 20px;
    background: rgba(217,186,132,0.08);
    border: 1px solid rgba(217,186,132,0.18);
    cursor: default;
    transition: border-color 0.2s, background 0.2s;
  }
  .tn-token-chip:hover { border-color: rgba(217,186,132,0.35); background: rgba(217,186,132,0.12); }
  .tn-token-dot { width: 6px; height: 6px; border-radius: 50%; background: #D9BA84; box-shadow: 0 0 6px rgba(217,186,132,0.7); }
  .tn-token-val { font-size: 12px; font-weight: 700; color: #D9BA84; font-family: 'JetBrains Mono', monospace; }
  .tn-token-lbl { font-size: 10px; color: #a0a0b4; font-weight: 500; }

  /* Bell */
  .tn-bell-wrap { position: relative; }
  .tn-bell {
    width: 36px; height: 36px;
    background: #161616; border: 1px solid rgba(217,186,132,0.14);
    border-radius: 10px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #a0a0b4; transition: all 0.2s;
  }
  .tn-bell:hover { border-color: rgba(217,186,132,0.4); color: #D9BA84; background: rgba(217,186,132,0.06); }
  .tn-bell-badge {
    position: absolute; top: -3px; right: -3px;
    min-width: 16px; height: 16px; border-radius: 8px;
    background: linear-gradient(135deg, #D9BA84, #c8b450);
    border: 2px solid #000;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700; color: #000;
    font-family: 'JetBrains Mono', monospace; padding: 0 3px;
  }

  /* Dropdown */
  .tn-dropdown {
    position: absolute; top: 46px; right: 0; width: 300px; z-index: 200;
    background: #0d0d0d;
    border: 1px solid rgba(217,186,132,0.2);
    border-radius: 16px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(217,186,132,0.05);
    overflow: hidden;
    animation: tnDrop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes tnDrop {
    from { opacity: 0; transform: translateY(-8px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .tn-dd-header {
    padding: 13px 16px 10px;
    border-bottom: 1px solid rgba(217,186,132,0.1);
    display: flex; align-items: center; justify-content: space-between;
  }
  .tn-dd-title { font-size: 13px; font-weight: 700; color: #fff; }
  .tn-dd-count {
    font-size: 10px; color: #D9BA84;
    background: rgba(217,186,132,0.1); padding: 2px 7px;
    border-radius: 10px; font-weight: 700;
  }
  .tn-dd-item {
    display: flex; align-items: flex-start; gap: 11px;
    padding: 11px 14px; cursor: pointer;
    border-bottom: 1px solid rgba(217,186,132,0.05);
    transition: background 0.15s;
  }
  .tn-dd-item:last-of-type { border-bottom: none; }
  .tn-dd-item:hover { background: rgba(217,186,132,0.04); }
  .tn-dd-ico {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    background: rgba(217,186,132,0.1); display: flex; align-items: center; justify-content: center;
  }
  .tn-dd-body { flex: 1; min-width: 0; }
  .tn-dd-msg { font-size: 12px; color: #fff; line-height: 1.35; }
  .tn-dd-time { font-size: 10px; color: #a0a0b4; margin-top: 2px; }
  .tn-dd-unread { width: 6px; height: 6px; border-radius: 50%; background: #D9BA84; margin-top: 4px; flex-shrink: 0; }
  .tn-dd-footer {
    padding: 10px; border-top: 1px solid rgba(217,186,132,0.08); text-align: center;
  }
  .tn-dd-all {
    font-size: 11px; color: #D9BA84; font-weight: 600; background: none; border: none;
    cursor: pointer; font-family: 'Sora', sans-serif;
    display: inline-flex; align-items: center; gap: 3px; transition: opacity 0.15s;
  }
  .tn-dd-all:hover { opacity: 0.7; }

  /* Avatar */
  .tn-avatar {
    width: 34px; height: 34px; border-radius: 10px;
    background: linear-gradient(135deg, rgba(217,186,132,0.2), rgba(200,180,80,0.1));
    border: 1px solid rgba(217,186,132,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #D9BA84;
    font-family: 'JetBrains Mono', monospace; cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .tn-avatar:hover { border-color: rgba(217,186,132,0.5); background: rgba(217,186,132,0.15); }

  /* Status badge */
  .tn-status {
    display: flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px;
    background: rgba(217,186,132,0.07); border: 1px solid rgba(217,186,132,0.15);
    font-size: 11px; font-weight: 600; color: #D9BA84; white-space: nowrap;
  }
  .tn-status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #D9BA84; box-shadow: 0 0 5px rgba(217,186,132,0.6);
    animation: tnPulse 2s infinite;
  }
  @keyframes tnPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

  @media (max-width: 600px) {
    .tn-status { display: none; }
    .tn-token-chip { display: none; }
    .tn-divider { display: none; }
  }
`;

interface TopNavProps {
  tokens?: number;
  onMenuClick?: () => void;
}

export default function TopNav({ tokens: tokensProp = 4820, onMenuClick }: TopNavProps) {
  const [memberName, setMemberName] = useState<string>("");
  const [memberInitials, setMemberInitials] = useState<string>("");
  const [tokens, setTokens] = useState<number>(tokensProp);

  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS);
  const unread = notifs.filter(n => n.unread).length;

  useEffect(() => {
    async function fetchProfile() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      // Try user_id first, then id if not found
      let profile: any = null;
      // Try user_id first, then id if not found
      {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('first_name,last_name,email,tokens')
          .eq('user_id', auth.user.id)
          .single();
        if (!error && data) {
          profile = data;
        } else {
          // Try id column if user_id not found
          const { data: profile2, error: error2 } = await supabase
            .from('user_profiles')
            .select('first_name,last_name,email,tokens')
            .eq('id', auth.user.id)
            .single();
          if (!error2 && profile2) {
            profile = profile2;
          }
        }
      }
      console.log('[TopNav] Supabase Profile:', profile);
      let first = "";
      let last = "";
      let email = "";
      let tokensValue = 0; // fallback to 0 tokens if profile missing
      if (profile) {
        first = profile.first_name || auth.user.user_metadata?.first_name || "";
        last = profile.last_name || auth.user.user_metadata?.last_name || "";
        email = profile.email || auth.user.email || "";
        tokensValue = profile.tokens ?? 0;
      } else {
        first = auth.user.user_metadata?.first_name || "";
        last = auth.user.user_metadata?.last_name || "";
        email = auth.user.email || "";
      }
      let name = (first + " " + last).trim() || email;
      setMemberName(name);
      let initials = (first[0] || "").toUpperCase() + (last[0] || "").toUpperCase();
      if (!initials.trim()) {
        // fallback: use first two letters of email
        initials = email.slice(0, 2).toUpperCase();
      }
      setMemberInitials(initials);
      setTokens(tokensValue);
    }
    fetchProfile();
  }, [tokensProp]);

  const markRead = (id: number) =>
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, unread: false } : n));

  return (
    <div className="tn-root">
      <style>{styles}</style>
      <header className="tn-bar">
        {/* Mobile menu button */}
        <button
          className="lg:hidden mr-2 p-2 rounded-md border border-[rgba(217,186,132,0.18)] bg-[#161616] text-[#D9BA84] focus:outline-none focus:ring-2 focus:ring-[#D9BA84]"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={onMenuClick}
          aria-label="Open sidebar menu"
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>

        {/* Logo */}
        <Link to="/dashboard" className="tn-logo">
          <div className="tn-logo-icon">
            <Car size={17} color="#000" />
          </div>
          <div className="tn-logo-text">
            <span className="tn-logo-name">WLA CRUISER</span>
            <span className="tn-logo-tagline">Member Portal</span>
          </div>
        </Link>

        <div className="tn-divider" />

        {/* Status */}
        <div className="tn-status">
          <div className="tn-status-dot" />
          Active
        </div>

        <div className="tn-spacer" />

        {/* Right side */}
        <div className="tn-right">
          {/* Token chip: hide on mobile */}
          <div className="tn-token-chip hidden sm:flex">
            <div className="tn-token-dot" />
            <span className="tn-token-val">{tokens.toLocaleString()}</span>
            <span className="tn-token-lbl">tokens</span>
          </div>

          {/* Bell */}
          <div className="tn-bell-wrap">
            <button className="tn-bell" onClick={() => setOpen(o => !o)}>
              <Bell size={15} />
              {unread > 0 && <span className="tn-bell-badge">{unread}</span>}
            </button>

            {open && (
              <div className="tn-dropdown">
                <div className="tn-dd-header">
                  <span className="tn-dd-title">Notifications</span>
                  {unread > 0 && <span className="tn-dd-count">{unread} new</span>}
                </div>
                {notifs.map(n => {
                  const cfg = notifConfig[n.type];
                  const Ico = cfg.icon;
                  return (
                    <div key={n.id} className="tn-dd-item" onClick={() => markRead(n.id)}>
                      <div className="tn-dd-ico" style={{ color: cfg.color }}>
                        <Ico size={13} />
                      </div>
                      <div className="tn-dd-body">
                        <div className="tn-dd-msg" style={{ fontWeight: n.unread ? 600 : 400 }}>{n.title}</div>
                        <div className="tn-dd-time">{n.time}</div>
                      </div>
                      {n.unread && <div className="tn-dd-unread" />}
                    </div>
                  );
                })}
                <div className="tn-dd-footer">
                  <button className="tn-dd-all">
                    View all notifications <ChevronRight size={10} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="tn-avatar" title={memberName}>
            {memberInitials}
          </div>
        </div>
      </header>
    </div>
  );
}