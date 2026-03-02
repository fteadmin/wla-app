"use client";
import React, { useState, useEffect } from "react";
import TopNav from "@/components/dashboard/TopNav";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
import {
  CheckCircle, Star, Crown, Zap, Trophy,
  ShoppingBag, Coins, Lock, X,
  AlertCircle, Loader, ChevronRight, Award,
  TrendingUp, BarChart2, ArrowUpRight, ShoppingCart
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

const TOKEN_PACKS = [
  { id: 1, label: "Starter", tokens: 100, price: 1, icon: Coins, color: "text-yellow-300", desc: "Get started with 100 tokens" },
  { id: 2, label: "Popular", tokens: 500, price: 5, icon: Trophy, color: "text-yellow-500", desc: "Most popular pack", badge: "Most Popular", highlight: true },
  { id: 3, label: "Pro", tokens: 1000, price: 10, icon: Star, color: "text-yellow-400", desc: "Best value for power users", badge: "Best Value" },
  { id: 4, label: "Elite", tokens: 5000, price: 50, icon: Crown, color: "text-yellow-300", desc: "Maximum tokens, maximum rewards", badge: "VIP", highlight: false }
];

const REDEEM_OPTIONS = [
  { label: "Sticker Pack", cost: 200, icon: Award },
  { label: "T-Shirt", cost: 1000, icon: ShoppingBag },
  { label: "VIP Event Entry", cost: 2500, icon: Crown }
];

async function fetchTokenHistory(userId: string) {
  const { data } = await supabase
    .from('token_purchases')
    .select('id, token_id, amount, created_at, status')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return (data || []).map(p => ({
    id: p.id,
    type: 'purchase',
    label: 'Token Purchase',
    token_id: p.token_id,
    amount: p.amount,
    status: p.status,
    date: new Date(p.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    icon: Coins,
  }));
}

type UserProfileRow = Database["public"]["Tables"]["user_profiles"]["Row"];

function StripeModal({ pack, onClose, onSuccess }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!name.trim()) return setError("Please enter the cardholder name.");
    setLoading(true);
    setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const res = await fetch("/api/token-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokens: pack.tokens, price: pack.price, userId: user?.id }),
      });
      if (!res.ok) throw new Error("Could not connect to payment server.");
      const { clientSecret } = await res.json();
      const cardElement = elements.getElement(CardNumberElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement!, billing_details: { name } },
      });
      if (stripeError) throw new Error(stripeError.message);
      if (paymentIntent?.status === "succeeded") {
        setDone(true);
        setTimeout(() => { onSuccess(pack.tokens, pack.price, paymentIntent.id); onClose(); }, 2200);
      }
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#161616] border border-[#D9BA84]/30 rounded-2xl p-8 w-full max-w-md relative">
        <button className="absolute top-4 right-4 text-[#a0a0b4] hover:text-white" onClick={onClose}><X size={18} /></button>
        <div className="text-xl font-extrabold text-white mb-1">Purchase Tokens</div>
        <div className="text-sm text-[#a0a0b4] mb-4"><strong className="text-[#D9BA84]">{pack.label} Pack</strong> · Instant delivery</div>
        {done ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#D9BA84]/30 to-[#c8b450]/20 border border-[#D9BA84]/30 text-[#D9BA84] mb-2"><CheckCircle size={36} /></div>
            <div className="text-lg font-bold text-white">Payment Successful!</div>
            <div className="text-3xl font-mono font-extrabold text-[#D9BA84]">+{pack.tokens.toLocaleString()}</div>
            <div className="text-sm text-[#a0a0b4]">BLVD Tokens added to your wallet</div>
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-4">
            <div className="flex items-center justify-between bg-[#D9BA84]/10 border border-[#D9BA84]/20 rounded-lg px-4 py-3 mb-2">
              <div>
                <div className="text-2xl font-mono font-extrabold text-[#D9BA84]">{pack.tokens.toLocaleString()}</div>
                <div className="text-xs text-[#a0a0b4] mt-1">BLVD Tokens</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-mono font-extrabold text-white">${pack.price}.00</div>
                <div className="text-xs text-[#a0a0b4]">One-time charge</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-[#a0a0b4] mb-1">Cardholder Name</div>
              <input className="w-full bg-[#181818] border border-[#D9BA84]/20 rounded-md px-3 py-2 text-white mb-2 focus:outline-none focus:border-[#D9BA84]" placeholder="Jordan Rivera" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#a0a0b4] mb-1 flex items-center gap-1"><Lock size={12} /> Card Number</div>
              <div className="w-full bg-[#181818] border border-[#D9BA84]/20 rounded-md px-3 py-2 mb-2 focus-within:border-[#D9BA84]">
                <CardNumberElement options={{ style: { base: { color: '#fff', fontFamily: 'monospace', fontSize: '15px', '::placeholder': { color: '#a0a0b4' } }, invalid: { color: '#f87171' } } }} />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="text-xs font-bold text-[#a0a0b4] mb-1">Expiry</div>
                <div className="w-full bg-[#181818] border border-[#D9BA84]/20 rounded-md px-3 py-2 focus-within:border-[#D9BA84]">
                  <CardExpiryElement options={{ style: { base: { color: '#fff', fontFamily: 'monospace', fontSize: '15px', '::placeholder': { color: '#a0a0b4' } }, invalid: { color: '#f87171' } } }} />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-[#a0a0b4] mb-1">CVV</div>
                <div className="w-full bg-[#181818] border border-[#D9BA84]/20 rounded-md px-3 py-2 focus-within:border-[#D9BA84]">
                  <CardCvcElement options={{ style: { base: { color: '#fff', fontFamily: 'monospace', fontSize: '15px', '::placeholder': { color: '#a0a0b4' } }, invalid: { color: '#f87171' } } }} />
                </div>
              </div>
            </div>
            {error && <div className="flex items-center gap-2 p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs"><AlertCircle size={14} />{error}</div>}
            <button type="submit" className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-[#D9BA84] to-[#c8b450] text-black shadow mt-2 disabled:opacity-60" disabled={loading || !stripe}>
              {loading ? (<><Loader size={16} className="animate-spin" /> Processing…</>) : (<><Lock size={14} /> Pay ${pack.price}.00 · {pack.tokens.toLocaleString()} Tokens</>)}
            </button>
            <div className="flex items-center justify-center gap-2 text-xs text-[#a0a0b4] mt-2"><Lock size={12} /> Secured by <span className="font-bold text-[#D9BA84]">stripe</span></div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function TokenDashboard() {
  const [balance, setBalance] = useState(0);
  const [selectedPack, setPack] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const nextTier = 5000;
  const spent = 0;
  const earned = 0;

  useEffect(() => {
    async function fetchData() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('tokens')
        .eq('id', auth.user.id)
        .maybeSingle<UserProfileRow>();
      setBalance(profile && typeof profile.tokens === 'number' ? profile.tokens : 0);
      const tokenHistory = await fetchTokenHistory(auth.user.id);
      setHistory(Array.isArray(tokenHistory) ? tokenHistory : []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSuccess = async (tokens: number, price: number, stripePaymentId: string) => {
    setLoading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const tokenId = 'TKN-' + Math.random().toString(36).substring(2, 10).toUpperCase();

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('tokens')
        .eq('id', auth.user.id)
        .maybeSingle<UserProfileRow>();
      const currentTokens = typeof profile?.tokens === 'number' ? profile.tokens : 0;
      const newBalance = currentTokens + tokens;

      await supabase
        .from('user_profiles')
        .update({ tokens: newBalance })
        .eq('id', auth.user.id);

      await supabase.from('token_purchases').insert({
        user_id: auth.user.id,
        amount: tokens,
        stripe_payment_id: stripePaymentId,
        token_id: tokenId,
        status: 'completed',
      });

      setBalance(newBalance);
      const tokenHistory = await fetchTokenHistory(auth.user.id);
      setHistory(Array.isArray(tokenHistory) ? tokenHistory : []);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col font-sora">
        <TopNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-lg font-bold">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sora flex flex-col">
      <TopNav />
      {selectedPack && (
        <Elements stripe={stripePromise}>
          <StripeModal pack={selectedPack} onClose={() => setPack(null)} onSuccess={handleSuccess} />
        </Elements>
      )}
      <main className="flex-1 w-full">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D9BA84] mb-2">
              <span className="block w-5 h-0.5 bg-[#D9BA84]" />BLVD Token System
            </div>
            <div className="text-3xl font-extrabold text-white mb-1">Your Token Wallet</div>
            <div className="text-sm text-[#a0a0b4]">Purchase, earn, and redeem BLVD Tokens across the WLA community.</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#161616] border border-[#D9BA84]/20 rounded-xl p-5 flex flex-col items-center shadow">
              <div className="w-8 h-8 rounded-lg bg-[#D9BA84]/20 border border-[#D9BA84]/30 flex items-center justify-center mb-3 text-[#D9BA84]"><Coins size={16} /></div>
              <div className="text-2xl font-mono font-extrabold text-[#D9BA84]">{balance.toLocaleString()}</div>
              <div className="text-xs text-[#a0a0b4] mt-1">Current Balance</div>
              <div className="text-xs text-[#D9BA84] mt-1 font-semibold">{(nextTier - balance).toLocaleString()} to next tier</div>
            </div>
            <div className="bg-[#161616] border border-[#D9BA84]/10 rounded-xl p-5 flex flex-col items-center shadow">
              <div className="w-8 h-8 rounded-lg bg-[#D9BA84]/10 border border-[#D9BA84]/20 flex items-center justify-center mb-3 text-[#D9BA84]"><TrendingUp size={16} /></div>
              <div className="text-2xl font-mono font-extrabold text-white">{earned.toLocaleString()}</div>
              <div className="text-xs text-[#a0a0b4] mt-1">Tokens Earned</div>
            </div>
            <div className="bg-[#161616] border border-[#D9BA84]/10 rounded-xl p-5 flex flex-col items-center shadow">
              <div className="w-8 h-8 rounded-lg bg-[#D9BA84]/10 border border-[#D9BA84]/20 flex items-center justify-center mb-3 text-[#D9BA84]"><ArrowUpRight size={16} /></div>
              <div className="text-2xl font-mono font-extrabold text-white">{spent.toLocaleString()}</div>
              <div className="text-xs text-[#a0a0b4] mt-1">Tokens Spent</div>
            </div>
            <div className="bg-[#161616] border border-[#D9BA84]/20 rounded-xl p-5 flex flex-col items-center shadow">
              <div className="w-8 h-8 rounded-lg bg-[#c8b450]/20 border border-[#c8b450]/30 flex items-center justify-center mb-3 text-[#c8b450]"><Award size={16} /></div>
              <div className="text-2xl font-mono font-extrabold text-[#c8b450]">Gold</div>
              <div className="text-xs text-[#a0a0b4] mt-1">Member Tier</div>
              <div className="text-xs text-[#c8b450] mt-1">Top 15% of members</div>
            </div>
          </div>

          <div className="text-xs font-bold uppercase tracking-widest text-[#a0a0b4] flex items-center gap-2 mb-4">
            Purchase Token Packs
            <span className="flex-1 h-px bg-[#D9BA84]/10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {TOKEN_PACKS.map(pack => {
              const Icon = pack.icon;
              return (
                <div key={pack.id} className={`relative bg-[#161616] border rounded-2xl p-6 flex flex-col cursor-pointer transition hover:border-[#D9BA84]/60 ${pack.highlight ? "border-[#D9BA84]/60 shadow-lg" : "border-[#D9BA84]/20"}`} onClick={() => setPack(pack)}>
                  {pack.badge && (
                    <div className={`absolute top-3 right-3 text-[10px] font-bold uppercase px-2 py-1 rounded bg-[#D9BA84]/10 border border-[#D9BA84]/30 text-[#D9BA84]`}>{pack.badge}</div>
                  )}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${pack.color} bg-[#D9BA84]/10 border-[#D9BA84]/20`}><Icon size={24} /></div>
                  <div className="text-xs font-bold uppercase text-[#a0a0b4] mb-1">{pack.label}</div>
                  <div className="text-3xl font-mono font-extrabold text-white mb-1">{pack.tokens.toLocaleString()}<span className="text-base font-medium text-[#a0a0b4]"> tokens</span></div>
                  <div className="text-sm text-[#a0a0b4] mb-3 flex-1">{pack.desc}</div>
                  <div className="h-px bg-[#D9BA84]/10 mb-3" />
                  <div className="text-2xl font-mono font-extrabold text-[#D9BA84] mb-2">${pack.price}<span className="text-base text-[#a0a0b4] font-medium"> USD</span></div>
                  <button type="button" className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition ${pack.highlight ? "bg-gradient-to-r from-[#D9BA84] to-[#c8b450] text-black shadow" : "bg-[#D9BA84]/10 text-[#D9BA84] border border-[#D9BA84]/30"}`}> <ShoppingCart size={16} /> Buy Now </button>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#161616] border border-[#D9BA84]/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-base font-bold flex items-center gap-2"><BarChart2 size={18} className="text-[#D9BA84]" /> Transaction History</div>
              </div>
              {history.length === 0 ? (
                <div className="text-center py-8 text-[#a0a0b4] text-sm">No transactions yet.</div>
              ) : history.slice(0, 6).map(h => {
                const Ico = h.icon;
                return (
                  <div key={h.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#D9BA84]/5 border border-transparent hover:border-[#D9BA84]/10 mb-1 transition">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#D9BA84]/20 text-[#D9BA84] mt-0.5 shrink-0"><Ico size={15} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white">{h.label}</div>
                      {h.token_id && (
                        <div className="text-[10px] font-mono text-[#D9BA84]/70 mt-0.5 tracking-wider">{h.token_id}</div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#a0a0b4]">{h.date}</span>
                        {h.status && (
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${h.status === 'completed' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                            {h.status}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-sm font-mono font-bold ${h.amount > 0 ? "text-[#D9BA84]" : "text-[#a0a0b4]"}`}>
                        {h.amount > 0 ? "+" : ""}{h.amount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#a0a0b4] mt-0.5">tokens</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#161616] border border-[#D9BA84]/20 rounded-2xl p-6">
              <div className="flex items-center mb-4"><Zap size={18} className="text-[#D9BA84] mr-2" /> <span className="font-bold text-white">Redeem Tokens</span></div>
              <div className="text-xs text-[#a0a0b4] mb-3">Use your BLVD Tokens to unlock perks and contest entries.</div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {REDEEM_OPTIONS.map((r, i) => {
                  const Ico = r.icon;
                  const can = balance >= r.cost;
                  return (
                    <div key={i} className={`p-3 rounded-lg bg-[#181818] border ${can ? "border-[#D9BA84]/30" : "border-[#a0a0b4]/30"} flex flex-col gap-2 items-center transition ${can ? "hover:border-[#D9BA84]/60" : "opacity-50"}`}>
                      <div className="w-7 h-7 rounded-md flex items-center justify-center bg-[#D9BA84]/10 border border-[#D9BA84]/20 text-[#D9BA84] mb-1"><Ico size={14} /></div>
                      <div className="text-xs font-bold text-white">{r.label}</div>
                      <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#D9BA84]"><Coins size={12} /> {r.cost.toLocaleString()}</div>
                      <button
                        className={`w-full mt-1 py-1 rounded-md text-xs font-bold transition ${can ? "bg-[#D9BA84]/10 text-[#D9BA84] border border-[#D9BA84]/30 hover:bg-[#D9BA84]/20" : "bg-[#181818] text-[#a0a0b4] border border-[#a0a0b4]/30 cursor-not-allowed"}`}
                        onClick={() => can && setBalance(b => b - r.cost)}
                        disabled={!can}
                      >
                        {can ? "Redeem" : "Not enough"}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 p-4 rounded-xl bg-[#D9BA84]/5 border border-[#D9BA84]/20">
                <div className="flex justify-between mb-2 text-xs">
                  <span className="text-[#a0a0b4] font-medium">Progress to Platinum</span>
                  <span className="text-[#D9BA84] font-bold font-mono">{balance.toLocaleString()} / {nextTier.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-lg bg-[#D9BA84]/10 overflow-hidden">
                  <div className="h-full rounded-lg bg-gradient-to-r from-[#D9BA84] to-[#c8b450] transition-all duration-500" style={{ width: `${Math.min((balance / nextTier) * 100, 100)}%` }} />
                </div>
                <div className="text-xs text-[#a0a0b4] mt-1">{Math.max(nextTier - balance, 0).toLocaleString()} tokens until Platinum tier</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}