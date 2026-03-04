"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Bell, ChevronRight, Calendar, Coins, Trophy, CheckCircle, Star, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useNotifications, timeAgo, type NotifType } from "@/hooks/useNotifications";

const notifConfig: Record<NotifType | string, { icon: typeof Calendar; color: string }> = {
  new_event:            { icon: Calendar,     color: "text-[#D9BA84]" },
  rsvp_confirmed:       { icon: Calendar,     color: "text-[#D9BA84]" },
  new_contest:          { icon: Trophy,       color: "text-[#D9BA84]" },
  token_purchase:       { icon: Coins,        color: "text-[#c8b450]" },
  membership_activated: { icon: CheckCircle,  color: "text-[#a0a0b4]" },
  // legacy fallbacks
  event:   { icon: Calendar,    color: "text-[#D9BA84]" },
  reward:  { icon: Coins,       color: "text-[#c8b450]" },
  contest: { icon: Trophy,      color: "text-[#D9BA84]" },
  system:  { icon: CheckCircle, color: "text-[#a0a0b4]" },
};

const fallbackConfig = { icon: Star, color: "text-[#a0a0b4]" };

interface TopNavProps {
  tokens?: number;
}

export default function TopNav({ tokens: tokensProp = 0 }: TopNavProps) {
  const [userId, setUserId]               = useState<string | undefined>(undefined);
  const [memberName, setMemberName]       = useState("");
  const [memberInitials, setMemberInitials] = useState("");
  const [tokens, setTokens]               = useState(tokensProp);
  const [open, setOpen]                   = useState(false);

  const pathname = usePathname();
  const { notifications, markRead, markAllRead, unreadCount } = useNotifications(userId);

  // Global message toast — fires when a new message arrives and user is NOT on the messages page
  useEffect(() => {
    if (!userId || pathname === "/dashboard/messages") return;

    const channel = supabase
      .channel("messages:global-notify")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const msg = payload.new as { sender_id: string; content: string };
          if (msg.sender_id === userId) return;

          const { data: profile } = await supabase
            .from("user_profiles")
            .select("first_name, last_name, email")
            .eq("id", msg.sender_id)
            .maybeSingle();

          const name =
            [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
            profile?.email ||
            "A member";

          toast(`💬 ${name}`, {
            description: msg.content.length > 80 ? msg.content.slice(0, 80) + "…" : msg.content,
            duration: 5000,
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, pathname]);

  useEffect(() => {
    async function fetchProfile() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      setUserId(auth.user.id);

      type UserProfileRow = import("@/integrations/supabase/types").Database["public"]["Tables"]["user_profiles"]["Row"];
      let profile: UserProfileRow | null = null;
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id,first_name,last_name,email,role,tokens")
        .eq("id", auth.user.id)
        .maybeSingle<UserProfileRow>();
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

  return (
    <header className="sticky top-0 z-30 h-[60px] flex items-center px-3 sm:px-6 gap-2 sm:gap-4 bg-black/85 backdrop-blur-md border-b border-[#D9BA84]/12 font-sora flex-shrink-0"
      style={{ boxShadow: "inset 0 -1px 0 0 rgba(217,186,132,0.08)" }}>

      {/* Divider */}
      <div className="hidden sm:block w-px h-6 bg-[#D9BA84]/15 flex-shrink-0" />

      {/* Status pill */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-[4px] rounded-full bg-[#D9BA84]/7 border border-[#D9BA84]/15 text-[11px] font-semibold text-[#D9BA84] flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D9BA84] shadow-[0_0_5px_rgba(217,186,132,0.6)] animate-dot-pulse" />
        Active
      </div>

      <div className="flex-1 min-w-0" />

      {/* Right cluster */}
      <div className="flex items-center gap-2">

        {/* Token chip */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-[5px] rounded-full bg-[#D9BA84]/8 border border-[#D9BA84]/18 cursor-default hover:bg-[#D9BA84]/12 hover:border-[#D9BA84]/35 transition-all">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9BA84] shadow-[0_0_6px_rgba(217,186,132,0.7)]" />
          <span className="text-[12px] font-bold text-[#D9BA84] font-code">{tokens.toLocaleString()}</span>
          <span className="text-[10px] font-medium text-[#a0a0b4]">tokens</span>
        </div>

        {/* Chat button */}
        <Link
          href="/dashboard/messages"
          className={`relative w-9 h-9 flex items-center justify-center rounded-[10px] border transition-all ${
            pathname === "/dashboard/messages"
              ? "bg-[#D9BA84]/12 border-[#D9BA84]/40 text-[#D9BA84]"
              : "bg-[#161616] border-[#D9BA84]/14 text-[#a0a0b4] hover:border-[#D9BA84]/40 hover:text-[#D9BA84] hover:bg-[#D9BA84]/6"
          }`}
          aria-label="Messages"
        >
          <MessageSquare size={15} />
        </Link>

        {/* Bell + dropdown */}
        <div className="relative">
          <button
            className="relative w-9 h-9 bg-[#161616] border border-[#D9BA84]/14 rounded-[10px] flex items-center justify-center text-[#a0a0b4] hover:border-[#D9BA84]/40 hover:text-[#D9BA84] hover:bg-[#D9BA84]/6 transition-all"
            onClick={() => setOpen(o => !o)}
            aria-label="Notifications"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute -top-[3px] -right-[3px] min-w-[16px] h-4 rounded-lg bg-gradient-to-br from-[#D9BA84] to-[#c8b450] border-2 border-black flex items-center justify-center text-[9px] font-bold text-black font-code px-0.5">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute top-[46px] right-0 w-[290px] max-w-[calc(100vw-20px)] z-[200] bg-[#0d0d0d] border border-[#D9BA84]/20 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.85)] overflow-hidden animate-drop-in">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#D9BA84]/10">
                <span className="text-[13px] font-bold text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] text-[#D9BA84] bg-[#D9BA84]/10 px-2 py-0.5 rounded-full font-bold hover:bg-[#D9BA84]/20 transition-colors"
                  >
                    {unreadCount} new · Mark all read
                  </button>
                )}
              </div>

              {/* Items */}
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-[12px] text-[#a0a0b4]">No notifications yet.</div>
              ) : notifications.slice(0, 8).map(n => {
                const cfg = notifConfig[n.type] ?? fallbackConfig;
                const Ico = cfg.icon;
                return (
                  <div
                    key={n.id}
                    className="flex items-start gap-2.5 px-3.5 py-2.5 cursor-pointer border-b border-[#D9BA84]/5 last:border-0 hover:bg-[#D9BA84]/4 transition-colors"
                    onClick={() => markRead(n.id)}
                  >
                    <div className={`w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0 bg-[#D9BA84]/10 ${cfg.color}`}>
                      <Ico size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[12px] text-white leading-snug ${n.read ? "font-normal" : "font-semibold"}`}>{n.title}</div>
                      <div className="text-[10px] text-[#a0a0b4] mt-0.5">{timeAgo(n.created_at)}</div>
                    </div>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#D9BA84] mt-1 flex-shrink-0" />}
                  </div>
                );
              })}

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-[#D9BA84]/8 text-center">
                <button className="text-[11px] text-[#D9BA84] font-semibold inline-flex items-center gap-1 hover:opacity-70 transition-opacity font-sora">
                  View all notifications <ChevronRight size={10} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div
          className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-[12px] font-bold text-[#D9BA84] font-code cursor-pointer border border-[#D9BA84]/30 hover:border-[#D9BA84]/50 transition-all"
          style={{ background: "linear-gradient(135deg, rgba(217,186,132,0.2), rgba(200,180,80,0.1))" }}
          title={memberName}
        >
          {memberInitials}
        </div>
      </div>
    </header>
  );
}
