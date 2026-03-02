import Link from "next/link";
import { ShoppingBag, ArrowLeft, Clock } from "lucide-react";

export default function MarketplaceBasic() {
  return (
    <div className="min-h-full bg-black flex items-center justify-center p-6 font-sora">
      <div className="relative overflow-hidden bg-[#0d0d0d] border border-[#c8b450]/18 rounded-3xl p-10 sm:p-14 max-w-[480px] w-full text-center">

        {/* Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-52 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,180,80,0.08) 0%, transparent 70%)" }} />
        {/* Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #c8b450 0px, #c8b450 1px, transparent 1px, transparent 14px)" }} />

        {/* Icon */}
        <div className="relative z-10 w-20 h-20 rounded-[22px] bg-[#c8b450]/10 border border-[#c8b450]/22 flex items-center justify-center mx-auto mb-7 text-[#c8b450] animate-icon-float">
          <ShoppingBag size={38} />
        </div>

        {/* Eyebrow */}
        <div className="relative z-10 flex items-center justify-center gap-2.5 text-[10px] font-bold tracking-[0.18em] uppercase text-[#c8b450] mb-3.5">
          <span className="w-6 h-px bg-[#c8b450]/35" />
          Coming Soon
          <span className="w-6 h-px bg-[#c8b450]/35" />
        </div>

        {/* Title */}
        <h1 className="relative z-10 text-[32px] sm:text-[36px] font-extrabold tracking-tight text-white mb-3 leading-tight">
          Marketplace
        </h1>

        {/* Description */}
        <p className="relative z-10 text-[14px] text-[#a0a0b4] leading-relaxed mb-8">
          The WLA Cruiser Marketplace is on its way. Browse parts, gear, and exclusive
          member deals — all in one place, designed for our community.
        </p>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="relative z-10 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black text-[13px] font-bold no-underline hover:opacity-88 hover:scale-[1.02] transition-all font-sora"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* Status tags */}
        <div className="relative z-10 flex items-center justify-center gap-2.5 mt-6 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#c8b450]/7 border border-[#c8b450]/15 text-[11px] font-semibold text-[#c8b450]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8b450] shadow-[0_0_6px_rgba(200,180,80,0.7)] animate-dot-pulse" />
            In Development
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#c8b450]/7 border border-[#c8b450]/15 text-[11px] font-semibold text-[#c8b450]">
            <Clock size={11} /> Available Soon
          </div>
        </div>
      </div>
    </div>
  );
}
