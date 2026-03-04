"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, DollarSign, TrendingUp, Activity } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalAdmins: number;
  totalCommunity: number;
  activeMembers: number;
  totalTransactions: number;
  totalRevenue: number;
  membershipRevenue: number;
  tokenRevenue: number;
}

export default function StatsOverview() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalAdmins: 0,
    totalCommunity: 0,
    activeMembers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    membershipRevenue: 0,
    tokenRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      // Fetch user counts
      const { data: allUsers } = await supabase
        .from("user_profiles")
        .select("role, membership_status");

      const totalUsers = allUsers?.length || 0;
      const totalAdmins = allUsers?.filter(u => u.role === "admin").length || 0;
      const totalCommunity = allUsers?.filter(u => u.role === "community").length || 0;
      const activeMembers = allUsers?.filter(u => u.membership_status === "active").length || 0;

      // Fetch token purchase revenue
      const { data: tokenPurchases } = await supabase
        .from("token_purchases")
        .select("amount");

      // Fetch membership payment revenue
      const { data: membershipPayments } = await supabase
        .from("membership_payments")
        .select("amount")
        .eq("status", "completed");

      const tokenRevenue = tokenPurchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const membershipRevenue = membershipPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const totalTransactions = (tokenPurchases?.length || 0) + (membershipPayments?.length || 0);
      const totalRevenue = tokenRevenue + membershipRevenue;

      setStats({
        totalUsers,
        totalAdmins,
        totalCommunity,
        activeMembers,
        totalTransactions,
        totalRevenue,
        membershipRevenue,
        tokenRevenue,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-6 animate-pulse">
            <div className="h-20 bg-[#D9BA84]/5 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Users */}
      <div className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-6 hover:border-[#D9BA84]/25 transition">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-[#D9BA84]/10 border border-[#D9BA84]/20 flex items-center justify-center">
            <Users size={24} className="text-[#D9BA84]" />
          </div>
          <div>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <div className="text-xs text-[#a0a0b4]">Total Users</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#D9BA84]"></div>
            <span className="text-[#a0a0b4]">{stats.totalAdmins} Admins</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#a0a0b4]"></div>
            <span className="text-[#a0a0b4]">{stats.totalCommunity} Community</span>
          </div>
        </div>
      </div>

      {/* Active Members */}
      <div className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-6 hover:border-[#D9BA84]/25 transition">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Activity size={24} className="text-green-400" />
          </div>
          <div>
            <div className="text-3xl font-bold">{stats.activeMembers}</div>
            <div className="text-xs text-[#a0a0b4]">Active Members</div>
          </div>
        </div>
        <div className="text-xs text-[#a0a0b4]">
          {stats.totalUsers > 0 
            ? `${Math.round((stats.activeMembers / stats.totalUsers) * 100)}% of total users`
            : "No users yet"
          }
        </div>
      </div>

      {/* Total Transactions */}
      <div className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-6 hover:border-[#D9BA84]/25 transition">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <DollarSign size={24} className="text-blue-400" />
          </div>
          <div>
            <div className="text-3xl font-bold">${(stats.totalRevenue / 100).toFixed(2)}</div>
            <div className="text-xs text-[#a0a0b4]">Total Revenue</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span className="text-[#a0a0b4]">Memberships: ${(stats.membershipRevenue / 100).toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#D9BA84]"></div>
            <span className="text-[#a0a0b4]">Tokens: ${(stats.tokenRevenue / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
