import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import {
  Trophy, CheckCircle, Clock, ChevronRight,
  Star, Users, Calendar, TrendingUp, Coins,
  Car, Flame, Hash, Sparkles, Zap,
  Shield, Upload, ShoppingBag,
} from "lucide-react";

// ─── Minimal CSS: only keyframes (can't be expressed in Tailwind) ─────────────
const animations = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fu1 { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.00s both; }
  .fu2 { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.07s both; }
  .fu3 { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.13s both; }
  .fu4 { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.19s both; }
  .fu5 { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
  .fu6 { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.31s both; }
`;

// ─── Supabase data hook ───────────────────────────────────────────────────────
function useMemberData() {
  const [member, setMember] = useState<{
    name: string; id: string; tier: string; since: string;
    avatar: string; car: string; tokens: number; nextReward: number;
    membershipId: string | null; qrCode: string | null; membershipStatus: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      let profile: Record<string, unknown> | null = null;
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", auth.user.id)
        .single();
      
      if (!error && data) {
        profile = data as Record<string, unknown>;
      }

      const firstName = (profile?.first_name as string) || auth.user.user_metadata?.first_name || "";
      setMember({
        name:             firstName,
        id:               (profile?.id as string)         || auth.user.id,
        tier:             (profile?.role as string)       || "Member",
        since:            profile?.created_at ? new Date(profile.created_at as string).toLocaleDateString() : "",
        avatar:           firstName[0]?.toUpperCase()     || "?",
        car:              (profile?.car as string)        || "",
        tokens:           (profile?.tokens as number)     || 0,
        nextReward:       5000,
        membershipId:     (profile?.membership_id as string)     || null,
        qrCode:           (profile?.qr_code as string)           || null,
        membershipStatus: (profile?.membership_status as string) || null,
      });
      setLoading(false);
    }
    fetchData();
  }, []);
  return { member, loading };
}

// ─── Static data ──────────────────────────────────────────────────────────────
const CONTESTS = [
  { id: 1, title: "Best Off-Road Build",  prize: "2,000 tokens + Trophy", ends: "Mar 15", entries: 47, category: "Builds",      hot: true  },
  { id: 2, title: "Spring Trail Photo",   prize: "1,000 tokens",          ends: "Mar 22", entries: 31, category: "Photography", hot: false },
  { id: 3, title: "Member of the Month",  prize: "500 tokens + Badge",    ends: "Mar 31", entries: 18, category: "Community",  hot: false },
];

const NOTIFICATIONS = [
  { id: 1, icon: Calendar,     color: "text-[#D9BA84]", title: "Monthly Cruise this Saturday",    time: "2h ago",  unread: true  },
  { id: 2, icon: Coins,        color: "text-[#c8b450]", title: "You earned 150 tokens!",          time: "1d ago",  unread: true  },
  { id: 3, icon: Trophy,       color: "text-[#D9BA84]", title: "Photo Contest ends in 3 days",    time: "2d ago",  unread: false },
  { id: 4, icon: CheckCircle,  color: "text-[#a0a0b4]", title: "Membership renewed successfully", time: "5d ago",  unread: false },
];

const STATS = [
  { label: "Events Attended",  value: 12,  icon: Calendar   },
  { label: "Contests Entered", value: 5,   icon: Trophy     },
  { label: "Forum Posts",      value: 38,  icon: Users      },
  { label: "Miles Logged",     value: 820, icon: TrendingUp },
];

const QUICK_ACTIONS = [
  { label: "Join Contest",   icon: Trophy,      to: "/dashboard/contests"        },
  { label: "Marketplace",    icon: ShoppingBag, to: "/dashboard/marketplace"     },
  { label: "Upload Content", icon: Upload,      to: "/dashboard/content-uploads" },
  { label: "My Membership",  icon: Shield,      to: "/dashboard/membership"      },
];

const RECENT_ACTIVITY = [
  { label: "Entered 'Best Off-Road Build' contest", time: "Today",     icon: Trophy   },
  { label: "Uploaded trail photo from Mojave trip", time: "Yesterday", icon: Upload   },
  { label: "Redeemed 200 tokens for sticker pack",  time: "Mar 2",    icon: Coins    },
  { label: "Attended March Community Meetup",       time: "Feb 28",   icon: Calendar },
];

// ─── Decorative QR ────────────────────────────────────────────────────────────
function FakeQR({ size = 100 }: { size?: number }) {
  const seed = [
    [1,1,1,1,1,1,1,0,1,0,0,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0],
    [1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1,1,0,1,0],
    [0,1,1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,1,1,0,1],
    [1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [1,0,1,1,0,0,1,0,1,0,1,1,0,0,1,0,0,1,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,1,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,1,1,0,0,1,0,1,0,0,0,1,0],
    [1,0,1,1,1,0,1,0,0,0,1,1,0,0,1,0,1,1,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,0,1,0,1,0,1,0,0,1,0,0],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,1,0,1,1,1,0],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,1,1,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,0,1,0,0,1,0,0,1,0,1,1],
  ];
  const cols = seed[0].length;
  const cell = size / cols;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {seed.flatMap((row, r) =>
        row.map((v, c) => v ? (
          <rect key={`${r}-${c}`} x={c * cell} y={r * cell}
            width={cell - 0.5} height={cell - 0.5} fill="#D9BA84" rx="0.4" />
        ) : null)
      )}
    </svg>
  );
}

// ─── Token ring SVG ───────────────────────────────────────────────────────────
function TokenRing({ value, max }: { value: number; max: number }) {
  const pct  = Math.min(value / max, 1);
  const r    = 40; const cx = 48; const cy = 48; const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <svg width={96} height={96} viewBox="0 0 96 96">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(217,186,132,0.1)" strokeWidth="6" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#tr)" strokeWidth="6"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ * 0.25} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1.2s ease" }} />
      <defs>
        <linearGradient id="tr" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D9BA84" />
          <stop offset="100%" stopColor="#c8b450" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3.5 text-[10px] font-bold tracking-[0.1em] uppercase text-[#a0a0b4]">
      {children}
      <div className="flex-1 h-px bg-[#D9BA84]/10" />
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl transition-all duration-250 hover:border-[#D9BA84]/32 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,0,0,0.65)] ${className}`}>
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function HomeBasic() {
  const { member, loading } = useMemberData();
  const [tokens, setTokens] = useState(0);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  useEffect(() => { if (member) setTokens(member.tokens); }, [member]);

  const markRead = (id: number) =>
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, unread: false } : n));

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-sora">
        <div className="text-[#a0a0b4] text-sm">Loading...</div>
      </div>
    );
  }
  if (!member) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-sora p-6">
        <div className="text-red-400 text-base font-bold text-center">
          User profile not found.<br />Please contact support or try signing up again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D9BA84] mb-2">
            <span className="block w-5 h-0.5 bg-[#D9BA84]" />BLVD Token System
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-2">
            Hey, {member.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-[#a0a0b4]">
            Here's what's happening in your club today.
          </p>
        </div>

        {/* ── Membership + Token grid ── */}
        <div className="fu2 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 mb-4">

          {/* Membership card */}
          <div className="relative overflow-hidden rounded-2xl border border-[#D9BA84]/18 bg-[#0d0d0d] p-5 sm:p-6 transition-all duration-250 hover:border-[#D9BA84]/40 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
            {/* Glow */}
            <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(217,186,132,0.07) 0%, transparent 70%)" }} />
            {/* Stripe pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{ backgroundImage: "repeating-linear-gradient(45deg, #D9BA84 0px, #D9BA84 1px, transparent 1px, transparent 14px)" }} />

            {/* Top row */}
            <div className="relative flex items-center justify-between mb-5">
              <div className="inline-flex items-center gap-1.5 bg-[#D9BA84]/10 border border-[#D9BA84]/22 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide text-[#D9BA84]">
                <Star size={11} /> {member.tier}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#D9BA84]">
                <CheckCircle size={13} /> Verified Member
              </div>
            </div>

            {/* Body */}
            <div className="relative flex items-end justify-between gap-4 flex-wrap">
              <div>
                <div className="text-[22px] font-extrabold tracking-tight mb-1">{member.name}</div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#a0a0b4] mb-3">
                  <Car size={12} /> {member.car || "No vehicle listed"}
                </div>
                <div className="inline-flex items-center gap-1.5 bg-[#D9BA84]/8 border border-[#D9BA84]/15 px-3 py-1.5 rounded-[9px] text-[12px] text-[#D9BA84] font-code">
                  <Hash size={12} />{member.id.slice(0, 16)}…
                </div>
                <div className="text-[11px] text-[#a0a0b4] mt-2">Member since {member.since}</div>
              </div>

              {/* QR Code - Show real membership QR if active, otherwise fake */}
              <div className="flex flex-col items-center gap-1.5 bg-[#D9BA84]/5 border border-[#D9BA84]/15 rounded-[14px] p-3 flex-shrink-0">
                {member.membershipStatus === "active" && member.qrCode ? (
                  <>
                    <img 
                      src={member.qrCode} 
                      alt="Membership QR Code" 
                      className="w-[90px] h-[90px] rounded-md"
                    />
                    <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#D9BA84]">
                      {member.membershipId}
                    </span>
                    <span className="text-[8px] font-semibold text-[#a0a0b4]">Active Member</span>
                  </>
                ) : (
                  <>
                    <FakeQR size={90} />
                    <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#a0a0b4]">
                      {member.membershipStatus === "active" ? "Scan to verify" : "No membership"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Token card */}
          <Card className="flex flex-col items-center text-center p-5">
            <SectionLabel>Token Balance</SectionLabel>
            <div className="relative mb-2">
              <TokenRing value={tokens} max={member.nextReward} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[20px] font-extrabold text-[#D9BA84] font-code leading-none">{tokens.toLocaleString()}</span>
                <span className="text-[9px] font-semibold uppercase tracking-wide text-[#a0a0b4]">tokens</span>
              </div>
            </div>
            <div className="text-[14px] font-bold text-white mb-0.5">WLA Tokens</div>
            <div className="text-[11px] text-[#a0a0b4] mb-2">Live balance · updates every few seconds</div>
            <div className="px-3 py-1 rounded-full bg-[#D9BA84]/7 border border-[#D9BA84]/14 text-[10px] font-semibold text-[#D9BA84] mb-3">
              {(member.nextReward - tokens).toLocaleString()} until next reward tier
            </div>
            <div className="flex gap-2 w-full mt-auto">
              <button className="flex-1 py-2 rounded-[10px] border border-[#D9BA84]/20 bg-[#D9BA84]/5 text-[#D9BA84] text-[12px] font-semibold hover:bg-[#D9BA84]/12 hover:border-[#D9BA84]/35 transition-all font-sora">
                Earn
              </button>
              <button className="flex-1 py-2 rounded-[10px] border-0 bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black text-[12px] font-bold hover:opacity-90 transition-opacity font-sora">
                Redeem
              </button>
            </div>
          </Card>          
        </div>

        {/* ── Stats ── */}
        <div className="fu3 grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} className="p-4">
                <div className="w-8 h-8 rounded-[9px] bg-[#D9BA84]/9 border border-[#D9BA84]/14 flex items-center justify-center text-[#D9BA84] mb-3 transition-all group-hover:bg-[#D9BA84]/16">
                  <Icon size={15} />
                </div>
                <div className="text-[26px] sm:text-[28px] font-extrabold text-white font-code tracking-tight leading-none">{s.value}</div>
                <div className="text-[11px] text-[#a0a0b4] mt-1">{s.label}</div>
              </Card>
            );
          })}
        </div>

        {/* ── Quick Actions ── */}
        <div className="fu4 mb-4">
          <SectionLabel>Quick Actions</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map((qa, i) => {
              const Icon = qa.icon;
              return (
                <Link
                  key={i}
                  href={qa.to}
                  className="flex flex-col items-center justify-center gap-2.5 py-5 px-3 bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl no-underline group transition-all duration-250 hover:border-[#D9BA84]/35 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.55)] hover:bg-[#D9BA84]/4"
                >
                  <div className="w-10 h-10 rounded-[12px] bg-[#D9BA84]/10 border border-[#D9BA84]/18 flex items-center justify-center text-[#D9BA84] group-hover:shadow-[0_0_18px_rgba(217,186,132,0.2)] transition-shadow">
                    <Icon size={18} />
                  </div>
                  <span className="text-[12px] font-semibold text-white text-center">{qa.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Bottom: Notifications + Contests ── */}
        <div className="fu5 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          {/* Notifications */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[13px] font-bold text-white">
                <Sparkles size={14} className="text-[#D9BA84]" /> Notifications
              </div>
              <button className="text-[11px] text-[#D9BA84] font-semibold flex items-center gap-0.5 hover:opacity-65 transition-opacity font-sora">
                See all <ChevronRight size={10} />
              </button>
            </div>
            <div className="flex flex-col gap-0.5">
              {notifs.map(n => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.id}
                    className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl border border-transparent cursor-pointer hover:bg-[#D9BA84]/4 hover:border-[#D9BA84]/12 transition-all"
                    onClick={() => markRead(n.id)}
                  >
                    <div className={`w-[30px] h-[30px] rounded-[8px] flex items-center justify-center flex-shrink-0 bg-[#D9BA84]/9 ${n.color}`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[13px] text-white leading-snug ${n.unread ? "font-semibold" : "font-normal"}`}>{n.title}</div>
                      <div className="text-[11px] text-[#a0a0b4] mt-0.5">{n.time}</div>
                    </div>
                    {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#D9BA84] mt-1.5 flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Active Contests */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[13px] font-bold text-white">
                <Trophy size={14} className="text-[#D9BA84]" /> Active Contests
              </div>
              <button className="text-[11px] text-[#D9BA84] font-semibold flex items-center gap-0.5 hover:opacity-65 transition-opacity font-sora">
                See all <ChevronRight size={10} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {CONTESTS.map(c => (
                <div key={c.id} className="relative overflow-hidden px-3.5 py-3 rounded-[14px] bg-[#161616] border border-[#D9BA84]/10 cursor-pointer hover:border-[#D9BA84]/32 hover:translate-x-1 transition-all duration-200 group">
                  {/* Left accent bar */}
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-[3px] bg-gradient-to-b from-[#D9BA84] to-[#c8b450] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#c8b450] bg-[#c8b450]/10 border border-[#c8b450]/20 px-2 py-0.5 rounded-full">{c.category}</span>
                    {c.hot && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-[#D9BA84] bg-[#D9BA84]/10 border border-[#D9BA84]/20 px-2 py-0.5 rounded-full">
                        <Flame size={9} /> Hot
                      </span>
                    )}
                  </div>
                  <div className="text-[14px] font-semibold text-white mb-2">{c.title}</div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1 text-[12px] font-semibold text-[#D9BA84]"><Coins size={11} /> {c.prize}</span>
                    <span className="flex items-center gap-1 text-[11px] text-[#a0a0b4]"><Clock size={10} /> {c.ends}</span>
                    <span className="flex items-center gap-1 text-[11px] text-[#a0a0b4]"><Users size={10} /> {c.entries}</span>
                  </div>
                  <button className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black text-[11px] font-bold hover:opacity-88 hover:scale-[1.03] transition-all font-sora">
                    <Zap size={10} /> Enter
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Recent Activity ── */}
        <div className="fu6">
          <SectionLabel>Recent Activity</SectionLabel>
          <Card className="px-3 py-2">
            {RECENT_ACTIVITY.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i}>
                  <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl border border-transparent hover:bg-[#D9BA84]/4 hover:border-[#D9BA84]/10 transition-all">
                    <div className="w-7 h-7 rounded-[8px] flex items-center justify-center flex-shrink-0 bg-[#D9BA84]/8 border border-[#D9BA84]/12 text-[#D9BA84]">
                      <Icon size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-white leading-snug">{a.label}</div>
                      <div className="text-[11px] text-[#a0a0b4] mt-0.5">{a.time}</div>
                    </div>
                  </div>
                  {i < RECENT_ACTIVITY.length - 1 && (
                    <div className="ml-[28px] w-px h-2.5 bg-[#D9BA84]/10 mx-auto" style={{ marginLeft: "28px" }} />
                  )}
                </div>
              );
            })}
          </Card>
        </div>

      </div>
    </div>
  );
}
