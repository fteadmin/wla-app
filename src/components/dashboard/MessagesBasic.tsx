"use client";
import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare } from "lucide-react";
import { useMessages, senderName, senderInitials } from "@/hooks/useMessages";
import { timeAgo } from "@/hooks/useNotifications";

interface MessagesBasicProps {
  userId: string;
}

export default function MessagesBasic({ userId }: MessagesBasicProps) {
  const { messages, loading, sending, error, sendMessage } = useMessages(userId);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!draft.trim() || sending) return;
    const text = draft;
    setDraft("");
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] max-h-[calc(100vh-60px)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#D9BA84]/10 flex-shrink-0">
        <div className="w-9 h-9 rounded-[10px] bg-[#D9BA84]/10 border border-[#D9BA84]/20 flex items-center justify-center text-[#D9BA84]">
          <MessageSquare size={16} />
        </div>
        <div>
          <h1 className="text-[15px] font-bold text-white font-sora">Community Chat</h1>
          <p className="text-[11px] text-[#a0a0b4]">WLA members only</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D9BA84]/7 border border-[#D9BA84]/15">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9BA84] shadow-[0_0_5px_rgba(217,186,132,0.6)] animate-pulse" />
          <span className="text-[10px] font-semibold text-[#D9BA84]">Live</span>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-1 scrollbar-thin scrollbar-thumb-[#D9BA84]/10 scrollbar-track-transparent">
        {loading ? (
          <div className="flex items-center justify-center h-full text-[#a0a0b4] text-[13px]">
            Loading messages…
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#D9BA84]/8 border border-[#D9BA84]/15 flex items-center justify-center text-[#D9BA84]">
              <MessageSquare size={22} />
            </div>
            <p className="text-[13px] text-[#a0a0b4]">No messages yet. Be the first to say something!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isOwn = msg.sender_id === userId;
            const prevMsg = messages[i - 1];
            const isSameAuthor = prevMsg?.sender_id === msg.sender_id;
            const showHeader = !isSameAuthor;

            return (
              <div key={msg.id} className={`flex gap-2.5 ${isOwn ? "flex-row-reverse" : ""} ${showHeader ? "mt-3" : "mt-0.5"}`}>
                {/* Avatar — only show for first in a group */}
                <div className={`flex-shrink-0 ${showHeader ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <div
                    className={`w-8 h-8 rounded-[8px] flex items-center justify-center text-[11px] font-bold border ${
                      isOwn
                        ? "bg-[#D9BA84]/15 border-[#D9BA84]/30 text-[#D9BA84]"
                        : "bg-white/5 border-white/10 text-[#a0a0b4]"
                    }`}
                  >
                    {senderInitials(msg)}
                  </div>
                </div>

                {/* Bubble */}
                <div className={`flex flex-col max-w-[72%] sm:max-w-[60%] ${isOwn ? "items-end" : "items-start"}`}>
                  {showHeader && (
                    <div className={`flex items-baseline gap-2 mb-1 ${isOwn ? "flex-row-reverse" : ""}`}>
                      <span className="text-[12px] font-semibold text-white">{senderName(msg, userId)}</span>
                      <span className="text-[10px] text-[#a0a0b4]">{timeAgo(msg.created_at)}</span>
                    </div>
                  )}
                  <div
                    className={`px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed break-words ${
                      isOwn
                        ? "bg-[#D9BA84]/15 border border-[#D9BA84]/25 text-white rounded-tr-sm"
                        : "bg-[#161616] border border-white/8 text-[#e0e0e0] rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {!showHeader && (
                    <span className="text-[9px] text-[#a0a0b4]/50 mt-0.5 px-1">{timeAgo(msg.created_at)}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-3 border-t border-[#D9BA84]/10">
        {error && (
          <p className="text-[11px] text-red-400 mb-2 px-1">{error}</p>
        )}
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message the community… (Enter to send, Shift+Enter for new line)"
            rows={1}
            maxLength={2000}
            className="flex-1 resize-none bg-[#111] border border-[#D9BA84]/15 rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-[#a0a0b4]/50 focus:outline-none focus:border-[#D9BA84]/40 focus:bg-[#D9BA84]/4 transition-all font-sora leading-relaxed max-h-[120px] overflow-y-auto scrollbar-none"
            style={{ minHeight: "42px" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 120) + "px";
            }}
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim() || sending}
            className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#D9BA84]/15 border border-[#D9BA84]/30 text-[#D9BA84] flex items-center justify-center hover:bg-[#D9BA84]/25 hover:border-[#D9BA84]/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send size={15} className={sending ? "animate-pulse" : ""} />
          </button>
        </div>
        <p className="text-[10px] text-[#a0a0b4]/40 mt-1.5 px-1">
          {draft.length > 0 ? `${draft.length}/2000` : "Shift+Enter for new line"}
        </p>
      </div>
    </div>
  );
}
