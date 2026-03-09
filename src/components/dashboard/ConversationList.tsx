"use client";
import { MessageSquare, ChevronRight } from "lucide-react";
import { useConversations, type Conversation } from "@/hooks/useDirectMessages";
import { timeAgo } from "@/hooks/useNotifications";

interface ConversationListProps {
  userId: string;
  userRole: string;
  onSelectConversation: (partnerId: string, partnerName: string) => void;
}

export default function ConversationList({ userId, userRole, onSelectConversation }: ConversationListProps) {
  const { conversations, loading } = useConversations(userId, userRole);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-[#a0a0b4] text-[13px]">
        Loading conversations…
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6 py-12">
        <div className="w-14 h-14 rounded-2xl bg-[#D9BA84]/8 border border-[#D9BA84]/15 flex items-center justify-center text-[#D9BA84]">
          <MessageSquare size={22} />
        </div>
        <div>
          <p className="text-[13px] text-white font-semibold mb-1">No conversations yet</p>
          <p className="text-[12px] text-[#a0a0b4]">
            Start a new conversation by clicking "New Message"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#D9BA84]/10 scrollbar-track-transparent">{conversations.map((conv) => (
          <button
            key={conv.partnerId}
            onClick={() => onSelectConversation(conv.partnerId, conv.partnerName)}
            className="w-full px-6 py-4 flex items-start gap-3 hover:bg-[#D9BA84]/5 transition-colors border-b border-white/5 text-left group"
          >
            {/* Avatar */}
            <div className="w-11 h-11 rounded-xl bg-[#D9BA84]/10 border border-[#D9BA84]/20 flex items-center justify-center text-[#D9BA84] text-[13px] font-bold flex-shrink-0">
              {conv.partnerName.slice(0, 2).toUpperCase()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <h3 className="text-[13px] font-semibold text-white truncate">{conv.partnerName}</h3>
                <span className="text-[10px] text-[#a0a0b4] flex-shrink-0">{timeAgo(conv.lastMessageTime)}</span>
              </div>
              <p className="text-[12px] text-[#a0a0b4] truncate">{conv.lastMessage}</p>
              {conv.partnerRole && (
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-[#D9BA84]/10 border border-[#D9BA84]/20 text-[10px] text-[#D9BA84] font-medium">
                  {conv.partnerRole}
                </span>
              )}
            </div>

            {/* Arrow */}
            <ChevronRight size={16} className="text-[#a0a0b4] group-hover:text-[#D9BA84] transition-colors flex-shrink-0 mt-2" />
          </button>
        ))}
      </div>
    </div>
  );
}
