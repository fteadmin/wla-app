"use client";
import { useState, useEffect } from "react";
import TopNav from "../../../src/components/dashboard/TopNav";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Image, Video, Calendar, Trophy, Medal } from "lucide-react";

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
  contest_id: string;
  contests?: {
    title: string;
  };
}

export default function MyContents() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMySubmissions();
  }, []);

  async function fetchMySubmissions() {
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const { data, error } = await supabase
        .from("contest_submissions")
        .select(`
          id, title, description, media_url, media_type, status, winner, placement, created_at, contest_id,
          contests (
            title
          )
        `)
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-black text-white flex flex-col font-sora">
      <TopNav />
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <span className="text-[#D9BA84] uppercase tracking-tighter text-sm font-bold">Media Gallery</span>
            <h1 className="text-4xl font-black mt-2">My Contents</h1>
            <p className="text-[#a0a0b4] mt-2">View all your contest submissions</p>
          </div>

          {/* Content Grid */}
          {loading ? (
            <div className="text-center py-12 text-[#a0a0b4]">Loading your submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-12 text-center">
              <Upload size={48} className="mx-auto mb-4 text-[#a0a0b4]" />
              <h3 className="text-xl font-bold mb-2">No Submissions Yet</h3>
              <p className="text-[#a0a0b4] mb-6">Go to the Contests page to submit your first entry!</p>
              <a 
                href="/dashboard/contests"
                className="inline-block px-6 py-3 bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black font-semibold rounded-lg hover:opacity-90 transition"
              >
                Browse Contests
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl overflow-hidden hover:border-[#D9BA84]/25 transition"
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
                        <Medal size={11} />
                        {submission.placement === 1 ? "1st Place" : submission.placement === 2 ? "2nd Place" : "3rd Place"}
                      </div>
                    )}
                  </div>

                  {/* Content Details */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {submission.media_type === 'image' ? (
                          <Image size={16} className="text-[#D9BA84]" />
                        ) : (
                          <Video size={16} className="text-[#D9BA84]" />
                        )}
                        <h3 className="font-bold text-sm">{submission.title}</h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(submission.status)}`}>
                        {submission.status}
                      </span>
                    </div>
                    
                    {submission.description && (
                      <p className="text-xs text-[#a0a0b4] mb-3 line-clamp-2">{submission.description}</p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-[#a0a0b4] pt-3 border-t border-[#D9BA84]/10">
                      <div className="flex items-center gap-1">
                        <Trophy size={12} />
                        {submission.contests?.title || "Unknown Contest"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(submission.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {submission.placement && (
                      <div className={`mt-3 p-2 rounded-lg flex items-center gap-2 border ${
                        submission.placement === 1 ? "bg-[#D9BA84]/15 border-[#D9BA84]/40" :
                        submission.placement === 2 ? "bg-gray-300/10 border-gray-300/30" :
                        "bg-amber-700/15 border-amber-700/40"
                      }`}>
                        <Medal size={14} className={
                          submission.placement === 1 ? "text-[#D9BA84]" :
                          submission.placement === 2 ? "text-gray-300" : "text-amber-600"
                        } />
                        <span className={`text-xs font-bold ${
                          submission.placement === 1 ? "text-[#D9BA84]" :
                          submission.placement === 2 ? "text-gray-300" : "text-amber-600"
                        }`}>
                          {submission.placement === 1 ? "🥇 You won 1st Place!" :
                           submission.placement === 2 ? "🥈 You placed 2nd!" :
                           "🥉 You placed 3rd!"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
