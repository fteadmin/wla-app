"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trophy, Calendar, Users, X, Eye, CheckCircle, XCircle, Award, Image as ImageIcon, Video as VideoIcon, Medal } from "lucide-react";

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

interface Submission {
  id: string;
  title: string;
  description: string;
  media_url: string;
  media_type: 'image' | 'video';
  status: 'pending' | 'approved' | 'rejected';
  winner: boolean;
  placement: 1 | 2 | 3 | null;
  created_at: string;
  user_id: string;
  user_profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export default function ContestsAdmin() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
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

  async function fetchSubmissions(contestId: string) {
    try {
      const { data: subData, error } = await supabase
        .from("contest_submissions")
        .select("id, title, description, media_url, media_type, status, winner, placement, created_at, user_id")
        .eq("contest_id", contestId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!subData || subData.length === 0) {
        setSubmissions([]);
        return;
      }

      // Fetch user profiles separately — user_id FK points to auth.users not user_profiles
      const userIds = subData.map((s) => s.user_id);
      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("id, first_name, last_name, email")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      const merged = subData.map((s) => ({
        ...s,
        user_profiles: profileMap.get(s.user_id) || undefined,
      }));

      setSubmissions(merged);
    } catch (error) {
      console.error("Error fetching submissions:", error);
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

  async function viewSubmissions(contest: Contest) {
    setSelectedContest(contest);
    setShowSubmissionsModal(true);
    await fetchSubmissions(contest.id);
  }

  async function updateSubmissionStatus(submissionId: string, status: 'approved' | 'rejected') {
    try {
      const { error } = await supabase
        .from("contest_submissions")
        .update({ status })
        .eq("id", submissionId);

      if (error) throw error;

      if (selectedContest) {
        await fetchSubmissions(selectedContest.id);
      }
    } catch (error) {
      console.error("Error updating submission:", error);
      alert("Failed to update submission");
    }
  }

  async function markPlacement(submissionId: string, placement: 1 | 2 | 3 | null) {
    try {
      if (!selectedContest) return;

      // Remove this placement from any other submission
      if (placement !== null) {
        await supabase
          .from("contest_submissions")
          .update({ placement: null, winner: false })
          .eq("contest_id", selectedContest.id)
          .eq("placement", placement);
      }

      const { error } = await supabase
        .from("contest_submissions")
        .update({
          placement,
          winner: placement === 1,
          status: placement !== null ? 'approved' : 'approved',
        })
        .eq("id", submissionId);

      if (error) throw error;
      await fetchSubmissions(selectedContest.id);
    } catch (error) {
      console.error("Error setting placement:", error);
      alert("Failed to set placement");
    }
  }

  function getStatusBadge(status: string) {
    const styles = {
      pending: "bg-yellow-400/20 border-yellow-400/30 text-yellow-400",
      approved: "bg-green-400/20 border-green-400/30 text-green-400",
      rejected: "bg-red-400/20 border-red-400/30 text-red-400"
    };
    return styles[status as keyof typeof styles] || styles.pending;
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

              <div className="flex items-center gap-4 text-xs text-[#a0a0b4] pb-4 border-b border-[#D9BA84]/10">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  Ends: {new Date(contest.end_date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  {contest.participants || 0} participants
                </div>
              </div>

              <button
                onClick={() => viewSubmissions(contest)}
                className="w-full mt-4 px-4 py-2 bg-[#D9BA84]/10 border border-[#D9BA84]/30 rounded-lg text-[#D9BA84] font-semibold hover:bg-[#D9BA84]/20 transition flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                View Submissions
              </button>
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

      {/* Submissions Modal */}
      {showSubmissionsModal && selectedContest && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#0d0d0d] border border-[#D9BA84]/20 rounded-2xl p-6 max-w-6xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">{selectedContest.title} - Submissions</h3>
                <p className="text-sm text-[#a0a0b4] mt-1">{submissions.length} total submissions</p>
              </div>
              <button
                onClick={() => setShowSubmissionsModal(false)}
                className="text-[#a0a0b4] hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-12 text-[#a0a0b4]">
                <Trophy size={48} className="mx-auto mb-4 opacity-50" />
                <p>No submissions yet for this contest</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-2">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="bg-black border border-[#D9BA84]/13 rounded-xl overflow-hidden"
                  >
                    {/* Media Preview */}
                    <div className="relative aspect-video bg-[#1a1a1a] flex items-center justify-center">
                      {submission.media_type === 'image' ? (
                        <img 
                          src={submission.media_url} 
                          alt={submission.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video 
                          src={submission.media_url}
                          controls
                          className="w-full h-full object-cover"
                        />
                      )}
                      {submission.placement && (
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold ${
                          submission.placement === 1 ? "bg-[#D9BA84] text-black" :
                          submission.placement === 2 ? "bg-gray-300 text-black" :
                          "bg-amber-700 text-white"
                        }`}>
                          <Trophy size={10} />
                          {submission.placement === 1 ? "1st" : submission.placement === 2 ? "2nd" : "3rd"}
                        </div>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          {submission.media_type === 'image' ? (
                            <ImageIcon size={14} className="text-[#D9BA84] flex-shrink-0" />
                          ) : (
                            <VideoIcon size={14} className="text-[#D9BA84] flex-shrink-0" />
                          )}
                          <h4 className="font-bold text-sm line-clamp-1">{submission.title}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(submission.status)} flex-shrink-0 ml-2`}>
                          {submission.status}
                        </span>
                      </div>
                      
                      {submission.description && (
                        <p className="text-xs text-[#a0a0b4] mb-2 line-clamp-2">{submission.description}</p>
                      )}

                      <div className="text-[10px] text-[#a0a0b4] mb-3">
                        Submitted by: {submission.user_profiles?.first_name} {submission.user_profiles?.last_name}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {submission.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateSubmissionStatus(submission.id, 'approved')}
                              className="flex-1 px-2 py-1.5 bg-green-400/10 border border-green-400/30 rounded text-green-400 text-xs font-semibold hover:bg-green-400/20 transition flex items-center justify-center gap-1"
                            >
                              <CheckCircle size={12} />
                              Approve
                            </button>
                            <button
                              onClick={() => updateSubmissionStatus(submission.id, 'rejected')}
                              className="flex-1 px-2 py-1.5 bg-red-400/10 border border-red-400/30 rounded text-red-400 text-xs font-semibold hover:bg-red-400/20 transition flex items-center justify-center gap-1"
                            >
                              <XCircle size={12} />
                              Reject
                            </button>
                          </>
                        )}
                        {submission.status === 'approved' && (
                          <div className="w-full space-y-1.5">
                            <p className="text-[10px] text-[#a0a0b4] font-semibold uppercase tracking-wider">Set Placement</p>
                            <div className="flex gap-1.5">
                              {([1, 2, 3] as const).map((place) => (
                                <button
                                  key={place}
                                  onClick={() => markPlacement(submission.id, submission.placement === place ? null : place)}
                                  className={`flex-1 py-1.5 rounded text-xs font-bold border transition flex items-center justify-center gap-1 ${
                                    submission.placement === place
                                      ? place === 1 ? "bg-[#D9BA84] text-black border-[#D9BA84]"
                                        : place === 2 ? "bg-gray-300 text-black border-gray-300"
                                        : "bg-amber-700 text-white border-amber-700"
                                      : "bg-white/5 border-white/10 text-[#a0a0b4] hover:border-[#D9BA84]/40"
                                  }`}
                                >
                                  <Medal size={10} />
                                  {place === 1 ? "1st" : place === 2 ? "2nd" : "3rd"}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {submission.status === 'rejected' && (
                          <button
                            onClick={() => updateSubmissionStatus(submission.id, 'approved')}
                            className="w-full px-2 py-1.5 bg-green-400/10 border border-green-400/30 rounded text-green-400 text-xs font-semibold hover:bg-green-400/20 transition"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

