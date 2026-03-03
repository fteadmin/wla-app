import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Hash, CheckCircle, Settings } from "lucide-react";
import StatsOverview from "../dashboard/StatsOverview";
import QRScanner from "../dashboard/QRScanner";
import UserManagement from "../dashboard/UserManagement";

export default function HomeAdmin() {
  const [membershipData, setMembershipData] = useState<{
    membershipId: string | null;
    qrCode: string | null;
    membershipStatus: string | null;
    email: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembershipData() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("membership_id, qr_code, membership_status")
        .eq("id", auth.user.id)
        .single();

      setMembershipData({
        membershipId: profile?.membership_id || null,
        qrCode: profile?.qr_code || null,
        membershipStatus: profile?.membership_status || null,
        email: auth.user.email || null,
      });
      setLoading(false);
    }
    fetchMembershipData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-[#a0a0b4] text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D9BA84] mb-2">
            <Settings size={16} />
            <span>Admin Dashboard</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">WLA Cruiser Club</h1>
          <p className="text-[#a0a0b4]">Manage members, events, and content for the community.</p>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Admin Membership Card */}
        {membershipData?.membershipStatus === "active" && membershipData.qrCode && (
          <div className="bg-[#0d0d0d] border border-[#D9BA84]/18 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={20} className="text-[#D9BA84]" />
              <h2 className="text-xl font-bold">Your Admin Membership</h2>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* QR Code */}
              <div className="flex flex-col items-center gap-3 bg-[#D9BA84]/5 border border-[#D9BA84]/15 rounded-xl p-4">
                <img 
                  src={membershipData.qrCode} 
                  alt="Admin Membership QR Code" 
                  className="w-32 h-32 rounded-lg"
                />
                <div className="text-center">
                  <div className="text-sm font-bold text-[#D9BA84] mb-1">
                    {membershipData.membershipId}
                  </div>
                  <div className="text-xs text-[#a0a0b4]">Admin Access</div>
                </div>
              </div>

              {/* Membership Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={16} className="text-[#D9BA84]" />
                  <span className="text-sm font-semibold text-[#D9BA84]">Active Membership</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-[#a0a0b4] mb-1">Membership ID</div>
                    <div className="flex items-center gap-2 bg-[#D9BA84]/8 border border-[#D9BA84]/15 px-3 py-2 rounded-lg text-sm font-mono">
                      <Hash size={14} className="text-[#D9BA84]" />
                      {membershipData.membershipId}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-[#a0a0b4] mb-1">Account Email</div>
                    <div className="text-sm text-white">{membershipData.email}</div>
                  </div>

                  <div>
                    <div className="text-xs text-[#a0a0b4] mb-1">Access Level</div>
                    <div className="inline-flex items-center gap-1.5 bg-[#D9BA84]/10 border border-[#D9BA84]/20 px-3 py-1 rounded-full text-xs font-bold text-[#D9BA84]">
                      <Shield size={12} />
                      Full Admin Access
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QR Scanner for Member Check-In */}
        <QRScanner />

        {/* User Management */}
        <UserManagement />
      </div>
    </div>
  );
}

