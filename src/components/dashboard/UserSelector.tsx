"use client";
import { MessageSquare, UserCircle, ChevronRight } from "lucide-react";
import { useUserList } from "@/hooks/useDirectMessages";

interface UserSelectorProps {
  currentUserId: string;
  onSelectUser: (userId: string, userName: string) => void;
}

export default function UserSelector({ currentUserId, onSelectUser }: UserSelectorProps) {
  const { users, loading } = useUserList(currentUserId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-[#a0a0b4] text-[13px]">
        Loading members…
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
        <div className="w-14 h-14 rounded-2xl bg-[#D9BA84]/8 border border-[#D9BA84]/15 flex items-center justify-center text-[#D9BA84]">
          <UserCircle size={22} />
        </div>
        <div>
          <p className="text-[13px] text-white font-semibold mb-1">No members available</p>
          <p className="text-[12px] text-[#a0a0b4]">Please try again later</p>
        </div>
      </div>
    );
  }

  // Sort users: admins first, then community members
  const sortedUsers = [...users].sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#D9BA84]/10 flex-shrink-0">
        <div className="w-9 h-9 rounded-[10px] bg-[#D9BA84]/10 border border-[#D9BA84]/20 flex items-center justify-center text-[#D9BA84]">
          <MessageSquare size={16} />
        </div>
        <div className="flex-1">
          <h1 className="text-[15px] font-bold text-white font-sora">New Message</h1>
          <p className="text-[11px] text-[#a0a0b4]">Select a member to message</p>
        </div>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#D9BA84]/10 scrollbar-track-transparent">
        {sortedUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id, user.name)}
            className="w-full px-6 py-4 flex items-center gap-3 hover:bg-[#D9BA84]/5 transition-colors border-b border-white/5 text-left group"
          >
            {/* Avatar */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[14px] font-bold flex-shrink-0 ${
              user.role === "admin"
                ? "bg-[#D9BA84]/15 border-2 border-[#D9BA84]/30 text-[#D9BA84]"
                : "bg-white/5 border border-white/10 text-[#a0a0b4]"
            }`}>
              {user.name.slice(0, 2).toUpperCase()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-semibold text-white mb-0.5">{user.name}</h3>
              <p className="text-[11px] text-[#a0a0b4] truncate">{user.email}</p>
              <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium ${
                user.role === "admin"
                  ? "bg-[#D9BA84]/10 border border-[#D9BA84]/20 text-[#D9BA84]"
                  : "bg-white/5 border border-white/10 text-[#a0a0b4]"
              }`}>
                {user.role === "admin" ? "Admin" : "Member"}
              </span>
            </div>

            {/* Arrow */}
            <ChevronRight size={18} className="text-[#a0a0b4] group-hover:text-[#D9BA84] transition-colors flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
