"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trophy, Calendar, Users, X } from "lucide-react";

interface Contest {
  id: string;
  title: string;
  description: string;
  prize: string;
  end_date: string;
  created_by: string;
  created_at: string;
  participants?: number;
}

export default function ContestsAdmin() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prize: "",
    end_date: "",
  });

  useEffect(() => {
    fetchContests();
  }, []);

  async function fetchContests() {
    try {
      const { data, error } = await supabase
        .from("contests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContests(data || []);
    } catch (error) {
      console.error("Error fetching contests:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createContest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("contests").insert({
        title: formData.title,
        description: formData.description,
        prize: formData.prize,
        end_date: formData.end_date,
        created_by: auth.user.id,
      });

      if (error) throw error;

      setFormData({ title: "", description: "", prize: "", end_date: "" });
      setShowCreateModal(false);
      await fetchContests();
    } catch (error) {
      console.error("Error creating contest:", error);
      alert("Failed to create contest");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Contests Management</h2>
          <p className="text-sm text-[#a0a0b4]">Create and manage community contests</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black font-semibold rounded-lg hover:opacity-90 transition"
        >
          <Plus size={16} />
          Create Contest
        </button>
      </div>

      {/* Contests Grid */}
      {loading && contests.length === 0 ? (
        <div className="text-center py-12 text-[#a0a0b4]">Loading contests...</div>
      ) : contests.length === 0 ? (
        <div className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-12 text-center">
          <Trophy size={48} className="mx-auto mb-4 text-[#a0a0b4]" />
          <h3 className="text-xl font-bold mb-2">No Contests Yet</h3>
          <p className="text-[#a0a0b4] mb-6">Create your first contest to engage the community!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black font-semibold rounded-lg hover:opacity-90 transition"
          >
            Create Contest
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contests.map((contest) => (
            <div
              key={contest.id}
              className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-6 hover:border-[#D9BA84]/25 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D9BA84]/10 border border-[#D9BA84]/20 flex items-center justify-center">
                    <Trophy size={20} className="text-[#D9BA84]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{contest.title}</h3>
                    <div className="text-xs text-[#a0a0b4]">
                      Prize: {contest.prize}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#a0a0b4] mb-4 line-clamp-3">{contest.description}</p>

              <div className="flex items-center gap-4 text-xs text-[#a0a0b4] pt-4 border-t border-[#D9BA84]/10">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  Ends: {new Date(contest.end_date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  {contest.participants || 0} participants
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Contest Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0d0d0d] border border-[#D9BA84]/20 rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Create New Contest</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#a0a0b4] hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={createContest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Contest Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                  placeholder="e.g., Best Cruiser Build 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                  placeholder="Describe the contest rules and requirements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Prize</label>
                <input
                  type="text"
                  required
                  value={formData.prize}
                  onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                  className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                  placeholder="e.g., $500 Gift Card"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-[#a0a0b4]/10 border border-[#a0a0b4]/20 rounded-lg hover:bg-[#a0a0b4]/20 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Contest"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

