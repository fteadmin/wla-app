"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MessageRow {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  };
}

export function useMessages(userId: string | undefined) {
  const [messages, setMessages]   = useState<MessageRow[]>([]);
  const [loading, setLoading]     = useState(true);
  const [sending, setSending]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  // track IDs we inserted ourselves to avoid duplicate optimistic entries
  const optimisticIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) return;

    // Initial fetch — last 50 community messages (recipient_id IS NULL), then batch-load sender profiles
    supabase
      .from("messages")
      .select("id, sender_id, content, created_at")
      .is("recipient_id", null) // Only fetch community messages
      .order("created_at", { ascending: true })
      .limit(50)
      .then(async ({ data: msgs, error }) => {
        if (error || !msgs) { setLoading(false); return; }

        const senderIds = [...new Set(msgs.map((m) => m.sender_id))];
        const { data: profiles } = await supabase
          .from("user_profiles")
          .select("id, first_name, last_name, email")
          .in("id", senderIds);

        const profileMap = Object.fromEntries(
          (profiles ?? []).map((p) => [p.id, p])
        );

        setMessages(
          msgs.map((m) => ({ ...m, sender: profileMap[m.sender_id] ?? undefined }))
        );
        setLoading(false);
      });

    // Realtime: incoming community messages (recipient_id IS NULL)
    const channel = supabase
      .channel("messages:community")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: "recipient_id=is.null" },
        async (payload) => {
          const raw = payload.new as MessageRow;

          // Own message: replace the optimistic placeholder with the real DB row
          if (raw.sender_id === userId) {
            const tempIds = [...optimisticIds.current];
            if (tempIds.length > 0) {
              const tempId = tempIds[0];
              optimisticIds.current.delete(tempId);
              setMessages((prev) =>
                prev.map((m) => m.id === tempId ? { ...raw, sender: m.sender } : m)
              );
              return;
            }
          }

          // Someone else's message — fetch their profile
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("first_name, last_name, email")
            .eq("id", raw.sender_id)
            .maybeSingle();

          setMessages((prev) => [...prev, { ...raw, sender: profile ?? undefined }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const sendMessage = async (content: string) => {
    if (!userId || !content.trim()) return;
    setSending(true);
    setError(null);

    // Fetch own profile for the optimistic message display
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("first_name, last_name, email")
      .eq("id", userId)
      .maybeSingle();

    const optimistic: MessageRow = {
      id: crypto.randomUUID(),
      sender_id: userId,
      content: content.trim(),
      created_at: new Date().toISOString(),
      sender: profile ?? undefined,
    };

    optimisticIds.current.add(optimistic.id);
    setMessages((prev) => [...prev, optimistic]);

    const { error: insertError } = await supabase
      .from("messages")
      .insert({ sender_id: userId, content: content.trim(), recipient_id: null }); // Community message has no recipient

    if (insertError) {
      setError("Failed to send message.");
      // Roll back optimistic message
      optimisticIds.current.delete(optimistic.id);
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    }

    setSending(false);
  };

  return { messages, loading, sending, error, sendMessage };
}

export function senderName(msg: MessageRow, currentUserId: string): string {
  if (msg.sender_id === currentUserId) return "You";
  const { first_name, last_name, email } = msg.sender ?? {};
  const full = [first_name, last_name].filter(Boolean).join(" ").trim();
  return full || email || "Member";
}

export function senderInitials(msg: MessageRow): string {
  const { first_name, last_name, email } = msg.sender ?? {};
  const f = first_name?.[0]?.toUpperCase() ?? "";
  const l = last_name?.[0]?.toUpperCase() ?? "";
  if (f || l) return f + l;
  return (email ?? "?").slice(0, 2).toUpperCase();
}
