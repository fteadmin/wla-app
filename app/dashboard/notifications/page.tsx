"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Award, Calendar, Coins, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { toast } from "sonner";

type FilterType = "all" | "read" | "unread";

// Types
type NotifType =
  | "new_contest"
  | "new_event"
  | "rsvp_confirmed"
  | "token_purchase"
  | "membership_activated";

interface NotifRow {
  id: string;
  user_id: string;
  type: NotifType | string;
  title: string;
  message: string | null;
  read: boolean;
  created_at: string;
}

// Helper function
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "Just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 7)  return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotifRow[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push("/login");
        return;
      }
      setUserId(auth.user.id);
    };
    getUser();
  }, [router]);

  // Fetch notifications
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setNotifications(data as NotifRow[]);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, [userId]);

  // Get filtered notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "read") return notif.read;
    if (filter === "unread") return !notif.read;
    return true;
  });

  // Mark as read/unread
  const toggleRead = async (id: string, currentRead: boolean) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: !currentRead })
      .eq("id", id);

    if (!error) {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: !currentRead } : notif
        )
      );
      toast.success(currentRead ? "Marked as unread" : "Marked as read");
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id);

    if (!error) {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      toast.success("Notification deleted");
    }
  };

  // Get icon for notification type
  const getNotificationIcon = (type: NotifType | string) => {
    switch (type) {
      case "new_contest":
      case "new_event":
        return <Award className="h-5 w-5 text-[#D9BA84]" />;
      case "event_reminder":
      case "contest_reminder":
        return <Calendar className="h-5 w-5 text-[#D9BA84]" />;
      case "token_purchase":
      case "token_earned":
        return <Coins className="h-5 w-5 text-[#D9BA84]" />;
      case "membership_activated":
      case "rsvp_confirmed":
        return <CheckCircle2 className="h-5 w-5 text-[#D9BA84]" />;
      default:
        return <Bell className="h-5 w-5 text-[#D9BA84]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-4">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-[#a0a0b4]">Stay updated with your WLA activity</p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "all"
                ? "bg-[#D9BA84] text-black"
                : "bg-[#161616] text-[#a0a0b4] border border-[#D9BA84]/20 hover:text-white"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "unread"
                ? "bg-[#D9BA84] text-black"
                : "bg-[#161616] text-[#a0a0b4] border border-[#D9BA84]/20 hover:text-white"
            }`}
          >
            Unread ({notifications.filter((n) => !n.read).length})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === "read"
                ? "bg-[#D9BA84] text-black"
                : "bg-[#161616] text-[#a0a0b4] border border-[#D9BA84]/20 hover:text-white"
            }`}
          >
            Read ({notifications.filter((n) => n.read).length})
          </button>
        </div>

        {/* Notifications list */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#D9BA84] border-r-transparent"></div>
            <p className="text-[#a0a0b4] mt-4">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="h-12 w-12 text-[#a0a0b4]/30 mx-auto mb-4" />
            <p className="text-[#a0a0b4]">
              {filter === "all"
                ? "No notifications yet"
                : filter === "unread"
                ? "No unread notifications"
                : "No read notifications"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  notif.read
                    ? "bg-[#0d0d0d] border-[#D9BA84]/10"
                    : "bg-[#D9BA84]/5 border-[#D9BA84]/30"
                }`}
              >
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold mb-1 ${
                      notif.read ? "text-[#a0a0b4]" : "text-white"
                    }`}
                  >
                    {notif.title}
                  </h3>
                  {notif.message && (
                    <p className="text-sm text-[#a0a0b4] mb-2 line-clamp-2">
                      {notif.message}
                    </p>
                  )}
                  <p className="text-xs text-[#a0a0b4]/60">
                    {timeAgo(notif.created_at)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleRead(notif.id, notif.read)}
                    className="p-2 hover:bg-[#161616] rounded-lg transition-colors text-[#a0a0b4] hover:text-[#D9BA84]"
                    title={notif.read ? "Mark as unread" : "Mark as read"}
                  >
                    {notif.read ? (
                      <Circle className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="p-2 hover:bg-[#161616] rounded-lg transition-colors text-[#a0a0b4] hover:text-red-400"
                    title="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
