"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DirectMessageRow {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  sender?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    role: string | null;
  };
  recipient?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    role: string | null;
  };
}

export interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerEmail: string;
  partnerRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

/**
 * Hook for one-to-one direct messaging between a user and a specific partner
 */
export function useDirectMessages(userId: string | undefined, partnerId: string | undefined) {
  const [messages, setMessages] = useState<DirectMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const optimisticIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!userId || !partnerId) {
      setLoading(false);
      return;
    }

    // Initial fetch - get all messages between these two users
    supabase
      .from("messages")
      .select("id, sender_id, recipient_id, content, created_at")
      .or(`and(sender_id.eq.${userId},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${userId})`)
      .order("created_at", { ascending: true })
      .then(async ({ data: msgs, error }) => {
        if (error || !msgs) {
          console.error("Error fetching messages:", error);
          setLoading(false);
          return;
        }

        // Fetch profiles for both users
        const { data: profiles } = await supabase
          .from("user_profiles")
          .select("id, first_name, last_name, email, role")
          .in("id", [userId, partnerId]);

        const profileMap = Object.fromEntries(
          (profiles ?? []).map((p) => [p.id, p])
        );

        setMessages(
          msgs.map((m) => ({
            ...m,
            sender: profileMap[m.sender_id],
            recipient: profileMap[m.recipient_id],
          }))
        );
        setLoading(false);
      });

    // Realtime: listen for new messages in this conversation
    const channel = supabase
      .channel(`messages:${userId}:${partnerId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `or(and(sender_id.eq.${userId},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${userId}))`,
        },
        async (payload) => {
          const raw = payload.new as DirectMessageRow;

          // If it's our own message, replace optimistic version
          if (raw.sender_id === userId) {
            const tempIds = [...optimisticIds.current];
            if (tempIds.length > 0) {
              const tempId = tempIds[0];
              optimisticIds.current.delete(tempId);
              setMessages((prev) =>
                prev.map((m) => (m.id === tempId ? { ...raw, sender: m.sender, recipient: m.recipient } : m))
              );
              return;
            }
          }

          // Fetch sender profile if needed
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("id, first_name, last_name, email, role")
            .eq("id", raw.sender_id)
            .maybeSingle();

          setMessages((prev) => [...prev, { ...raw, sender: profile ?? undefined }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, partnerId]);

  const sendMessage = async (content: string) => {
    if (!userId || !partnerId || !content.trim()) return;
    setSending(true);
    setError(null);

    // Fetch own profile for optimistic display
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("id, first_name, last_name, email, role")
      .eq("id", userId)
      .maybeSingle();

    const optimistic: DirectMessageRow = {
      id: crypto.randomUUID(),
      sender_id: userId,
      recipient_id: partnerId,
      content: content.trim(),
      created_at: new Date().toISOString(),
      sender: profile ?? undefined,
    };

    optimisticIds.current.add(optimistic.id);
    setMessages((prev) => [...prev, optimistic]);

    const { error: insertError } = await supabase.from("messages").insert({
      sender_id: userId,
      recipient_id: partnerId,
      content: content.trim(),
    });

    if (insertError) {
      console.error("Error sending message:", insertError);
      setError("Failed to send message.");
      optimisticIds.current.delete(optimistic.id);
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    }

    setSending(false);
  };

  return { messages, loading, sending, error, sendMessage };
}

/**
 * Hook to get list of conversations for the current user
 * For community users: conversations with admins
 * For admins: conversations with all users they've messaged
 */
export function useConversations(userId: string | undefined, userRole: string | undefined) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !userRole) {
      setLoading(false);
      return;
    }

    async function fetchConversations() {
      // Get all DIRECT messages where user is sender or recipient (exclude community messages)
      const { data: msgs, error } = await supabase
        .from("messages")
        .select("id, sender_id, recipient_id, content, created_at")
        .not("recipient_id", "is", null) // Only direct messages, not community messages
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (error || !msgs) {
        console.error("Error fetching conversations:", error);
        setLoading(false);
        return;
      }

      // Group messages by conversation partner
      const conversationMap = new Map<string, DirectMessageRow[]>();
      
      for (const msg of msgs) {
        const partnerId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
        // Skip if partnerId is null (shouldn't happen with the filter above, but safety check)
        if (!partnerId) continue;
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, []);
        }
        conversationMap.get(partnerId)!.push(msg);
      }

      // Fetch profiles for all conversation partners
      const partnerIds = Array.from(conversationMap.keys());
      if (partnerIds.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("id, first_name, last_name, email, role")
        .in("id", partnerIds);

      const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));

      // Build conversation list
      const convos: Conversation[] = Array.from(conversationMap.entries()).map(([partnerId, messages]) => {
        const partner = profileMap[partnerId];
        const lastMsg = messages[0]; // Already sorted by created_at desc
        const partnerName = partner
          ? [partner.first_name, partner.last_name].filter(Boolean).join(" ").trim() || partner.email || "User"
          : "Unknown User";

        return {
          partnerId,
          partnerName,
          partnerEmail: partner?.email || "",
          partnerRole: partner?.role || "",
          lastMessage: lastMsg.content,
          lastMessageTime: lastMsg.created_at,
          unreadCount: 0, // TODO: implement read/unread tracking
        };
      });

      // Sort by last message time
      convos.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

      setConversations(convos);
      setLoading(false);
    }

    fetchConversations();

    // Set up realtime listener for new DIRECT messages only
    const channel = supabase
      .channel(`conversations:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          // Only refetch if this is a direct message (not community chat)
          const newMsg = payload.new as { recipient_id: string | null };
          if (newMsg.recipient_id !== null) {
            fetchConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, userRole]);

  return { conversations, loading };
}

/**
 * Hook to get list of available admins for community users to message
 */
export function useAdminList() {
  const [admins, setAdmins] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdmins() {
      const { data: profiles, error } = await supabase
        .from("user_profiles")
        .select("id, first_name, last_name, email")
        .eq("role", "admin");

      if (error || !profiles) {
        console.error("Error fetching admins:", error);
        setLoading(false);
        return;
      }

      setAdmins(
        profiles.map((p) => ({
          id: p.id,
          name: [p.first_name, p.last_name].filter(Boolean).join(" ").trim() || p.email || "Admin",
          email: p.email || "",
        }))
      );
      setLoading(false);
    }

    fetchAdmins();
  }, []);

  return { admins, loading };
}

/**
 * Hook to get list of all users (for messaging any member)
 */
export function useUserList(currentUserId: string | undefined) {
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string; role: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      const { data: profiles, error } = await supabase
        .from("user_profiles")
        .select("id, first_name, last_name, email, role")
        .neq("id", currentUserId); // Exclude current user

      if (error) {
        console.error("Error fetching users:", error);
      }

      setUsers(
        (profiles ?? []).map((p) => ({
          id: p.id,
          name: [p.first_name, p.last_name].filter(Boolean).join(" ").trim() || p.email || "User",
          email: p.email || "",
          role: p.role || "community",
        }))
      );
      setLoading(false);
    }

    fetchUsers();
  }, [currentUserId]);

  return { users, loading };
}

// Helper functions
export function getDisplayName(user: DirectMessageRow["sender"]): string {
  if (!user) return "Unknown";
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  return fullName || user.email || "User";
}

export function getInitials(user: DirectMessageRow["sender"]): string {
  if (!user) return "?";
  const f = user.first_name?.[0]?.toUpperCase() ?? "";
  const l = user.last_name?.[0]?.toUpperCase() ?? "";
  if (f || l) return f + l;
  return (user.email ?? "?").slice(0, 2).toUpperCase();
}
