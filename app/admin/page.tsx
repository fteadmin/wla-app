"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";
import { 
  Shield, Users, Coins, DollarSign, Activity, 
  Camera, Hash, Search, Plus, Minus, RotateCcw,
  Trophy, ShoppingBag, X, Calendar, CheckCircle, XCircle
} from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import UserManagement from "@/components/dashboard/UserManagement";

interface Stats {
  totalMembers: number;
  activeMembers: number;
  totalTokens: number;
  totalRevenue: number;
}

interface MemberData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  tokens: number;
  membership_status: string;
  membership_id: string | null;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalMembers: 0,
    activeMembers: 0,
    totalTokens: 0,
    totalRevenue: 0,
  });
  
  // Member Validator State
  const [validatorMode, setValidatorMode] = useState<"scan" | "manual" | null>(null);
  const [manualSearch, setManualSearch] = useState("");
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // Token Controller State
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [tokenAction, setTokenAction] = useState<"add" | "subtract" | "reset">("add");
  
  // Contest Form State
  const [showContestForm, setShowContestForm] = useState(false);
  const [contestForm, setContestForm] = useState({
    title: "",
    description: "",
    prize: "",
    end_date: "",
  });
  
  // Marketplace Form State
  const [showMarketplaceForm, setShowMarketplaceForm] = useState(false);
  const [marketplaceForm, setMarketplaceForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "parts",
    image_url: "",
  });

  useEffect(() => {
    checkAdminAccess();
    fetchStats();
  }, []);

  useEffect(() => {
    // Cleanup scanner on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  async function checkAdminAccess() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", auth.user.id)
      .single();

    if (profile?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  }

  async function fetchStats() {
    try {
      // Fetch user stats
      const { data: users } = await supabase
        .from("user_profiles")
        .select("membership_status, tokens");

      const totalMembers = users?.length || 0;
      const activeMembers = users?.filter(u => u.membership_status === "active").length || 0;
      const totalTokens = users?.reduce((sum, u) => sum + (u.tokens || 0), 0) || 0;

      // Fetch transaction revenue
      const { data: purchases } = await supabase
        .from("token_purchases")
        .select("amount");

      const totalRevenue = purchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      setStats({ totalMembers, activeMembers, totalTokens, totalRevenue });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  function startScanner() {
    setScannerActive(true);
    setValidatorMode("scan");
    setSearchError(null);
    
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: 250 },
        false
      );

      scanner.render(
        (decodedText) => {
          // Success callback
          lookupMember(decodedText);
          scanner.clear();
          setScannerActive(false);
        },
        (error) => {
          // Error callback (can be ignored for continuous scanning)
        }
      );

      scannerRef.current = scanner;
    }, 100);
  }

  function stopScanner() {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setScannerActive(false);
    setValidatorMode(null);
  }

  async function lookupMember(searchTerm: string) {
    setSearchError(null);
    setLoading(true);
    
    try {
      // Search by membership_id or email
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .or(`membership_id.eq.${searchTerm},email.eq.${searchTerm}`)
        .single();

      if (error || !data) {
        setSearchError("Member not found. Please check the ID or email.");
        setMemberData(null);
        return;
      }

      setMemberData(data);
      stopScanner();
    } catch (error) {
      console.error("Error looking up member:", error);
      setSearchError("An error occurred while searching.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTokenAction() {
    if (!memberData) return;
    
    let newTokenBalance = memberData.tokens || 0;
    
    switch (tokenAction) {
      case "add":
        newTokenBalance += tokenAmount;
        break;
      case "subtract":
        newTokenBalance = Math.max(0, newTokenBalance - tokenAmount);
        break;
      case "reset":
        newTokenBalance = 0;
        break;
    }

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ tokens: newTokenBalance })
        .eq("id", memberData.id);

      if (error) throw error;

      setMemberData({ ...memberData, tokens: newTokenBalance });
      setTokenAmount(0);
      await fetchStats();
      alert(`Successfully ${tokenAction === "reset" ? "reset" : tokenAction === "add" ? "added" : "subtracted"} tokens!`);
    } catch (error) {
      console.error("Error updating tokens:", error);
      alert("Failed to update tokens");
    }
  }

  async function createContest(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const { error } = await supabase.from("contests").insert({
        title: contestForm.title,
        description: contestForm.description,
        prize: contestForm.prize,
        end_date: contestForm.end_date,
        created_by: auth.user.id,
      });

      if (error) throw error;

      setContestForm({ title: "", description: "", prize: "", end_date: "" });
      setShowContestForm(false);
      alert("Contest created successfully!");
    } catch (error) {
      console.error("Error creating contest:", error);
      alert("Failed to create contest");
    }
  }

  async function createMarketplaceItem(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const { error } = await supabase.from("marketplace_items").insert({
        title: marketplaceForm.title,
        description: marketplaceForm.description,
        price: parseFloat(marketplaceForm.price),
        category: marketplaceForm.category,
        image_url: marketplaceForm.image_url || null,
        created_by: auth.user.id,
        status: "active",
      });

      if (error) throw error;

      setMarketplaceForm({ title: "", description: "", price: "", category: "parts", image_url: "" });
      setShowMarketplaceForm(false);
      alert("Marketplace item posted successfully!");
    } catch (error) {
      console.error("Error creating marketplace item:", error);
      alert("Failed to post item");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-[#a0a0b4]">Loading Admin Command Center...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D9BA84] mb-2">
            <Shield size={18} className="md:w-5 md:h-5" />
            <span>Admin Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">WLA Dashboard</h1>
          <p className="text-sm md:text-base text-[#a0a0b4]">Complete administrative control and management</p>
        </div>

        {/* Stats Dashboard - 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-4 md:p-6 hover:border-[#D9BA84]/25 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#D9BA84]/10 border border-[#D9BA84]/20 flex items-center justify-center flex-shrink-0">
                <Users size={20} className="md:w-6 md:h-6 text-[#D9BA84]" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">{stats.totalMembers}</div>
                <div className="text-xs text-[#a0a0b4]">Total Members</div>
              </div>
            </div>
          </div>

          <div className="bg-[#0d0d0d] border border-green-500/13 rounded-2xl p-4 md:p-6 hover:border-green-500/25 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                <Activity size={20} className="md:w-6 md:h-6 text-green-400" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">{stats.activeMembers}</div>
                <div className="text-xs text-[#a0a0b4]">Active Members</div>
              </div>
            </div>
          </div>

          <div className="bg-[#0d0d0d] border border-blue-500/13 rounded-2xl p-4 md:p-6 hover:border-blue-500/25 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Coins size={20} className="md:w-6 md:h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">{stats.totalTokens}</div>
                <div className="text-xs text-[#a0a0b4]">BLVD Tokens</div>
              </div>
            </div>
          </div>

          <div className="bg-[#0d0d0d] border border-purple-500/13 rounded-2xl p-4 md:p-6 hover:border-purple-500/25 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                <DollarSign size={20} className="md:w-6 md:h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">${(stats.totalRevenue / 100).toFixed(2)}</div>
                <div className="text-xs text-[#a0a0b4]">Total Revenue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Member Validator */}
        <div className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Camera size={20} className="text-[#D9BA84]" />
              <h2 className="text-xl font-bold">Member Validator</h2>
            </div>
            {(validatorMode || memberData) && (
              <button
                onClick={() => {
                  stopScanner();
                  setMemberData(null);
                  setValidatorMode(null);
                  setSearchError(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#a0a0b4]/10 border border-[#a0a0b4]/20 rounded-lg text-sm hover:bg-[#a0a0b4]/20 transition"
              >
                <X size={14} />
                Reset
              </button>
            )}
          </div>

          {!validatorMode && !memberData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={startScanner}
                className="flex flex-col items-center gap-3 p-6 bg-[#D9BA84]/10 border border-[#D9BA84]/20 rounded-xl hover:bg-[#D9BA84]/20 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D9BA84]/20 flex items-center justify-center">
                  <Camera size={24} className="text-[#D9BA84]" />
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-1">QR Scanner</div>
                  <div className="text-xs text-[#a0a0b4]">Scan member QR code</div>
                </div>
              </button>

              <button
                onClick={() => setValidatorMode("manual")}
                className="flex flex-col items-center gap-3 p-6 bg-[#D9BA84]/10 border border-[#D9BA84]/20 rounded-xl hover:bg-[#D9BA84]/20 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D9BA84]/20 flex items-center justify-center">
                  <Search size={24} className="text-[#D9BA84]" />
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-1">Manual Lookup</div>
                  <div className="text-xs text-[#a0a0b4]">Search by WLA-ID or Email</div>
                </div>
              </button>
            </div>
          )}

          {validatorMode === "scan" && scannerActive && (
            <div className="space-y-4">
              <div id="qr-reader" className="w-full"></div>
              <button
                onClick={stopScanner}
                className="w-full px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm hover:bg-red-500/20 transition text-red-400"
              >
                Stop Scanner
              </button>
            </div>
          )}

          {validatorMode === "manual" && !memberData && (
            <div className="space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0b4]" />
                <input
                  type="text"
                  placeholder="Enter WLA-ID or Email..."
                  value={manualSearch}
                  onChange={(e) => setManualSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && manualSearch.trim()) {
                      lookupMember(manualSearch.trim());
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                />
              </div>
              {searchError && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                  <XCircle size={16} />
                  {searchError}
                </div>
              )}
              <button
                onClick={() => lookupMember(manualSearch.trim())}
                disabled={!manualSearch.trim() || loading}
                className="w-full px-4 py-3 bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Searching..." : "Look Up Member"}
              </button>
            </div>
          )}

          {memberData && (
            <div className="space-y-6">
              {/* Member Card */}
              <div className="bg-[#000000] border border-[#D9BA84]/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4 text-green-400">
                  <CheckCircle size={20} />
                  <span className="font-semibold">Member Found</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">
                        {memberData.first_name} {memberData.last_name}
                      </h3>
                      <div className="text-sm text-[#a0a0b4]">{memberData.membership_id || "No Membership ID"}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      memberData.membership_status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-[#a0a0b4]/20 text-[#a0a0b4]"
                    }`}>
                      {memberData.membership_status || "inactive"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-[#a0a0b4] mb-1">Email</div>
                      <div className="text-sm font-medium break-all">{memberData.email}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#a0a0b4] mb-1">Tier</div>
                      <div className="text-sm font-medium capitalize">{memberData.role}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#a0a0b4] mb-1">BLVD Tokens</div>
                      <div className="text-sm font-medium flex items-center gap-1">
                        <Coins size={14} className="text-[#D9BA84]" />
                        {memberData.tokens || 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#a0a0b4] mb-1">Join Date</div>
                      <div className="text-sm font-medium">
                        {new Date(memberData.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Token Controller */}
              <div className="bg-[#000000] border border-[#D9BA84]/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Coins size={18} className="text-[#D9BA84]" />
                  Token Controller
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setTokenAction("add")}
                      className={`px-2 md:px-4 py-2 rounded-lg text-sm font-semibold transition ${
                        tokenAction === "add"
                          ? "bg-green-500/20 border border-green-500/40 text-green-400"
                          : "bg-[#D9BA84]/10 border border-[#D9BA84]/20 hover:bg-[#D9BA84]/20"
                      }`}
                    >
                      <Plus size={16} className="mx-auto" />
                      Add
                    </button>
                    <button
                      onClick={() => setTokenAction("subtract")}
                      className={`px-2 md:px-4 py-2 rounded-lg text-sm font-semibold transition ${
                        tokenAction === "subtract"
                          ? "bg-orange-500/20 border border-orange-500/40 text-orange-400"
                          : "bg-[#D9BA84]/10 border border-[#D9BA84]/20 hover:bg-[#D9BA84]/20"
                      }`}
                    >
                      <Minus size={16} className="mx-auto" />
                      Subtract
                    </button>
                    <button
                      onClick={() => setTokenAction("reset")}
                      className={`px-2 md:px-4 py-2 rounded-lg text-sm font-semibold transition ${
                        tokenAction === "reset"
                          ? "bg-red-500/20 border border-red-500/40 text-red-400"
                          : "bg-[#D9BA84]/10 border border-[#D9BA84]/20 hover:bg-[#D9BA84]/20"
                      }`}
                    >
                      <RotateCcw size={16} className="mx-auto" />
                      Reset
                    </button>
                  </div>

                  {tokenAction !== "reset" && (
                    <input
                      type="number"
                      min="0"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(parseInt(e.target.value) || 0)}
                      placeholder="Enter token amount"
                      className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                    />
                  )}

                  <button
                    onClick={handleTokenAction}
                    disabled={tokenAction !== "reset" && tokenAmount <= 0}
                    className={`w-full px-4 py-3 rounded-lg font-semibold transition disabled:opacity-50 ${
                      tokenAction === "add"
                        ? "bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30"
                        : tokenAction === "subtract"
                        ? "bg-orange-500/20 border border-orange-500/40 text-orange-400 hover:bg-orange-500/30"
                        : "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30"
                    }`}
                  >
                    {tokenAction === "reset" ? "Reset Tokens to 0" : `${tokenAction === "add" ? "Add" : "Subtract"} ${tokenAmount} Tokens`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Control */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Contest Creator */}
          <div className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={20} className="text-[#D9BA84]" />
              <h2 className="text-xl font-bold">Contest Creator</h2>
            </div>
            
            {!showContestForm ? (
              <button
                onClick={() => setShowContestForm(true)}
                className="w-full px-4 py-3 bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black font-semibold rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Create New Contest
              </button>
            ) : (
              <form onSubmit={createContest} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Contest Title"
                  value={contestForm.title}
                  onChange={(e) => setContestForm({ ...contestForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                />
                <textarea
                  required
                  rows={3}
                  placeholder="Description"
                  value={contestForm.description}
                  onChange={(e) => setContestForm({ ...contestForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                />
                <input
                  type="text"
                  required
                  placeholder="Prize"
                  value={contestForm.prize}
                  onChange={(e) => setContestForm({ ...contestForm, prize: e.target.value })}
                  className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                />
                <input
                  type="date"
                  required
                  value={contestForm.end_date}
                  onChange={(e) => setContestForm({ ...contestForm, end_date: e.target.value })}
                  className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowContestForm(false)}
                    className="flex-1 px-4 py-3 bg-[#a0a0b4]/10 border border-[#a0a0b4]/20 rounded-lg hover:bg-[#a0a0b4]/20 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black font-semibold rounded-lg hover:opacity-90 transition"
                  >
                    Create Contest
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Marketplace Item Poster */}
          <div className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag size={20} className="text-[#D9BA84]" />
              <h2 className="text-xl font-bold">Marketplace Poster</h2>
            </div>
            
            {!showMarketplaceForm ? (
              <button
                onClick={() => setShowMarketplaceForm(true)}
                className="w-full px-4 py-3 bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black font-semibold rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Post New Item
              </button>
            ) : (
              <form onSubmit={createMarketplaceItem} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Item Title"
                  value={marketplaceForm.title}
                  onChange={(e) => setMarketplaceForm({ ...marketplaceForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                />
                <textarea
                  required
                  rows={3}
                  placeholder="Description"
                  value={marketplaceForm.description}
                  onChange={(e) => setMarketplaceForm({ ...marketplaceForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Price"
                    value={marketplaceForm.price}
                    onChange={(e) => setMarketplaceForm({ ...marketplaceForm, price: e.target.value })}
                    className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                  />
                  <select
                    value={marketplaceForm.category}
                    onChange={(e) => setMarketplaceForm({ ...marketplaceForm, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                  >
                    <option value="parts">Parts</option>
                    <option value="accessories">Accessories</option>
                    <option value="gear">Gear</option>
                    <option value="bikes">Bikes</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  value={marketplaceForm.image_url}
                  onChange={(e) => setMarketplaceForm({ ...marketplaceForm, image_url: e.target.value })}
                  className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowMarketplaceForm(false)}
                    className="flex-1 px-4 py-3 bg-[#a0a0b4]/10 border border-[#a0a0b4]/20 rounded-lg hover:bg-[#a0a0b4]/20 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black font-semibold rounded-lg hover:opacity-90 transition"
                  >
                    Post Item
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* User Management Section */}
        <UserManagement />
      </div>
    </div>
  );
}