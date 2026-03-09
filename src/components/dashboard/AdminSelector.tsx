"use client";
import { MessageSquare, UserCircle, ChevronRight } from "lucide-react";
import { useAdminList } from "@/hooks/useDirectMessages";

interface AdminSelectorProps {
  onSelectAdmin: (adminId: string, adminName: string) => void;
}

export default function AdminSelector({ onSelectAdmin }: AdminSelectorProps) {
  const { admins, loading } = useAdminList();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-[#a0a0b4] text-[13px]">
        Loading admins…
      </div>
    );
  }

  if (admins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
        <div className="w-14 h-14 rounded-2xl bg-[#D9BA84]/8 border border-[#D9BA84]/15 flex items-center justify-center text-[#D9BA84]">
          <UserCircle size={22} />
        </div>
        <div>
          <p className="text-[13px] text-white font-semibold mb-1">No admins available</p>
          <p className="text-[12px] text-[#a0a0b4]">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#D9BA84]/10 flex-shrink-0">
        <div className="w-9 h-9 rounded-[10px] bg-[#D9BA84]/10 border border-[#D9BA84]/20 flex items-center justify-center text-[#D9BA84]">
          <MessageSquare size={16} />
        </div>
        <div>
          <h1 className="text-[15px] font-bold text-white font-sora">Message an Admin</h1>
          <p className="text-[11px] text-[#a0a0b4]">Select an admin to start messaging</p>
        </div>
      </div>

      {/* Admin list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#D9BA84]/10 scrollbar-track-transparent">
        {admins.map((admin) => (
          <button
            key={admin.id}
            onClick={() => onSelectAdmin(admin.id, admin.name)}
            className="w-full px-6 py-4 flex items-center gap-3 hover:bg-[#D9BA84]/5 transition-colors border-b border-white/5 text-left group"
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-xl bg-[#D9BA84]/10 border border-[#D9BA84]/20 flex items-center justify-center text-[#D9BA84] text-[14px] font-bold flex-shrink-0">
              {admin.name.slice(0, 2).toUpperCase()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-semibold text-white mb-0.5">{admin.name}</h3>
              <p className="text-[11px] text-[#a0a0b4]">{admin.email}</p>
              <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-[#D9BA84]/10 border border-[#D9BA84]/20 text-[10px] text-[#D9BA84] font-medium">
                Admin
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
