import React, { useState } from "react";
import { 
  Shield, CheckCircle, Lock, Star, Crown, Zap, Users, 
  Trophy, Calendar, Upload, ShoppingBag, Coins, X, 
  AlertCircle, Loader, ChevronRight, Award, Car 
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe("pk_test_YOUR_STRIPE_PUBLISHABLE_KEY");

const PLAN = {
  name: "Basic Membership",
  price: 20,
  badge: "Current Offering",
  features: [
    "Full community access",
    "Enter yearly contests",
    "Earn & spend BLVD Tokens",
    "Event RSVPs & attendance",
    "Member-only marketplace",
    "Content uploads & gallery",
    "Digital membership card",
    "Yearly newsletter",
  ],
  limits: [
    "Admin dashboard access",
    "Posting marketplace listings",
    "Event hosting privileges",
  ],
};

// --- Styles Helper ---
const styles = `
  .mb-root { font-family: 'Sora', sans-serif; }
  .mb-plan-card {
    background: linear-gradient(160deg, #0f0f0a 0%, #0d0d0d 100%);
    border: 1.5px solid rgba(217,186,132,0.28);
    border-radius: 24px; padding: 28px;
    position: relative; overflow: hidden;
    transition: all 0.25s;
  }
  .mb-plan-card:hover { border-color: rgba(217,186,132,0.45); transform: translateY(-2px); }
  .mb-plan-ico { width: 46px; height: 46px; border-radius: 13px; background: rgba(217,186,132,0.1); border: 1px solid rgba(217,186,132,0.3); display: flex; align-items: center; justify-content: center; color: #D9BA84; }
  .mb-plan-price-val { font-size: 42px; font-weight: 800; color: #D9BA84; }
  .mb-divider { height: 1px; background: rgba(217,186,132,0.12); margin: 20px 0; }
  .mb-pay-btn { width: 100%; padding: 13px; border-radius: 12px; background: linear-gradient(135deg, #D9BA84, #c8b450); color: #000; font-weight: 700; cursor: pointer; border: none; }
`;

// --- Components ---

function MembershipStripeModal({ onClose, onSuccess }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center text-gray-900">
        <div className="mb-4 font-bold text-lg">Stripe Checkout</div>
        <p className="text-sm text-gray-600 mb-6">This is a simulated Stripe Elements field.</p>
        <button className="w-full bg-yellow-400 text-black px-4 py-2 rounded mb-2 font-bold" onClick={onSuccess}>Pay $20.00</button>
        <button className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded font-semibold" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default function MembershipBasic() {
  const [subscribed, setSubscribed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [nextBill, setNextBill] = useState("");

  const handleStripeSuccess = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    setNextBill(d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
    
    setShowStripeModal(false);
    setSubscribed(true);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    if (window.confirm("Cancel your membership? Access continues until end of billing period.")) {
      setSubscribed(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <style>{styles}</style>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="bg-gray-900 border border-yellow-300 rounded-2xl p-8 max-w-sm w-full text-center">
            <CheckCircle size={48} className="text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Welcome to WLA!</h2>
            <p className="text-gray-400 mb-6">Your membership is active.</p>
            <button className="w-full bg-yellow-400 text-black py-2 rounded-lg font-bold" onClick={() => setShowSuccess(false)}>
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-xl">
        <header className="mb-10 text-center">
          <span className="text-yellow-400 uppercase tracking-tighter text-sm font-bold">Membership</span>
          <h1 className="text-4xl font-black mt-2">WLA Cruiser Club</h1>
        </header>

        {subscribed && (
          <div className="flex items-center justify-between bg-yellow-400/10 border border-yellow-400/30 p-4 rounded-xl mb-8">
            <div className="flex items-center gap-3">
              <Shield className="text-yellow-400" />
              <div>
                <p className="font-bold">Active Member</p>
                <p className="text-xs text-yellow-400/70">Next bill: {nextBill}</p>
              </div>
            </div>
            <button onClick={handleCancel} className="text-xs font-bold border border-yellow-400/50 px-3 py-1 rounded-lg">Manage</button>
          </div>
        )}

        <div className="mb-plan-card">
          <div className="flex justify-between items-start mb-6">
            <div className="mb-plan-ico"><Shield size={24} /></div>
            <span className="text-[10px] font-bold bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded border border-yellow-400/30 uppercase">{PLAN.badge}</span>
          </div>

          <h3 className="text-2xl font-bold">{PLAN.name}</h3>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="mb-plan-price-val">${PLAN.price}</span>
            <span className="text-gray-500">/ year</span>
          </div>

          <div className="mb-divider" />

          <ul className="space-y-3 mb-8">
            {PLAN.features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <CheckCircle size={16} className="text-yellow-400" /> {f}
              </li>
            ))}
          </ul>

          <button 
            disabled={subscribed}
            className={`mb-pay-btn flex items-center justify-center gap-2 ${subscribed ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setShowStripeModal(true)}
          >
            <Lock size={18} /> {subscribed ? "Already Subscribed" : "Subscribe Now"}
          </button>
        </div>
      </div>

      {showStripeModal && (
        <Elements stripe={stripePromise}>
          <MembershipStripeModal onClose={() => setShowStripeModal(false)} onSuccess={handleStripeSuccess} />
        </Elements>
      )}
    </div>
  );
}