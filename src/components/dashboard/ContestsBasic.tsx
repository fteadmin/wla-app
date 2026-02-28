import { Link } from "react-router-dom";
import { Trophy, ArrowLeft, Clock } from "lucide-react";

export default function ContestsBasic() {
  return (
    <div className="min-h-full bg-black flex items-center justify-center p-6 font-sora">
      <div className="relative overflow-hidden bg-[#0d0d0d] border border-[#D9BA84]/18 rounded-3xl p-10 sm:p-14 max-w-[480px] w-full text-center">

        {/* Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-52 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(217,186,132,0.08) 0%, transparent 70%)" }} />
        {/* Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #D9BA84 0px, #D9BA84 1px, transparent 1px, transparent 14px)" }} />

        {/* Icon */}
        <div className="relative z-10 w-20 h-20 rounded-[22px] bg-[#D9BA84]/10 border border-[#D9BA84]/22 flex items-center justify-center mx-auto mb-7 text-[#D9BA84] animate-icon-float shadow-[0_0_0_0_rgba(217,186,132,0.12)]">
          <Trophy size={38} />
        </div>

        {/* Eyebrow */}
        <div className="relative z-10 flex items-center justify-center gap-2.5 text-[10px] font-bold tracking-[0.18em] uppercase text-[#D9BA84] mb-3.5">
          <span className="w-6 h-px bg-[#D9BA84]/35" />
          Coming Soon
          <span className="w-6 h-px bg-[#D9BA84]/35" />
        </div>

        {/* Title */}
        <h1 className="relative z-10 text-[32px] sm:text-[36px] font-extrabold tracking-tight text-white mb-3 leading-tight">
          Contests
        </h1>

        {/* Description */}
        <p className="relative z-10 text-[14px] text-[#a0a0b4] leading-relaxed mb-8">
          Our contest arena is being built. Soon you'll be able to enter photo contests,
          compete for prizes, and climb the leaderboard with fellow WLA Cruiser members.
        </p>

        {/* CTA */}
        <Link
          to="/dashboard"
          className="relative z-10 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black text-[13px] font-bold no-underline hover:opacity-88 hover:scale-[1.02] transition-all font-sora"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* Status tags */}
        <div className="relative z-10 flex items-center justify-center gap-2.5 mt-6 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D9BA84]/7 border border-[#D9BA84]/15 text-[11px] font-semibold text-[#D9BA84]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9BA84] shadow-[0_0_6px_rgba(217,186,132,0.7)] animate-dot-pulse" />
            In Development
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D9BA84]/7 border border-[#D9BA84]/15 text-[11px] font-semibold text-[#D9BA84]">
            <Clock size={11} /> Available Soon
          </div>
        </div>
      </div>
    </div>
  );
}
