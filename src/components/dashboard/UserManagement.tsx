"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Coins, RefreshCw, Search, Filter, ChevronDown } from "lucide-react";

interface User {
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

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "community">("all");
  const [editingTokens, setEditingTokens] = useState<{ userId: string; amount: number } | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterRole !== "all") {
        query = query.eq("role", filterRole);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [filterRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function updateTokens(userId: string, amount: number) {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ tokens: amount })
        .eq("id", userId);

      if (error) throw error;
      
      // Refresh users list
      await fetchUsers();
      setEditingTokens(null);
    } catch (error) {
      console.error("Error updating tokens:", error);
      alert("Failed to update tokens");
    }
  }

  async function resetTokens(userId: string) {
    if (!confirm("Are you sure you want to reset this user's tokens to 0?")) return;
    await updateTokens(userId, 0);
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.membership_id?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-[#a0a0b4]">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <div className="flex items-center gap-2">
          <Users size={18} className="md:w-5 md:h-5 text-[#D9BA84]" />
          <h2 className="text-lg md:text-xl font-bold">User Management</h2>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#D9BA84]/10 border border-[#D9BA84]/20 rounded-lg text-xs md:text-sm hover:bg-[#D9BA84]/20 transition">
          <RefreshCw size={14} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0b4]" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#000000] border border-[#D9BA84]/20 rounded-lg text-sm focus:outline-none focus:border-[#D9BA84]/40"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value as "all" | "admin" | "basic");
            fetchUsers();
          }}
          className="px-4 py-2 bg-[#000000] border border-[#D9BA84]/20 rounded-lg text-sm focus:outline-none focus:border-[#D9BA84]/40 w-full sm:w-auto"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin Only</option>
          <option value="basic">Basic Only</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D9BA84]/10">
                <th className="text-left py-3 px-2 text-[#a0a0b4] font-semibold whitespace-nowrap">User</th>
                <th className="text-left py-3 px-2 text-[#a0a0b4] font-semibold hidden md:table-cell">Email</th>
                <th className="text-left py-3 px-2 text-[#a0a0b4] font-semibold">Role</th>
                <th className="text-left py-3 px-2 text-[#a0a0b4] font-semibold hidden lg:table-cell">Membership</th>
                <th className="text-left py-3 px-2 text-[#a0a0b4] font-semibold">Tokens</th>
                <th className="text-left py-3 px-2 text-[#a0a0b4] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-[#D9BA84]/5 hover:bg-[#D9BA84]/5">
                  <td className="py-3 px-2">
                    <div className="font-medium text-sm">{user.first_name} {user.last_name}</div>
                    <div className="text-xs text-[#a0a0b4]">{user.membership_id || "No ID"}</div>
                    <div className="text-xs text-[#a0a0b4] md:hidden mt-1">{user.email}</div>
                  </td>
                  <td className="py-3 px-2 text-[#a0a0b4] hidden md:table-cell">{user.email}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.role === "admin" 
                      ? "bg-[#D9BA84]/20 text-[#D9BA84]" 
                      : "bg-[#a0a0b4]/20 text-[#a0a0b4]"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-2 hidden lg:table-cell">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.membership_status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-[#a0a0b4]/20 text-[#a0a0b4]"
                  }`}>
                    {user.membership_status || "inactive"}
                  </span>
                </td>
                <td className="py-3 px-2">
                  {editingTokens?.userId === user.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editingTokens.amount}
                        onChange={(e) =>
                          setEditingTokens({ userId: user.id, amount: parseInt(e.target.value) || 0 })
                        }
                        className="w-20 px-2 py-1 bg-[#000000] border border-[#D9BA84]/20 rounded text-xs"
                      />
                      <button
                        onClick={() => updateTokens(user.id, editingTokens.amount)}
                        className="text-xs text-[#D9BA84] hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTokens(null)}
                        className="text-xs text-[#a0a0b4] hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Coins size={14} className="text-[#D9BA84]" />
                      <span className="font-medium">{user.tokens || 0}</span>
                    </div>
                  )}
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {editingTokens?.userId !== user.id && (
                      <>
                        <button
                          onClick={() => setEditingTokens({ userId: user.id, amount: user.tokens || 0 })}
                          className="text-xs px-2 py-1 bg-[#D9BA84]/10 border border-[#D9BA84]/20 rounded hover:bg-[#D9BA84]/20 whitespace-nowrap"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => resetTokens(user.id)}
                          className="text-xs px-2 py-1 bg-red-500/10 border border-red-500/20 rounded hover:bg-red-500/20 text-red-400 whitespace-nowrap"
                        >
                          Reset
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-[#a0a0b4]">
            No users found matching your criteria.
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-[#a0a0b4]">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
}
