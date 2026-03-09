"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import TopNav from "../../../src/components/dashboard/TopNav";
import ConversationList from "../../../src/components/dashboard/ConversationList";
import DirectMessageInterface from "../../../src/components/dashboard/DirectMessageInterface";
import UserSelector from "../../../src/components/dashboard/UserSelector";
import MessagesBasic from "../../../src/components/dashboard/MessagesBasic";
import { useConversations } from "@/hooks/useDirectMessages";
import { MessageSquare, Users } from "lucide-react";

export default function MessagesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [selectedPartnerName, setSelectedPartnerName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"community" | "direct">("community");
  const [dmView, setDmView] = useState<"list" | "chat" | "user-select">("list");
  const router = useRouter();

  const { conversations: userConversations } = useConversations(userId ?? undefined, userRole ?? undefined);

  useEffect(() => {
    async function check() {
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

      const role = profile?.role;
      if (role === "community" || role === "admin") {
        setUserId(auth.user.id);
        setUserRole(role);
        setAllowed(true);
      } else {
        setAllowed(false);
      }
    }
    check();
  }, [router]);

  const handleSelectConversation = (partnerId: string, partnerName: string) => {
    setSelectedPartnerId(partnerId);
    setSelectedPartnerName(partnerName);
    setDmView("chat");
  };

  const handleSelectUser = (userId: string, userName: string) => {
    setSelectedPartnerId(userId);
    setSelectedPartnerName(userName);
    setDmView("chat");
  };

  const handleBack = () => {
    setSelectedPartnerId(null);
    setSelectedPartnerName("");
    setDmView("list");
  };

  const handleNewMessage = () => {
    setDmView("user-select");
  };

  if (allowed === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sora">
        <div className="text-[#a0a0b4]">Loading…</div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sora">
        <div className="text-[#a0a0b4] text-sm">Messaging is available to members only.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sora">
      <TopNav />
      
      {/* Tab Navigation */}
      <div className="w-full border-b border-[#D9BA84]/10 bg-black/50 backdrop-blur-sm sticky top-[60px] z-10">
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          <button
            onClick={() => setActiveTab("community")}
            className={`flex items-center gap-2 px-4 py-3 text-[13px] font-semibold transition-all relative ${
              activeTab === "community"
                ? "text-[#D9BA84]"
                : "text-[#a0a0b4] hover:text-white"
            }`}
          >
            <Users size={16} />
            <span>Community Chat</span>
            {activeTab === "community" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D9BA84]" />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("direct");
              setDmView("list");
            }}
            className={`flex items-center gap-2 px-4 py-3 text-[13px] font-semibold transition-all relative ${
              activeTab === "direct"
                ? "text-[#D9BA84]"
                : "text-[#a0a0b4] hover:text-white"
            }`}
          >
            <MessageSquare size={16} />
            <span>Direct Messages</span>
            {activeTab === "direct" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D9BA84]" />
            )}
            {userConversations.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#D9BA84]/20 text-[#D9BA84] text-[10px] font-bold">
                {userConversations.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <main className="flex-1 w-full overflow-hidden">
        {activeTab === "community" && userId && (
          <MessagesBasic userId={userId} />
        )}
        
        {activeTab === "direct" && (
          <>
            {dmView === "list" && userId && userRole && (
              <div className="flex flex-col h-[calc(100vh-120px)]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#D9BA84]/10">
                  <div>
                    <h2 className="text-[15px] font-bold text-white">Your Conversations</h2>
                    <p className="text-[11px] text-[#a0a0b4]">Private messages with members</p>
                  </div>
                  <button
                    onClick={handleNewMessage}
                    className="px-4 py-2 rounded-lg bg-[#D9BA84]/15 border border-[#D9BA84]/30 text-[#D9BA84] text-[12px] font-semibold hover:bg-[#D9BA84]/25 transition-colors"
                  >
                    + New Message
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ConversationList
                    userId={userId}
                    userRole={userRole}
                    onSelectConversation={handleSelectConversation}
                  />
                </div>
              </div>
            )}
            {dmView === "user-select" && userId && (
              <UserSelector
                currentUserId={userId}
                onSelectUser={handleSelectUser}
              />
            )}
            {dmView === "chat" && userId && selectedPartnerId && (
              <DirectMessageInterface
                userId={userId}
                partnerId={selectedPartnerId}
                partnerName={selectedPartnerName}
                onBack={handleBack}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
