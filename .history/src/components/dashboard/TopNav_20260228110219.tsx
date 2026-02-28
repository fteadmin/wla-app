import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bell, ChevronRight, Calendar, Coins, Trophy, CheckCircle, Menu } from "lucide-react";

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
  event:   { icon: Calendar,    color: "text-[#D9BA84]" },
  reward:  { icon: Coins,       color: "text-[#c8b450]" },
  contest: { icon: Trophy,      color: "text-[#D9BA84]" },
  system:  { icon: CheckCircle, color: "text-[#a0a0b4]" },
};

interface TopNavProps {
  tokens?: number;
  onMenuClick?: () => void; 
}

export default function TopNav({ tokens: tokensProp = 0, onMenuClick }: TopNavProps) {
  const [memberName, setMemberName]       = useState("");
  const [memberInitials, setMemberInitials] = useState("");
  const [tokens, setTokens]               = useState(tokensProp);
  const [open, setOpen]                   = useState(false);
  const [notifs, setNotifs]               = useState<Notification[]>(INITIAL_NOTIFS);
  const unread = notifs.filter(n => n.unread).length;

  useEffect(() => {
    async function fetchProfile() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      let profile: any = null;
      const { data, error } = await supabase
        .from("user_profiles")
        .select("first_name,last_name,email,tokens")
        .eq("user_id", auth.user.id)
        .single();
      if (!error && data) profile = data;
      
      const first = profile?.first_name || auth.user.user_metadata?.first_name || "";
      const last  = profile?.last_name  || auth.user.user_metadata?.last_name  || "";
      const email = profile?.email      || auth.user.email || "";
      const name  = (first + " " + last).trim() || email;
      setMemberName(name);

      let initials = (first[0] || "").toUpperCase() + (last[0] || "").toUpperCase();
      if (!initials.trim()) initials = email.slice(0, 2).toUpperCase();
      setMemberInitials(initials);
      setTokens(profile?.tokens ?? 0);
    }
    fetchProfile();
  }, [tokensProp]);

  const markRead = (id: number) =>
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, unread: false } : n));

  return (
    <header className="sticky top-0 z-30 h-[60px] flex items-center px-3 sm:px-6 gap-2 sm:gap-4 bg-black/85 backdrop-blur-md border-b border-[#D9BA84]/12 font-sora flex-shrink-0"
      style={{ boxShadow: "inset 0 -1px 0 0 rgba(217,186,132,0.08)" }}>

      {/* MOBILE TRIGGER - Only shows when sidebar is hidden */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 text-[#a0a0b4] hover:text-[#D9BA84] transition-colors"
        aria-label="Open Menu"
      >
        <Menu size={22} />
      </button>

      <div className="hidden sm:block w-px h-6 bg-[#D9BA84]/15 flex-shrink-0" />

      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-[4px] rounded-full bg-[#D9BA84]/7 border border-[#D9BA84]/15 text-[11px] font-semibold text-[#D9BA84] flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D9BA84] shadow-[0_0_5px_rgba(217,186,132,0.6)] animate-dot-pulse" />
        Active
      </div>

      <div className="flex-1 min-w-0" />

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-[5px] rounded-full bg-[#D9BA84]/8 border border-[#D9BA84]/18">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9BA84]" />
          <span className="text-[12px] font-bold text-[#D9BA84] font-code">{tokens.toLocaleString()}</span>
          <span className="text-[10px] font-medium text-[#a0a0b4]">tokens</span>
        </div>

        <div className="relative">
          <button
            className="relative w-9 h-9 bg-[#161616] border border-[#D9BA84]/14 rounded-[10px] flex items-center justify-center text-[#a0a0b4] hover:text-[#D9BA84] transition-all"
            onClick={() => setOpen(o => !o)}
          >
            <Bell size={15} />
            {unread > 0 && (
              <span className="absolute -top-[3px] -right-[3px] min-w-[16px] h-4 rounded-lg bg-gradient-to-br from-[#D9BA84] to-[#c8b450] border-2 border-black flex items-center justify-center text-[9px] font-bold text-black px-0.5">
                {unread}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute top-[46px] right-0 w-[290px] max-w-[calc(100vw-20px)] z-[200] bg-[#0d0d0d] border border-[#D9BA84]/20 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#D9BA84]/10">
                <span className="text-[13px] font-bold text-white">Notifications</span>
              </div>
              {notifs.map(n => {
                const cfg = notifConfig[n.type];
                const Ico = cfg.icon;
                return (
                  <div key={n.id} className="flex items-start gap-2.5 px-3.5 py-2.5 cursor-pointer border-b border-[#D9BA84]/5 last:border-0 hover:bg-[#D9BA84]/4 transition-colors" onClick={() => markRead(n.id)}>
                    <div className={`w-7 h-7 rounded-[8px] flex items-center justify-center bg-[#D9BA84]/10 ${cfg.color}`}><Ico size={13} /></div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[12px] text-white leading-snug ${n.unread ? "font-semibold" : "font-normal"}`}>{n.title}</div>
                      <div className="text-[10px] text-[#a0a0b4] mt-0.5">{n.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[12px] font-bold text-[#D9BA84] border border-[#D9BA84]/30"
          style={{ background: "linear-gradient(135deg, rgba(217,186,132,0.2), rgba(200,180,80,0.1))" }}>
          {memberInitials}
        </div>
      </div>
    </header>
  );
}