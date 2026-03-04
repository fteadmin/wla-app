-- Add FK from event_rsvps.user_id → user_profiles.id so Supabase can auto-join
ALTER TABLE public.event_rsvps
  ADD CONSTRAINT event_rsvps_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- Add checked_in column for event check-in via QR scanner
ALTER TABLE public.event_rsvps
  ADD COLUMN IF NOT EXISTS checked_in BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMP WITH TIME ZONE;

-- Allow admins to upsert RSVPs (for check-in even if no prior RSVP)
CREATE POLICY "Admins can manage all rsvps"
  ON public.event_rsvps FOR ALL
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));
