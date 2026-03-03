"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Calendar, Users, CheckCircle } from "lucide-react";

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

export default function ContestsBasic() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedContests, setJoinedContests] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchContests();
    fetchJoinedContests();
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

  async function fetchJoinedContests() {
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const { data, error } = await supabase
        .from("contest_participants")
        .select("contest_id")
        .eq("user_id", auth.user.id);

      if (error) throw error;
      
      const joined = new Set(data?.map(p => p.contest_id) || []);
      setJoinedContests(joined);
    } catch (error) {
      console.error("Error fetching joined contests:", error);
    }
  }

  async function joinContest(contestId: string) {
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("contest_participants").insert({
        contest_id: contestId,
        user_id: auth.user.id,
      });

      if (error) throw error;

      setJoinedContests(prev => new Set([...prev, contestId]));
      await fetchContests();
    } catch (error) {
      console.error("Error joining contest:", error);
      alert("Failed to join contest");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-1">Community Contests</h2>
        <p className="text-sm text-[#a0a0b4]">Join contests and compete for amazing prizes!</p>
      </div>

      {/* Contests Grid */}
      {loading ? (
        <div className="text-center py-12 text-[#a0a0b4]">Loading contests...</div>
      ) : contests.length === 0 ? (
        <div className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-12 text-center">
          <Trophy size={48} className="mx-auto mb-4 text-[#a0a0b4]" />
          <h3 className="text-xl font-bold mb-2">No Active Contests</h3>
          <p className="text-[#a0a0b4]">Check back soon for new exciting contests!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contests.map((contest) => {
            const isJoined = joinedContests.has(contest.id);
            const hasEnded = new Date(contest.end_date) < new Date();

            return (
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
                      <div className="text-xs text-[#D9BA84]">
                        Prize: {contest.prize}
                      </div>
                    </div>
                  </div>
                  {isJoined && (
                    <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs font-semibold text-green-400 flex items-center gap-1">
                      <CheckCircle size={12} />
                      Joined
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#a0a0b4] mb-4">{contest.description}</p>

                <div className="flex items-center gap-4 text-xs text-[#a0a0b4] pb-4 border-b border-[#D9BA84]/10">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {hasEnded ? "Ended" : "Ends"}: {new Date(contest.end_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    {contest.participants || 0} participants
                  </div>
                </div>

                <button
                  onClick={() => joinContest(contest.id)}
                  disabled={isJoined || hasEnded}
                  className={`w-full mt-4 px-4 py-3 rounded-lg font-semibold transition ${
                    isJoined
                      ? "bg-green-500/10 border border-green-500/20 text-green-400 cursor-not-allowed"
                      : hasEnded
                      ? "bg-[#a0a0b4]/10 border border-[#a0a0b4]/20 text-[#a0a0b4] cursor-not-allowed"
                      : "bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black hover:opacity-90"
                  }`}
                >
                  {isJoined ? "Already Joined" : hasEnded ? "Contest Ended" : "Join Contest"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
