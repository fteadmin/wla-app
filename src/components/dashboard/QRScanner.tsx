"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Hash, X, CheckCircle, XCircle, User, Mail, Shield, Coins, Calendar } from "lucide-react";

interface UserDetails {
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

export default function QRScanner() {
  const [mode, setMode] = useState<"scan" | "manual" | null>(null);
  const [manualId, setManualId] = useState("");
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  async function startCamera() {
    try {
      setScanning(true);
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check permissions.");
      setScanning(false);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  }

  async function lookupUser(membershipId: string) {
    setLoading(true);
    setError(null);
    setUserDetails(null);

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("membership_id", membershipId)
        .single();

      if (error || !data) {
        setError("User not found. Please check the membership ID.");
        return;
      }

      setUserDetails(data);
    } catch (err) {
      console.error("Error looking up user:", err);
      setError("An error occurred while looking up the user.");
    } finally {
      setLoading(false);
    }
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualId.trim()) {
      setError("Please enter a membership ID.");
      return;
    }
    lookupUser(manualId.trim());
  }

  function reset() {
    setMode(null);
    setManualId("");
    setUserDetails(null);
    setError(null);
    stopCamera();
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Camera size={20} className="text-[#D9BA84]" />
          <h2 className="text-xl font-bold">Member Check-In</h2>
        </div>
        {mode && (
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-[#a0a0b4]/10 border border-[#a0a0b4]/20 rounded-lg text-sm hover:bg-[#a0a0b4]/20 transition"
          >
            <X size={14} />
            Reset
          </button>
        )}
      </div>

      {!mode && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setMode("scan");
              startCamera();
            }}
            className="flex flex-col items-center gap-3 p-6 bg-[#D9BA84]/10 border border-[#D9BA84]/20 rounded-xl hover:bg-[#D9BA84]/20 transition"
          >
            <div className="w-12 h-12 rounded-xl bg-[#D9BA84]/20 flex items-center justify-center">
              <Camera size={24} className="text-[#D9BA84]" />
            </div>
            <div className="text-center">
              <div className="font-semibold mb-1">Scan QR Code</div>
              <div className="text-xs text-[#a0a0b4]">Use camera to scan member QR</div>
            </div>
          </button>

          <button
            onClick={() => setMode("manual")}
            className="flex flex-col items-center gap-3 p-6 bg-[#D9BA84]/10 border border-[#D9BA84]/20 rounded-xl hover:bg-[#D9BA84]/20 transition"
          >
            <div className="w-12 h-12 rounded-xl bg-[#D9BA84]/20 flex items-center justify-center">
              <Hash size={24} className="text-[#D9BA84]" />
            </div>
            <div className="text-center">
              <div className="font-semibold mb-1">Manual Entry</div>
              <div className="text-xs text-[#a0a0b4]">Enter membership ID manually</div>
            </div>
          </button>
        </div>
      )}

      {mode === "scan" && (
        <div className="space-y-4">
          {scanning && (
            <div className="relative bg-[#000000] rounded-xl overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-[#D9BA84]/50 rounded-xl pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-[#D9BA84] rounded-lg" />
              </div>
            </div>
          )}
          
          <div className="text-center text-sm text-[#a0a0b4]">
            Position the QR code within the frame to scan
          </div>

          <div className="p-4 bg-[#D9BA84]/5 border border-[#D9BA84]/10 rounded-lg">
            <div className="text-xs text-[#a0a0b4]">
              <strong>Note:</strong> QR scanning requires a compatible device with camera access. 
              Alternatively, you can use manual entry to look up members.
            </div>
          </div>

          {scanning && (
            <button
              onClick={stopCamera}
              className="w-full px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-sm hover:bg-red-500/20 transition text-red-400"
            >
              Stop Camera
            </button>
          )}
        </div>
      )}

      {mode === "manual" && !userDetails && (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Membership ID</label>
            <input
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder="Enter membership ID (e.g., WLA-12345)"
              className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
              <XCircle size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Looking up..." : "Look Up Member"}
          </button>
        </form>
      )}

      {userDetails && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <CheckCircle size={20} className="text-green-400" />
            <span className="text-green-400 font-semibold">Member Found!</span>
          </div>

          <div className="bg-[#000000] border border-[#D9BA84]/20 rounded-xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1">
                  {userDetails.first_name} {userDetails.last_name}
                </h3>
                <div className="text-sm text-[#a0a0b4]">{userDetails.membership_id}</div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                userDetails.membership_status === "active"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-[#a0a0b4]/20 text-[#a0a0b4]"
              }`}>
                {userDetails.membership_status || "inactive"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#D9BA84]/10 flex items-center justify-center">
                  <Mail size={18} className="text-[#D9BA84]" />
                </div>
                <div>
                  <div className="text-xs text-[#a0a0b4]">Email</div>
                  <div className="text-sm font-medium">{userDetails.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#D9BA84]/10 flex items-center justify-center">
                  <Shield size={18} className="text-[#D9BA84]" />
                </div>
                <div>
                  <div className="text-xs text-[#a0a0b4]">Tier</div>
                  <div className="text-sm font-medium capitalize">{userDetails.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#D9BA84]/10 flex items-center justify-center">
                  <Coins size={18} className="text-[#D9BA84]" />
                </div>
                <div>
                  <div className="text-xs text-[#a0a0b4]">Token Balance</div>
                  <div className="text-sm font-medium">{userDetails.tokens || 0} tokens</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#D9BA84]/10 flex items-center justify-center">
                  <Calendar size={18} className="text-[#D9BA84]" />
                </div>
                <div>
                  <div className="text-xs text-[#a0a0b4]">Join Date</div>
                  <div className="text-sm font-medium">{formatDate(userDetails.created_at)}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={reset}
            className="w-full px-4 py-3 bg-[#D9BA84]/10 border border-[#D9BA84]/20 rounded-lg hover:bg-[#D9BA84]/20 transition"
          >
            Check Another Member
          </button>
        </div>
      )}
    </div>
  );
}
