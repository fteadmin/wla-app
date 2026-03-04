"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, MapPin, Users, CheckCircle, Clock, XCircle, Trophy } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  end_date: string | null;
  image_url: string | null;
  capacity: number | null;
  status: "upcoming" | "ongoing" | "past" | "cancelled";
}

type RSVPStatus = "attending" | "not_attending" | "maybe";

export default function EventsBasic() {
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvps, setRsvps] = useState<Record<string, RSVPStatus>>({});
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchEvents(), fetchMyRSVPs()]);
  }, []);

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .neq("status", "cancelled")
        .order("event_date", { ascending: true });
      if (error) throw error;
      setEvents(data || []);

      // Fetch RSVP counts per event
      if (data && data.length > 0) {
        const counts: Record<string, number> = {};
        await Promise.all(
          data.map(async (ev) => {
            const { count } = await supabase
              .from("event_rsvps")
              .select("*", { count: "exact", head: true })
              .eq("event_id", ev.id)
              .eq("status", "attending");
            counts[ev.id] = count || 0;
          })
        );
        setRsvpCounts(counts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMyRSVPs() {
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      const { data, error } = await supabase
        .from("event_rsvps")
        .select("event_id, status")
        .eq("user_id", auth.user.id);
      if (error) throw error;
      const map: Record<string, RSVPStatus> = {};
      data?.forEach((r: { event_id: string; status: RSVPStatus }) => { map[r.event_id] = r.status; });
      setRsvps(map);
    } catch (e) {
      console.error(e);
    }
  }

  async function rsvp(eventId: string, status: RSVPStatus) {
    setSubmitting(eventId);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not authenticated");

      const existing = rsvps[eventId];

      if (existing) {
        if (existing === status) {
          // Remove RSVP (toggle off)
          await supabase.from("event_rsvps").delete()
            .eq("event_id", eventId).eq("user_id", auth.user.id);
          const updated = { ...rsvps };
          delete updated[eventId];
          setRsvps(updated);
          if (status === "attending") setRsvpCounts(c => ({ ...c, [eventId]: (c[eventId] || 1) - 1 }));
        } else {
          // Update RSVP
          await supabase.from("event_rsvps").update({ status })
            .eq("event_id", eventId).eq("user_id", auth.user.id);
          const prevStatus = rsvps[eventId];
          setRsvps(r => ({ ...r, [eventId]: status }));
          setRsvpCounts(c => ({
            ...c,
            [eventId]: (c[eventId] || 0) + (status === "attending" ? 1 : 0) - (prevStatus === "attending" ? 1 : 0),
          }));
        }
      } else {
        // Insert new RSVP
        await supabase.from("event_rsvps").insert({ event_id: eventId, user_id: auth.user.id, status });
        setRsvps(r => ({ ...r, [eventId]: status }));
        if (status === "attending") setRsvpCounts(c => ({ ...c, [eventId]: (c[eventId] || 0) + 1 }));
      }
    } catch (e) {
      console.error(e);
      alert("Failed to update RSVP. Please try again.");
    } finally {
      setSubmitting(null);
    }
  }

  const statusBadge: Record<string, string> = {
    upcoming: "bg-blue-400/20 border-blue-400/30 text-blue-400",
    ongoing: "bg-green-400/20 border-green-400/30 text-green-400",
    past: "bg-[#a0a0b4]/20 border-[#a0a0b4]/30 text-[#a0a0b4]",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-1">Community Events</h2>
        <p className="text-sm text-[#a0a0b4]">RSVP to upcoming events and shows</p>
      </div>

      {/* Events */}
      {loading ? (
        <div className="text-center py-12 text-[#a0a0b4]">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-12 text-center">
          <CalendarDays size={48} className="mx-auto mb-4 text-[#a0a0b4]" />
          <h3 className="text-xl font-bold mb-2">No Events Yet</h3>
          <p className="text-[#a0a0b4]">Check back soon for upcoming community events!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {events.map((event) => {
            const myRsvp = rsvps[event.id];
            const isPast = event.status === "past";
            const isCancelled = event.status === "cancelled";
            const attending = rsvpCounts[event.id] || 0;
            const isFull = event.capacity != null && attending >= event.capacity && myRsvp !== "attending";

            return (
              <div key={event.id} className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl overflow-hidden hover:border-[#D9BA84]/25 transition">
                {/* Image */}
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-[#1a1a1a] flex items-center justify-center">
                    <CalendarDays size={40} className="text-[#D9BA84]/30" />
                  </div>
                )}

                <div className="p-5">
                  {/* Title + status */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg flex-1 pr-2">{event.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize flex-shrink-0 ${statusBadge[event.status] || statusBadge.upcoming}`}>
                      {event.status}
                    </span>
                  </div>

                  <p className="text-sm text-[#a0a0b4] mb-4 line-clamp-2">{event.description}</p>

                  {/* Meta */}
                  <div className="space-y-1.5 text-xs text-[#a0a0b4] mb-5">
                    <div className="flex items-center gap-2"><MapPin size={12} className="text-[#D9BA84]" /> {event.location}</div>
                    <div className="flex items-center gap-2"><CalendarDays size={12} className="text-[#D9BA84]" /> {new Date(event.event_date).toLocaleString()}</div>
                    {event.end_date && (
                      <div className="flex items-center gap-2"><Clock size={12} className="text-[#D9BA84]" /> Until: {new Date(event.end_date).toLocaleString()}</div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users size={12} className="text-[#D9BA84]" />
                      {attending} attending{event.capacity ? ` / ${event.capacity} capacity` : ""}
                      {isFull && <span className="text-red-400 font-semibold">(Full)</span>}
                    </div>
                  </div>

                  {/* RSVP Buttons */}
                  {!isPast && !isCancelled ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => rsvp(event.id, "attending")}
                        disabled={submitting === event.id || (isFull && myRsvp !== "attending")}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition flex items-center justify-center gap-1.5 ${
                          myRsvp === "attending"
                            ? "bg-green-400/20 border-green-400/40 text-green-400"
                            : "bg-white/5 border-white/10 text-[#a0a0b4] hover:border-green-400/30 hover:text-green-400 disabled:opacity-40"
                        }`}
                      >
                        <CheckCircle size={14} />
                        {myRsvp === "attending" ? "Going!" : "Attend"}
                      </button>
                      <button
                        onClick={() => rsvp(event.id, "maybe")}
                        disabled={submitting === event.id}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition flex items-center justify-center gap-1.5 ${
                          myRsvp === "maybe"
                            ? "bg-yellow-400/20 border-yellow-400/40 text-yellow-400"
                            : "bg-white/5 border-white/10 text-[#a0a0b4] hover:border-yellow-400/30 hover:text-yellow-400"
                        }`}
                      >
                        <Clock size={14} />
                        Maybe
                      </button>
                      <button
                        onClick={() => rsvp(event.id, "not_attending")}
                        disabled={submitting === event.id}
                        className={`py-2.5 px-3 rounded-lg text-sm font-semibold border transition flex items-center justify-center ${
                          myRsvp === "not_attending"
                            ? "bg-red-400/20 border-red-400/40 text-red-400"
                            : "bg-white/5 border-white/10 text-[#a0a0b4] hover:border-red-400/30 hover:text-red-400"
                        }`}
                      >
                        <XCircle size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="py-2.5 text-center text-sm text-[#a0a0b4] bg-white/5 rounded-lg border border-white/10">
                      {isPast ? "This event has ended" : "Event cancelled"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
