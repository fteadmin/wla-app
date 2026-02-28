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
  onMenuClick?: () => void; // Prop to open the sidebar
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

      const { data, error } = await supabase
        .from("user_profiles")
        .select("first_name,last_name,email,tokens")
        .eq("user_id", auth.user.id)
        .single();
      
      const profile = !error && data ? data : null;
      const first = profile?.first_name || auth.user.user_metadata?.first_name || "";
      const last  = profile?.last_name  || auth.user.user_metadata?.last_name  || "";
      const email = profile?.email      || auth.user.email || "";
      setMemberName((first + " " + last).trim() || email);

      let initials = (first[0] || "").toUpperCase() + (last[0] || "").toUpperCase();
      if (!initials.trim()) initials = email.slice(0, 2).toUpperCase();
      setMemberInitials(initials);
      setTokens(profile?.tokens ?? 0);
    }
    fetchProfile();
  }, [tokensProp]);

  return (
    <header className="sticky top-0 z-30 h-[60px] flex items-center px-3 sm:px-6 gap-2 sm:gap-4 bg-black/85 backdrop-blur-md border-b border-[#D9BA84]/12 font-sora flex-shrink-0">
      
      {/* MOBILE TRIGGER: Positioned to match where the 'X' will land */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 text-[#a0a0b4] hover:text-[#D9BA84] transition-colors"
      >
        <Menu size={24} />
      </button>

      <div className="hidden sm:block w-px h-6 bg-[#D9BA84]/15 flex-shrink-0" />

      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-[4px] rounded-full bg-[#D9BA84]/7 border border-[#D9BA84]/15 text-[11px] font-semibold text-[#D9BA84]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D9BA84] animate-dot-pulse" />
        Active
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            className="w-9 h-9 bg-[#161616] border border-[#D9BA84]/14 rounded-[10px] flex items-center justify-center text-[#a0a0b4] hover:text-[#D9BA84] transition-all"
            onClick={() => setOpen(!open)}
          >
            <Bell size={15} />
            {unread > 0 && (
              <span className="absolute -top-[3px] -right-[3px] min-w-[16px] h-4 rounded-lg bg-gradient-to-br from-[#D9BA84] to-[#c8b450] border-2 border-black flex items-center justify-center text-[9px] font-bold text-black px-0.5">
                {unread}
              </span>
            )}
          </button>
        </div>

        <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[12px] font-bold text-[#D9BA84] border border-[#D9BA84]/30"
          style={{ background: "linear-gradient(135deg, rgba(217,186,132,0.2