"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Calendar, Users, CheckCircle, Upload, X, Image as ImageIcon, Video as VideoIcon, Medal } from "lucide-react";

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
  status: string;
  winner: boolean;
  placement: 1 | 2 | 3 | null;
}

export default function ContestsBasic() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedContests, setJoinedContests] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [submissions, setSubmissions] = useState<Record<string, Submission[]>>({});
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media_type: "image" as "image" | "video",
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  useEffect(() => {
    fetchContests();
    fetchJoinedContests();
    fetchMySubmissions();
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

  async function fetchMySubmissions() {
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const { data, error } = await supabase
        .from("contest_submissions")
        .select("id, title, description, media_url, media_type, status, winner, placement, contest_id")
        .eq("user_id", auth.user.id);

      if (error) throw error;
      
      // Group submissions by contest_id
      const grouped: Record<string, Submission[]> = {};
      data?.forEach((submission: Submission & { contest_id: string }) => {
        if (!grouped[submission.contest_id]) {
          grouped[submission.contest_id] = [];
        }
        grouped[submission.contest_id].push(submission);
      });
      setSubmissions(grouped);
    } catch (error) {
      console.error("Error fetching submissions:", error);
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

  function openUploadModal(contest: Contest) {
    setSelectedContest(contest);
    setShowUploadModal(true);
    setFormData({ title: "", description: "", media_type: "image" });
    setMediaFile(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedContest || !mediaFile) return;

    setUploading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not authenticated");

      // Upload file to Supabase Storage
      const fileExt = mediaFile.name.split('.').pop();
      const fileName = `${auth.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `contest-submissions/${selectedContest.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('contest-media')
        .upload(filePath, mediaFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('contest-media')
        .getPublicUrl(filePath);

      // Create submission record
      const { error: insertError } = await supabase
        .from("contest_submissions")
        .insert({
          contest_id: selectedContest.id,
          user_id: auth.user.id,
          title: formData.title,
          description: formData.description,
          media_url: publicUrl,
          media_type: formData.media_type,
        });

      if (insertError) throw insertError;

      alert("Submission uploaded successfully!");
      setShowUploadModal(false);
      await fetchMySubmissions();
    } catch (error) {
      console.error("Error uploading submission:", error);
      alert("Failed to upload submission. Please try again.");
    } finally {
      setUploading(false);
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
            const mySubmissions = submissions[contest.id] || [];

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

                {/* Show user's submissions */}
                {mySubmissions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold text-[#D9BA84]">Your Submissions ({mySubmissions.length})</p>
                    {mySubmissions.map((sub) => {
                      const placementLabel = sub.placement === 1 ? "🥇 1st Place"
                        : sub.placement === 2 ? "🥈 2nd Place"
                        : sub.placement === 3 ? "🥉 3rd Place"
                        : null;
                      const placementStyle = sub.placement === 1
                        ? "bg-[#D9BA84]/20 border-[#D9BA84]/40 text-[#D9BA84]"
                        : sub.placement === 2
                        ? "bg-gray-300/10 border-gray-300/30 text-gray-300"
                        : "bg-amber-700/20 border-amber-700/40 text-amber-500";

                      return (
                        <div key={sub.id} className="flex items-center gap-3 bg-black rounded-xl border border-white/8 p-2">
                          {/* Thumbnail */}
                          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#1a1a1a]">
                            {sub.media_type === 'image' ? (
                              <img src={sub.media_url} alt={sub.title} className="w-full h-full object-cover" />
                            ) : (
                              <video src={sub.media_url} className="w-full h-full object-cover" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">{sub.title}</p>

                            {/* Placement badge */}
                            {placementLabel ? (
                              <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${placementStyle}`}>
                                <Medal size={9} /> {placementLabel}
                              </span>
                            ) : sub.status === 'approved' ? (
                              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 border border-green-500/40 text-green-400">
                                ✓ Approved — In the running!
                              </span>
                            ) : sub.status === 'rejected' ? (
                              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-400/20 border border-red-400/30 text-red-400">
                                ✕ Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-400/20 border border-yellow-400/30 text-yellow-400">
                                ⏳ Pending Review
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Winner banner */}
                    {mySubmissions.some(s => s.placement !== null) && (
                      <div className="p-3 bg-[#D9BA84]/10 border border-[#D9BA84]/30 rounded-xl flex items-center gap-2">
                        <Trophy size={16} className="text-[#D9BA84] flex-shrink-0" />
                        <p className="text-sm text-[#D9BA84] font-bold">
                          {mySubmissions.find(s => s.placement === 1) ? "🥇 Congratulations! You placed 1st!" :
                           mySubmissions.find(s => s.placement === 2) ? "🥈 Congratulations! You placed 2nd!" :
                           "🥉 Congratulations! You placed 3rd!"}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  {!isJoined && !hasEnded && (
                    <button
                      onClick={() => joinContest(contest.id)}
                      className="flex-1 px-4 py-3 rounded-lg font-semibold bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black hover:opacity-90 transition"
                    >
                      Join Contest
                    </button>
                  )}
                  {isJoined && !hasEnded && (
                    <button
                      onClick={() => openUploadModal(contest)}
                      className="flex-1 px-4 py-3 rounded-lg font-semibold bg-[#D9BA84]/10 border border-[#D9BA84]/30 text-[#D9BA84] hover:bg-[#D9BA84]/20 transition flex items-center justify-center gap-2"
                    >
                      <Upload size={16} />
                      Upload Entry
                    </button>
                  )}
                  {hasEnded && (
                    <button
                      disabled
                      className="flex-1 px-4 py-3 rounded-lg font-semibold bg-[#a0a0b4]/10 border border-[#a0a0b4]/20 text-[#a0a0b4] cursor-not-allowed"
                    >
                      Contest Ended
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && selectedContest && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0d0d0d] border border-[#D9BA84]/20 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Upload Contest Entry</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-[#a0a0b4] hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-4 p-3 bg-[#D9BA84]/10 border border-[#D9BA84]/20 rounded-lg">
              <p className="text-sm text-[#D9BA84] font-semibold">{selectedContest.title}</p>
              <p className="text-xs text-[#a0a0b4] mt-1">{selectedContest.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Entry Title*</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#D9BA84]/20 rounded-lg focus:border-[#D9BA84] focus:outline-none"
                  placeholder="Give your entry a title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#D9BA84]/20 rounded-lg focus:border-[#D9BA84] focus:outline-none min-h-[80px]"
                  placeholder="Describe your submission"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Media Type*</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, media_type: "image" })}
                    className={`flex-1 px-4 py-3 rounded-lg border font-semibold flex items-center justify-center gap-2 ${
                      formData.media_type === "image"
                        ? "bg-[#D9BA84]/20 border-[#D9BA84] text-[#D9BA84]"
                        : "bg-black border-[#D9BA84]/20 text-[#a0a0b4]"
                    }`}
                  >
                    <ImageIcon size={18} />
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, media_type: "video" })}
                    className={`flex-1 px-4 py-3 rounded-lg border font-semibold flex items-center justify-center gap-2 ${
                      formData.media_type === "video"
                        ? "bg-[#D9BA84]/20 border-[#D9BA84] text-[#D9BA84]"
                        : "bg-black border-[#D9BA84]/20 text-[#a0a0b4]"
                    }`}
                  >
                    <VideoIcon size={18} />
                    Video
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Upload File*</label>
                <input
                  type="file"
                  required
                  accept={formData.media_type === "image" ? "image/*" : "video/*"}
                  onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 bg-black border border-[#D9BA84]/20 rounded-lg focus:border-[#D9BA84] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#D9BA84] file:text-black file:font-semibold file:cursor-pointer hover:file:opacity-90"
                />
                <p className="text-xs text-[#a0a0b4] mt-2">
                  {formData.media_type === "image" ? "Supported: JPG, PNG, GIF" : "Supported: MP4, MOV, AVI"}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-[#a0a0b4]/20 text-[#a0a0b4] font-semibold hover:bg-[#a0a0b4]/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !mediaFile}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Submit Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
