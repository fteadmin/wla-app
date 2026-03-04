"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Plus, CalendarDays, MapPin, Users, X, Eye, Trash2,
  Clock, CheckCircle, XCircle, Edit2, Image as ImageIcon,
} from "lucide-react";
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
  created_at: string;
}

interface RSVP {
  id: string;
  user_id: string;
  status: "attending" | "not_attending" | "maybe";
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
  user_profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const emptyForm = {
  title: "",
  description: "",
  location: "",
  event_date: "",
  end_date: "",
  capacity: "",
  status: "upcoming" as Event["status"],
  image_url: "",
};

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => { fetchEvents(); }, []);

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });
      if (error) throw error;
      setEvents(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRSVPs(eventId: string) {
    try {
      const { data: rsvpData, error } = await supabase
        .from("event_rsvps")
        .select("id, user_id, status, checked_in, checked_in_at, created_at")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });
      if (error) throw error;

      if (!rsvpData || rsvpData.length === 0) {
        setRsvps([]);
        return;
      }

      // Fetch user profiles separately since FK points to auth.users
      const userIds = rsvpData.map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("id, first_name, last_name, email")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      const merged = rsvpData.map((r) => ({
        ...r,
        user_profiles: profileMap.get(r.user_id) || undefined,
      }));

      setRsvps(merged);
    } catch (e) {
      console.error(e);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setShowModal(true);
  }

  function openEdit(event: Event) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      location: event.location,
      event_date: event.event_date ? event.event_date.slice(0, 16) : "",
      end_date: event.end_date ? event.end_date.slice(0, 16) : "",
      capacity: event.capacity != null ? String(event.capacity) : "",
      status: event.status,
      image_url: event.image_url || "",
    });
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not authenticated");

      let imageUrl = form.image_url;

      // Upload image if a file was selected
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `events/${auth.user.id}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("contest-media")
          .upload(path, imageFile);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from("contest-media").getPublicUrl(path);
        imageUrl = publicUrl;
      }

      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        event_date: form.event_date,
        end_date: form.end_date || null,
        capacity: form.capacity ? Number(form.capacity) : null,
        status: form.status,
        image_url: imageUrl || null,
      };

      if (editingId) {
        const { error } = await supabase.from("events").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("events").insert({ ...payload, created_by: auth.user.id });
        if (error) throw error;
      }

      setShowModal(false);
      await fetchEvents();
    } catch (e) {
      console.error(e);
      alert("Failed to save event.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(id: string) {
    if (!confirm("Delete this event? All RSVPs will also be removed.")) return;
    await supabase.from("events").delete().eq("id", id);
    await fetchEvents();
  }

  function openRSVPs(event: Event) {
    setSelectedEvent(event);
    setShowRSVPModal(true);
    fetchRSVPs(event.id);
  }

  const statusColor: Record<string, string> = {
    upcoming: "bg-blue-400/20 border-blue-400/30 text-blue-400",
    ongoing: "bg-green-400/20 border-green-400/30 text-green-400",
    past: "bg-[#a0a0b4]/20 border-[#a0a0b4]/30 text-[#a0a0b4]",
    cancelled: "bg-red-400/20 border-red-400/30 text-red-400",
  };

  const rsvpColor: Record<string, string> = {
    attending: "text-green-400",
    not_attending: "text-red-400",
    maybe: "text-yellow-400",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Events Management</h2>
          <p className="text-sm text-[#a0a0b4]">Create events and manage RSVPs</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black font-semibold rounded-lg hover:opacity-90 transition"
        >
          <Plus size={16} />
          Create Event
        </button>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="text-center py-12 text-[#a0a0b4]">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-12 text-center">
          <CalendarDays size={48} className="mx-auto mb-4 text-[#a0a0b4]" />
          <h3 className="text-xl font-bold mb-2">No Events Yet</h3>
          <p className="text-[#a0a0b4] mb-6">Create the first community event!</p>
          <button onClick={openCreate} className="px-6 py-3 bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black font-semibold rounded-lg hover:opacity-90 transition">
            Create Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <div key={event.id} className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl overflow-hidden hover:border-[#D9BA84]/25 transition">
              {event.image_url && (
                <img src={event.image_url} alt={event.title} className="w-full h-36 object-cover" />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg flex-1 pr-2">{event.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${statusColor[event.status]}`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-sm text-[#a0a0b4] mb-3 line-clamp-2">{event.description}</p>
                <div className="space-y-1.5 text-xs text-[#a0a0b4] mb-4">
                  <div className="flex items-center gap-2"><MapPin size={12} /> {event.location}</div>
                  <div className="flex items-center gap-2"><CalendarDays size={12} /> {new Date(event.event_date).toLocaleString()}</div>
                  {event.capacity && <div className="flex items-center gap-2"><Users size={12} /> Capacity: {event.capacity}</div>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openRSVPs(event)} className="flex-1 py-2 bg-[#D9BA84]/10 border border-[#D9BA84]/30 rounded-lg text-[#D9BA84] text-sm font-semibold hover:bg-[#D9BA84]/20 transition flex items-center justify-center gap-1">
                    <Eye size={14} /> RSVPs
                  </button>
                  <button onClick={() => openEdit(event)} className="py-2 px-3 bg-white/5 border border-white/10 rounded-lg text-[#a0a0b4] hover:text-white text-sm transition">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => deleteEvent(event.id)} className="py-2 px-3 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400 hover:bg-red-400/20 text-sm transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0d0d0d] border border-[#D9BA84]/20 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{editingId ? "Edit Event" : "Create New Event"}</h3>
              <button onClick={() => setShowModal(false)} className="text-[#a0a0b4] hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Event Title*</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#D9BA84]/20 rounded-lg focus:border-[#D9BA84] focus:outline-none" placeholder="e.g., Annual Lowrider Showcase" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description*</label>
                <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#D9BA84]/20 rounded-lg focus:border-[#D9BA84] focus:outline-none" placeholder="Describe the event..." />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Location*</label>
                <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-2 bg-black border border-[#D9BA84]/20 rounded-lg focus:border-[#D9BA84] focus:outline-none" placeholder="Address or venue name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Start Date & Time*</label>
                  <input required type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D9BA84]/20 rounded-lg focus:border-[#D9BA84] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">End Date & Time</label>
                  <input type="datetime-local" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D9BA84]/20 rounded-lg focus:border-[#D9BA84] focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Capacity</label>
                  <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D9BA84]/20 rounded-lg focus:border-[#D9BA84] focus:outline-none" placeholder="Leave blank = unlimited" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Event["status"] })}
                    className="w-full px-4 py-2 bg-black border border-[#D9BA84]/20 rounded-lg focus:border-[#D9BA84] focus:outline-none">
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="past">Past</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Event Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 bg-black border border-[#D9BA84]/20 rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-[#D9BA84] file:text-black file:text-sm file:font-semibold cursor-pointer" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 rounded-lg border border-[#a0a0b4]/20 text-[#a0a0b4] font-semibold hover:bg-white/5">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black font-semibold hover:opacity-90 disabled:opacity-50">
                  {saving ? "Saving..." : editingId ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RSVPs Modal */}
      {showRSVPModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0d0d0d] border border-[#D9BA84]/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                <p className="text-sm text-[#a0a0b4] mt-1">
                  {rsvps.filter(r => r.status === "attending").length} attending ·{" "}
                  {rsvps.filter(r => r.status === "maybe").length} maybe ·{" "}
                  {rsvps.filter(r => r.status === "not_attending").length} not attending
                </p>
              </div>
              <button onClick={() => setShowRSVPModal(false)} className="text-[#a0a0b4] hover:text-white"><X size={24} /></button>
            </div>

            {/* Summary pills */}
            <div className="flex gap-3 mb-6">
              {[
                { label: "Attending", key: "attending", icon: CheckCircle, color: "green" },
                { label: "Maybe", key: "maybe", icon: Clock, color: "yellow" },
                { label: "Not Attending", key: "not_attending", icon: XCircle, color: "red" },
              ].map(({ label, key, icon: Icon, color }) => (
                <div key={key} className={`flex-1 py-3 rounded-xl border text-center bg-${color}-400/10 border-${color}-400/20`}>
                  <p className={`text-xl font-bold text-${color}-400`}>{rsvps.filter(r => r.status === key).length}</p>
                  <p className={`text-xs text-${color}-400 mt-1`}>{label}</p>
                </div>
              ))}
            </div>

            {rsvps.length === 0 ? (
              <p className="text-center text-[#a0a0b4] py-8">No RSVPs yet for this event.</p>
            ) : (
              <div className="space-y-2">
                {rsvps.map((rsvp) => (
                  <div key={rsvp.id} className="flex items-center justify-between py-3 px-4 bg-black rounded-xl border border-white/5">
                    <div>
                      <p className="font-semibold text-sm">{rsvp.user_profiles?.first_name} {rsvp.user_profiles?.last_name}</p>
                      <p className="text-xs text-[#a0a0b4]">{rsvp.user_profiles?.email}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs font-semibold capitalize ${rsvpColor[rsvp.status]}`}>
                        {rsvp.status.replace("_", " ")}
                      </span>
                      {rsvp.checked_in ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-400/20 border border-green-400/30 text-green-400 text-[10px] font-bold">
                          <CheckCircle size={10} /> Checked In
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#a0a0b4] text-[10px]">
                          Not checked in
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
