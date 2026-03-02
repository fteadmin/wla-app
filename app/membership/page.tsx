"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  CheckCircle, Star, Crown, Shield, X, AlertCircle, Loader, QrCode,
  Calendar, Award, Users, Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import QRCode from "qrcode";

function MembershipPaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [membershipData, setMembershipData] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => {
    // Check if Stripe has loaded
    if (stripe && elements) {
      console.log("✅ Stripe loaded successfully!");
      setStripeReady(true);
      setError(""); // Clear any errors
    } else {
      console.log("⏳ Waiting for Stripe to load...");
    }
  }, [stripe, elements]);

  useEffect(() => {
    // Give Stripe 5 seconds to load, otherwise show error
    const timeout = setTimeout(() => {
      if (!stripe || !elements) {
        setError("⚠️ Stripe payment system failed to load. Please check your internet connection or try using Stripe TEST keys instead of LIVE keys in development.");
        console.error("❌ Stripe failed to load. Check your NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [stripe, elements]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setError("Stripe is not loaded. Please refresh the page.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter the cardholder name.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please log in to continue");

      // Check if user already has active membership
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("membership_status")
        .eq("id", user.id)
        .single();

      if (profile?.membership_status === "active") {
        throw new Error("You already have an active membership!");
      }

      // Create payment intent
      const res = await fetch("/api/membership-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Could not connect to payment server.");
      }
      
      const { clientSecret } = await res.json();
      
      if (!clientSecret) {
        throw new Error("Payment server did not return a valid payment session.");
      }

      console.log("Payment intent created, confirming card payment...");

      // Confirm payment with Stripe
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        throw new Error("Card information is incomplete.");
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { 
          card: cardElement, 
          billing_details: { 
            name, 
            email: user.email 
          } 
        },
      });

      if (stripeError) {
        console.error("Stripe payment error:", stripeError);
        throw new Error(stripeError.message || "Payment failed.");
      }

      if (!paymentIntent) {
        throw new Error("Payment was not processed. Please try again.");
      }

      console.log("Payment Intent Status:", paymentIntent.status);

      // Only proceed if payment actually succeeded
      if (paymentIntent.status === "succeeded") {
        console.log("Payment succeeded! Processing membership...");
        
        // Generate membership ID
        const membershipId = `WLA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        // Generate QR Code
        const qrData = JSON.stringify({
          membershipId,
          userId: user.id,
          email: user.email,
          tier: "basic",
          activated: new Date().toISOString()
        });
        const qrUrl = await QRCode.toDataURL(qrData);

        // Update user profile with membership data
        const { error: updateError } = await supabase
          .from("user_profiles")
          .update({
            membership_id: membershipId,
            membership_status: "active",
            membership_tier: "basic",
            qr_code: qrUrl,
            payment_date: new Date().toISOString(),
            membership_expires: null,
          })
          .eq("id", user.id);

        if (updateError) {
          console.error("Failed to update user profile:", updateError);
          throw new Error("Payment succeeded but failed to activate membership. Please contact support with payment ID: " + paymentIntent.id);
        }

        // Record payment
        const { error: paymentRecordError } = await supabase.from("membership_payments").insert({
          user_id: user.id,
          amount: 2000,
          stripe_payment_id: paymentIntent.id,
          membership_tier: "basic",
          status: "completed",
        });

        if (paymentRecordError) {
          console.error("Failed to record payment:", paymentRecordError);
        }

        setMembershipData({ membershipId, qrUrl });
        setQrCodeUrl(qrUrl);
        setDone(true);

        // Redirect to dashboard after 5 seconds
        setTimeout(() => router.push("/dashboard"), 5000);
      } else if (paymentIntent.status === "requires_action" || paymentIntent.status === "requires_payment_method") {
        throw new Error("Payment requires additional authentication. Please try again.");
      } else {
        throw new Error(`Payment status: ${paymentIntent.status}. Please try again or contact support.`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment failed. Please try again.";
      console.error("Payment error:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (done && membershipData) {
    return (
      <div className="bg-[#161616] border border-[#D9BA84]/30 rounded-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-20 h-20 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#D9BA84]/30 to-[#c8b450]/20 border border-[#D9BA84]/30 text-[#D9BA84]">
            <CheckCircle size={42} />
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-white mb-2">Welcome to WLA!</div>
            <div className="text-sm text-[#a0a0b4] mb-4">Your membership is now active</div>
          </div>

          <div className="bg-black/40 border border-[#D9BA84]/20 rounded-xl p-4 w-full">
            <div className="text-xs font-bold text-[#D9BA84] uppercase tracking-wider mb-2">Membership ID</div>
            <div className="text-2xl font-mono font-bold text-white mb-4">{membershipData.membershipId}</div>

            {qrCodeUrl && (
              <div className="flex flex-col items-center gap-2">
                <div className="text-xs font-bold text-[#a0a0b4] uppercase">Your QR Code</div>
                <img src={qrCodeUrl} alt="Membership QR Code" className="w-40 h-40 rounded-lg border-2 border-[#D9BA84]/30" />
                <div className="text-xs text-[#a0a0b4] text-center mt-2">
                  Save this QR code for event check-ins
                </div>
              </div>
            )}
          </div>

          <div className="text-sm text-[#a0a0b4] text-center mt-2">
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#161616] border border-[#D9BA84]/30 rounded-2xl p-8 w-full max-w-md">
      <div className="text-2xl font-extrabold text-white mb-2">WLA Basic Membership</div>
      <div className="text-lg font-bold text-[#D9BA84] mb-4">$20.00</div>

      <div className="bg-black/40 border border-[#D9BA84]/20 rounded-xl p-4 mb-6 space-y-2">
        <div className="flex items-start gap-2">
          <CheckCircle size={18} className="text-[#D9BA84] mt-0.5" />
          <span className="text-sm text-white">Full platform access</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle size={18} className="text-[#D9BA84] mt-0.5" />
          <span className="text-sm text-white">Unique Membership ID</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle size={18} className="text-[#D9BA84] mt-0.5" />
          <span className="text-sm text-white">Personal QR Code</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle size={18} className="text-[#D9BA84] mt-0.5" />
          <span className="text-sm text-white">Access to contests & events</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle size={18} className="text-[#D9BA84] mt-0.5" />
          <span className="text-sm text-white">Token rewards program</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 flex items-start gap-2">
          <AlertCircle size={18} className="text-red-400 mt-0.5" />
          <span className="text-sm text-red-300">{error}</span>
        </div>
      )}

      <form onSubmit={handlePay} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Cardholder Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="OLA O"
            className="w-full bg-black/40 border border-[#D9BA84]/30 rounded-lg px-4 py-3 text-white placeholder-[#a0a0b4] focus:outline-none focus:border-[#D9BA84]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">Card Number</label>
          <div className="bg-black/40 border border-[#D9BA84]/30 rounded-lg px-4 py-3">
            <CardNumberElement
              options={{
                style: {
                  base: { color: "#ffffff", fontSize: "16px", "::placeholder": { color: "#a0a0b4" } },
                  invalid: { color: "#ef4444" },
                },
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Expiry</label>
            <div className="bg-black/40 border border-[#D9BA84]/30 rounded-lg px-4 py-3">
              <CardExpiryElement
                options={{
                  style: {
                    base: { color: "#ffffff", fontSize: "16px", "::placeholder": { color: "#a0a0b4" } },
                    invalid: { color: "#ef4444" },
                  },
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">CVV</label>
            <div className="bg-black/40 border border-[#D9BA84]/30 rounded-lg px-4 py-3">
              <CardCvcElement
                options={{
                  style: {
                    base: { color: "#ffffff", fontSize: "16px", "::placeholder": { color: "#a0a0b4" } },
                    invalid: { color: "#ef4444" },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {!stripeReady && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4 flex items-start gap-2">
            <Loader size={18} className="text-blue-400 mt-0.5 animate-spin" />
            <span className="text-sm text-blue-300">Loading secure payment form...</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !stripe || !stripeReady}
          className="w-full bg-gradient-to-r from-[#D9BA84] to-[#c8b450] text-black font-bold py-4 rounded-lg hover:from-[#c8b450] to-[#D9BA84] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Processing...
            </>
          ) : !stripeReady ? (
            <>
              <Loader size={20} className="animate-spin" />
              Initializing Stripe...
            </>
          ) : (
            <>
              <Shield size={20} />
              Pay $20.00 · Activate Membership
            </>
          )}
        </button>

        <div className="text-center text-xs text-[#a0a0b4] pt-2">
          <Shield size={14} className="inline mr-1" />
          Secured by <span className="font-semibold">Stripe</span>
        </div>
      </form>
    </div>
  );
}

export default function MembershipPage() {
  const [loading, setLoading] = useState(true);
  const [hasMembership, setHasMembership] = useState(false);
  const router = useRouter();

  // Initialize Stripe client-side with useMemo to ensure env vars are loaded
  const stripePromise = useMemo(() => {
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    console.log("🔑 Initializing Stripe...");
    console.log("🔑 Stripe Key Present:", !!stripeKey);
    console.log("🔑 Stripe Key Prefix:", stripeKey?.substring(0, 10));
    console.log("🔑 Stripe Key Length:", stripeKey?.length);
    
    if (!stripeKey) {
      console.error("❌ CRITICAL: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined!");
      return null;
    }
    
    console.log("✅ Loading Stripe.js...");
    return loadStripe(stripeKey);
  }, []);

  useEffect(() => {
    async function checkMembership() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("membership_status, membership_id, qr_code")
        .eq("id", user.id)
        .single();

      if (profile?.membership_status === "active") {
        setHasMembership(true);
      }

      setLoading(false);
    }

    checkMembership();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  if (hasMembership) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white font-['Sora'] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[80%] h-[50%] bg-[#D9BA84]/10 blur-[120px] rounded-full" />
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M0 0h30v30H0zM30 30h30v30H30z' fill='%23D9BA84'/%3E%3C/svg%3E")` }}
        />
      </div>

      <div className="relative z-10">
        <Elements stripe={stripePromise}>
          <MembershipPaymentForm />
        </Elements>
      </div>
    </div>
  );
}
