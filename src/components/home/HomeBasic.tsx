import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Trophy, CheckCircle, Clock, ChevronRight,
  Star, Users, Calendar, Award, TrendingUp, Coins,
  Car, Flame, Hash, Sparkles, ArrowUpRight, Zap,
  BarChart2, Shield, Upload, ShoppingBag
} from "lucide-react";

// ─── User data from Supabase ────────────────────────────────────────────────
function useMemberData() {
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', auth.user.id)
        .single();
      // Use first_name from profile, fallback to user_metadata, then empty string
      let firstName = profile && (profile as any).first_name || auth.user.user_metadata?.first_name || "";
      setMember({
        name: firstName,
        id: profile && (profile as any).id || auth.user.id,
        tier: profile && (profile as any).role || 'Member',
        since: profile && (profile as any).created_at ? new Date((profile as any).created_at).toLocaleDateString() : '',
        avatar: firstName[0]?.toUpperCase() || "?",
        car: profile && (profile as any).car || '',
        tokens: profile && (profile as any).tokens || 0,
        nextReward: 5000,
      });
      setLoading(false);
    }
    fetchData();
  }, []);
  return { member, loading };
}

const CONTESTS = [
  { id: 1, title: "Best Off-Road Build",  prize: "2,000 tokens + Trophy", ends: "Mar 15", entries: 47, category: "Builds",       hot: true  },
  { id: 2, title: "Spring Trail Photo",   prize: "1,000 tokens",          ends: "Mar 22", entries: 31, category: "Photography",  hot: false },
  { id: 3, title: "Member of the Month",  prize: "500 tokens + Badge",    ends: "Mar 31", entries: 18, category: "Community",   hot: false },
];

const NOTIFICATIONS = [
  { id: 1, type: "event",   icon: Calendar,   color: "#D9BA84", title: "Monthly Cruise this Saturday",    time: "2h ago",  unread: true  },
  { id: 2, type: "reward",  icon: Coins,      color: "#c8b450", title: "You earned 150 tokens!",          time: "1d ago",  unread: true  },
  { id: 3, type: "contest", icon: Trophy,     color: "#D9BA84", title: "Photo Contest ends in 3 days",    time: "2d ago",  unread: false },
  { id: 4, type: "system",  icon: CheckCircle,color: "#a0a0b4", title: "Membership renewed successfully", time: "5d ago",  unread: false },
];

const STATS = [
  { label: "Events Attended",  value: 12,  icon: Calendar,    suffix: "" },
  { label: "Contests Entered", value: 5,   icon: Trophy,      suffix: "" },
  { label: "Forum Posts",      value: 38,  icon: Users,       suffix: "" },
  { label: "Miles Logged",     value: 820, icon: TrendingUp,  suffix: "" },
];

const QUICK_ACTIONS = [
  { label: "Join Contest",   icon: Trophy,      color: "#D9BA84", to: "/dashboard/contests"       },
  { label: "Marketplace",    icon: ShoppingBag, color: "#c8b450", to: "/dashboard/marketplace"    },
  { label: "Upload Content", icon: Upload,      color: "#D9BA84", to: "/dashboard/content-uploads"},
  { label: "My Membership",  icon: Shield,      color: "#c8b450", to: "/dashboard/membership"     },
];

const RECENT_ACTIVITY = [
  { label: "Entered 'Best Off-Road Build' contest", time: "Today",     icon: Trophy   },
  { label: "Uploaded trail photo from Mojave trip", time: "Yesterday", icon: Upload   },
  { label: "Redeemed 200 tokens for sticker pack",  time: "Mar 2",    icon: Coins    },
  { label: "Attended March Community Meetup",       time: "Feb 28",   icon: Calendar },
  { label: "Earned Silver Trail Badge",             time: "Feb 20",   icon: Award    },
];

// ─── SVG QR (decorative) ─────────────────────────────────────────────────────
function FakeQR({ size = 108 }) {
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
  const cells = [];
  seed.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v) cells.push(
        <rect key={`${r}-${c}`} x={c * cell} y={r * cell}
          width={cell - 0.6} height={cell - 0.6}
          fill="#D9BA84" rx="0.5" />
      );
    })
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {cells}
    </svg>
  );
}

// ─── Token progress ring ──────────────────────────────────────────────────────
function TokenRing({ value, max }) {
  const pct = Math.min(value / max, 1);
  const r = 40, cx = 48, cy = 48, circ = 2 * Math.PI * r;
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

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  .hb-root *, .hb-root *::before, .hb-root *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .hb-root {
    font-family: 'Sora', sans-serif;
    color: #ffffff;
    background: #000000;
    min-height: 100vh;
  }

  .hb-page {
    padding: 28px 28px 60px;
    max-width: 1100px;
    background:
      radial-gradient(ellipse 60% 35% at 5% 0%, rgba(217,186,132,0.07) 0%, transparent 55%),
      radial-gradient(ellipse 50% 30% at 95% 100%, rgba(200,180,80,0.05) 0%, transparent 50%);
  }

  /* ── Welcome ── */
  .hb-welcome {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 24px; flex-wrap: wrap; gap: 14px;
  }
  .hb-greet-tag {
    font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: #D9BA84; margin-bottom: 6px;
    display: flex; align-items: center; gap: 6px;
  }
  .hb-greet-tag::before { content: ''; width: 18px; height: 1px; background: #D9BA84; }
  .hb-name {
    font-size: 30px; font-weight: 800; letter-spacing: -0.8px;
    line-height: 1.1; color: #ffffff;
  }
  .hb-sub { font-size: 13px; color: #a0a0b4; margin-top: 5px; }
  .hb-active-pill {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 20px;
    background: rgba(217,186,132,0.08); border: 1px solid rgba(217,186,132,0.2);
    font-size: 12px; font-weight: 600; color: #D9BA84;
    white-space: nowrap;
  }
  .hb-pulse { width: 7px; height: 7px; border-radius: 50%; background: #D9BA84; box-shadow: 0 0 6px rgba(217,186,132,0.6); animation: hbPulse 2s infinite; }
  @keyframes hbPulse { 0%,100%{opacity:1}50%{opacity:0.35} }

  /* ── Card base ── */
  .hb-card {
    background: #0d0d0d;
    border: 1px solid rgba(217,186,132,0.13);
    border-radius: 20px;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .hb-card:hover {
    border-color: rgba(217,186,132,0.32);
    transform: translateY(-2px);
    box-shadow: 0 14px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(217,186,132,0.07);
  }

  /* ── Top 2-col grid ── */
  .hb-top-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 16px;
    margin-bottom: 16px;
  }
  @media(max-width:860px){ .hb-top-grid{ grid-template-columns:1fr; } }

  /* ── Membership card ── */
  .hb-member-card {
    background: #0d0d0d;
    border: 1px solid rgba(217,186,132,0.18);
    border-radius: 20px; padding: 26px;
    position: relative; overflow: hidden;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .hb-member-card:hover {
    border-color: rgba(217,186,132,0.4);
    transform: translateY(-2px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.7), 0 0 30px rgba(217,186,132,0.05);
  }
  .hb-mc-glow {
    position: absolute; top: -50px; right: -50px;
    width: 220px; height: 220px; border-radius: 50%;
    background: radial-gradient(circle, rgba(217,186,132,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .hb-mc-pattern {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.035;
    background-image: repeating-linear-gradient(
      45deg, #D9BA84 0px, #D9BA84 1px, transparent 1px, transparent 14px
    );
  }
  .hb-mc-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; position: relative; }
  .hb-mc-tier {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(217,186,132,0.1); border: 1px solid rgba(217,186,132,0.22);
    padding: 4px 12px; border-radius: 20px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.04em; color: #D9BA84;
  }
  .hb-mc-verified { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #D9BA84; font-weight: 600; }
  .hb-mc-body { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; position: relative; }
  .hb-mc-name { font-size: 22px; font-weight: 800; letter-spacing: -0.3px; margin-bottom: 5px; }
  .hb-mc-car { font-size: 12px; color: #a0a0b4; display: flex; align-items: center; gap: 5px; margin-bottom: 14px; }
  .hb-mc-id {
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
    letter-spacing: 0.04em; color: #D9BA84;
    background: rgba(217,186,132,0.08); border: 1px solid rgba(217,186,132,0.15);
    padding: 6px 12px; border-radius: 9px;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .hb-mc-since { font-size: 11px; color: #a0a0b4; margin-top: 8px; }
  .hb-mc-qr {
    background: rgba(217,186,132,0.05); border: 1px solid rgba(217,186,132,0.15);
    border-radius: 14px; padding: 12px;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    flex-shrink: 0;
  }
  .hb-mc-qr-lbl { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #a0a0b4; }

  /* ── Token card ── */
  .hb-token-card {
    background: #0d0d0d;
    border: 1px solid rgba(217,186,132,0.13);
    border-radius: 20px; padding: 22px;
    display: flex; flex-direction: column; align-items: center;
    text-align: center;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .hb-token-card:hover {
    border-color: rgba(217,186,132,0.32);
    transform: translateY(-2px);
    box-shadow: 0 14px 40px rgba(0,0,0,0.65);
  }
  .hb-token-ring-wrap { position: relative; margin-bottom: 10px; }
  .hb-token-center {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .hb-token-val { font-size: 20px; font-weight: 800; color: #D9BA84; font-family: 'JetBrains Mono', monospace; letter-spacing: -1px; }
  .hb-token-unit { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #a0a0b4; }
  .hb-token-title { font-size: 14px; font-weight: 700; color: #ffffff; margin-bottom: 3px; }
  .hb-token-sub { font-size: 11px; color: #a0a0b4; }
  .hb-token-next {
    margin-top: 10px; padding: 4px 12px; border-radius: 20px;
    background: rgba(217,186,132,0.07); border: 1px solid rgba(217,186,132,0.14);
    font-size: 10px; font-weight: 600; color: #D9BA84;
  }
  .hb-token-btns { display: flex; gap: 8px; width: 100%; margin-top: 14px; }
  .hb-btn-outline {
    flex: 1; padding: 9px 0; border-radius: 10px;
    border: 1px solid rgba(217,186,132,0.2);
    background: rgba(217,186,132,0.05); color: #D9BA84;
    font-size: 12px; font-weight: 600; cursor: pointer;
    font-family: 'Sora', sans-serif;
    transition: background 0.2s, border-color 0.2s;
  }
  .hb-btn-outline:hover { background: rgba(217,186,132,0.12); border-color: rgba(217,186,132,0.35); }
  .hb-btn-gold {
    flex: 1; padding: 9px 0; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #D9BA84, #c8b450); color: #000;
    font-size: 12px; font-weight: 700; cursor: pointer;
    font-family: 'Sora', sans-serif;
    transition: opacity 0.2s, transform 0.15s;
  }
  .hb-btn-gold:hover { opacity: 0.9; transform: scale(1.02); }

  /* ── Stats row ── */
  .hb-stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 16px; margin-bottom: 16px;
  }
  @media(max-width:760px){ .hb-stats-grid{ grid-template-columns:1fr 1fr; } }

  .hb-stat {
    background: #0d0d0d;
    border: 1px solid rgba(217,186,132,0.13);
    border-radius: 16px; padding: 18px 16px;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
    cursor: default;
  }
  .hb-stat:hover {
    border-color: rgba(217,186,132,0.32);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 16px rgba(217,186,132,0.04);
  }
  .hb-stat-ico {
    width: 32px; height: 32px; border-radius: 9px; margin-bottom: 12px;
    background: rgba(217,186,132,0.09); border: 1px solid rgba(217,186,132,0.14);
    display: flex; align-items: center; justify-content: center; color: #D9BA84;
    transition: background 0.2s, box-shadow 0.2s;
  }
  .hb-stat:hover .hb-stat-ico { background: rgba(217,186,132,0.16); box-shadow: 0 0 14px rgba(217,186,132,0.12); }
  .hb-stat-val { font-size: 28px; font-weight: 800; color: #fff; font-family: 'JetBrains Mono', monospace; letter-spacing: -1px; line-height: 1; }
  .hb-stat-lbl { font-size: 11px; color: #a0a0b4; margin-top: 4px; }

  /* ── Quick actions ── */
  .hb-qa-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 12px; margin-bottom: 16px;
  }
  @media(max-width:760px){ .hb-qa-grid{ grid-template-columns:1fr 1fr; } }

  .hb-qa {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 10px; padding: 18px 12px;
    background: #0d0d0d; border: 1px solid rgba(217,186,132,0.13);
    border-radius: 16px; cursor: pointer; text-decoration: none;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s, background 0.25s;
  }
  .hb-qa:hover {
    border-color: rgba(217,186,132,0.35);
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.55), 0 0 20px rgba(217,186,132,0.05);
    background: rgba(217,186,132,0.04);
  }
  .hb-qa:hover .hb-qa-ico { box-shadow: 0 0 18px rgba(217,186,132,0.2); }
  .hb-qa-ico {
    width: 40px; height: 40px; border-radius: 12px;
    background: rgba(217,186,132,0.1); border: 1px solid rgba(217,186,132,0.18);
    display: flex; align-items: center; justify-content: center; color: #D9BA84;
    transition: box-shadow 0.25s;
  }
  .hb-qa-lbl { font-size: 12px; font-weight: 600; color: #fff; text-align: center; }

  /* ── Section header ── */
  .hb-sec-hdr {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 14px;
  }
  .hb-sec-title {
    font-size: 13px; font-weight: 700; color: #fff;
    display: flex; align-items: center; gap: 7px;
  }
  .hb-sec-title svg { color: #D9BA84; }
  .hb-sec-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #a0a0b4;
    display: flex; align-items: center; gap: 5px;
    margin-bottom: 14px;
  }
  .hb-sec-label::after { content: ''; flex: 1; height: 1px; background: rgba(217,186,132,0.1); }
  .hb-see-all {
    font-size: 11px; color: #D9BA84; font-weight: 600;
    display: flex; align-items: center; gap: 3px;
    background: none; border: none; cursor: pointer;
    font-family: 'Sora', sans-serif; transition: opacity 0.15s;
  }
  .hb-see-all:hover { opacity: 0.65; }

  /* ── Bottom 2-col ── */
  .hb-bottom-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media(max-width:720px){ .hb-bottom-grid{ grid-template-columns:1fr; } }

  /* ── Notifications ── */
  .hb-notif-item {
    display: flex; align-items: flex-start; gap: 11px;
    padding: 11px 13px; border-radius: 12px;
    border: 1px solid transparent;
    cursor: pointer; transition: background 0.2s, border-color 0.2s;
    margin-bottom: 3px;
  }
  .hb-notif-item:hover { background: rgba(217,186,132,0.04); border-color: rgba(217,186,132,0.12); }
  .hb-notif-ico {
    width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
    background: rgba(217,186,132,0.09); display: flex; align-items: center; justify-content: center;
  }
  .hb-notif-title { font-size: 13px; color: #fff; line-height: 1.35; }
  .hb-notif-time { font-size: 11px; color: #a0a0b4; margin-top: 2px; }
  .hb-notif-dot { width: 6px; height: 6px; border-radius: 50%; background: #D9BA84; flex-shrink: 0; margin-top: 5px; }

  /* ── Contests ── */
  .hb-contest-item {
    padding: 14px 15px; border-radius: 14px;
    background: #161616; border: 1px solid rgba(217,186,132,0.1);
    margin-bottom: 10px; cursor: pointer;
    transition: border-color 0.25s, transform 0.2s, box-shadow 0.2s;
    position: relative; overflow: hidden;
  }
  .hb-contest-item::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: linear-gradient(180deg, #D9BA84, #c8b450);
    opacity: 0; transition: opacity 0.25s;
    border-radius: 3px 0 0 3px;
  }
  .hb-contest-item:hover { border-color: rgba(217,186,132,0.32); transform: translateX(4px); box-shadow: -4px 0 0 rgba(217,186,132,0.25); }
  .hb-contest-item:hover::before { opacity: 1; }
  .hb-contest-item:last-child { margin-bottom: 0; }
  .hb-contest-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px; }
  .hb-contest-cat {
    font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: #c8b450; background: rgba(200,180,80,0.1); border: 1px solid rgba(200,180,80,0.2);
    padding: 2px 7px; border-radius: 10px;
  }
  .hb-hot {
    display: flex; align-items: center; gap: 3px;
    font-size: 9px; font-weight: 700; color: #D9BA84;
    background: rgba(217,186,132,0.1); border: 1px solid rgba(217,186,132,0.2);
    padding: 2px 7px; border-radius: 10px;
  }
  .hb-contest-title { font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 8px; }
  .hb-contest-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .hb-contest-prize { font-size: 12px; color: #D9BA84; font-weight: 600; display: flex; align-items: center; gap: 4px; }
  .hb-contest-info  { font-size: 11px; color: #a0a0b4; display: flex; align-items: center; gap: 4px; }
  .hb-enter-btn {
    display: inline-flex; align-items: center; gap: 5px; margin-top: 9px;
    padding: 5px 12px; border-radius: 8px; border: none; cursor: pointer;
    font-size: 11px; font-weight: 700; font-family: 'Sora', sans-serif;
    background: linear-gradient(135deg, #D9BA84, #c8b450); color: #000;
    transition: opacity 0.2s, transform 0.15s;
  }
  .hb-enter-btn:hover { opacity: 0.88; transform: scale(1.04); }

  /* ── Activity feed ── */
  .hb-activity-item {
    display: flex; align-items: flex-start; gap: 11px;
    padding: 10px 13px; border-radius: 12px;
    border: 1px solid transparent;
    transition: background 0.2s, border-color 0.2s;
    cursor: default; margin-bottom: 3px;
  }
  .hb-activity-item:hover { background: rgba(217,186,132,0.04); border-color: rgba(217,186,132,0.1); }
  .hb-activity-ico {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    background: rgba(217,186,132,0.08); border: 1px solid rgba(217,186,132,0.12);
    display: flex; align-items: center; justify-content: center; color: #D9BA84;
  }
  .hb-activity-label { font-size: 13px; color: #fff; line-height: 1.35; }
  .hb-activity-time  { font-size: 11px; color: #a0a0b4; margin-top: 2px; }
  .hb-activity-line {
    width: 1px; background: rgba(217,186,132,0.1); margin-left: 13px; height: 10px; margin-bottom: 3px;
  }

  /* ── Fade-up animation ── */
  @keyframes hbFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hb-a1 { animation: hbFadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.00s both; }
  .hb-a2 { animation: hbFadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.06s both; }
  .hb-a3 { animation: hbFadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
  .hb-a4 { animation: hbFadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.18s both; }
  .hb-a5 { animation: hbFadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.24s both; }
  .hb-a6 { animation: hbFadeUp 0.45s cubic-bezier(0.16,1,0.3,1) 0.30s both; }
`;


export default function HomeBasic() {
  const { member, loading } = useMemberData();
  const [tokens, setTokens] = useState(member?.tokens || 0);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  useEffect(() => {
    setTokens(member?.tokens || 0);
  }, [member]);

  useEffect(() => {
    const t = setInterval(() => setTokens(v => v + Math.floor(Math.random() * 3)), 4500);
    return () => clearInterval(t);
  }, []);

  const markRead = (id: number) =>
    setNotifs(ns => ns.map(n => n.id === id ? { ...n, unread: false } : n));

  if (loading || !member) return <div className="hb-root"><style>{styles}</style><div className="hb-page"><div className="hb-welcome hb-a1"><div>Loading...</div></div></div></div>;

  return (
    <div className="hb-root">
      <style>{styles}</style>
      <div className="hb-page">
        {/* ── Welcome ── */}
        <div className="hb-welcome hb-a1">
          <div>
            <div className="hb-greet-tag">Member Dashboard</div>
            <div className="hb-name">Hey, {member.name?.split(" ")[0]} 👋</div>
            <div className="hb-sub">Here's what's happening in your club today.</div>
          </div>
          <div className="hb-active-pill">
            <div className="hb-pulse" /> Membership Active
          </div>
        </div>
        {/* ...existing code for cards, stats, quick actions, notifications, contests, activity, using member data where needed... */}
        {/* Membership + Token */}
        <div className="hb-top-grid hb-a2">
          {/* Membership card */}
          <div className="hb-member-card">
            <div className="hb-mc-glow" />
            <div className="hb-mc-pattern" />
            <div className="hb-mc-top">
              <div className="hb-mc-tier"><Star size={11} /> {member.tier}</div>
              <div className="hb-mc-verified"><CheckCircle size={13} /> Verified Member</div>
            </div>
            <div className="hb-mc-body">
              <div>
                <div className="hb-mc-name">{member.name}</div>
                <div className="hb-mc-car"><Car size={12} /> {member.car}</div>
                <div className="hb-mc-id"><Hash size={12} />{member.id}</div>
                <div className="hb-mc-since">Member since {member.since}</div>
              </div>
              <div className="hb-mc-qr">
                <FakeQR size={108} />
                <div className="hb-mc-qr-lbl">Scan to verify</div>
              </div>
            </div>
          </div>
          {/* Token balance card */}
          <div className="hb-token-card">
            <div className="hb-sec-label" style={{ alignSelf: "flex-start", width: "100%" }}>
              Token Balance
            </div>
            <div className="hb-token-ring-wrap">
              <TokenRing value={tokens} max={member.nextReward} />
              <div className="hb-token-center">
                <div className="hb-token-val">{tokens.toLocaleString()}</div>
                <div className="hb-token-unit">tokens</div>
              </div>
            </div>
            <div className="hb-token-title">WLA Tokens</div>
            <div className="hb-token-sub">Live balance · updates every few seconds</div>
            <div className="hb-token-next">
              {(member.nextReward - tokens).toLocaleString()} until next reward tier
            </div>
            <div className="hb-token-btns">
              <button className="hb-btn-outline">Earn</button>
              <button className="hb-btn-gold">Redeem</button>
            </div>
          </div>
        </div>
        {/* ...rest of the code for stats, quick actions, notifications, contests, activity... */}
        {/* ...use member data where needed... */}
      </div>
    </div>
  );
}