-- Add placement column to contest_submissions (1=1st, 2=2nd, 3=3rd)
ALTER TABLE public.contest_submissions
  ADD COLUMN IF NOT EXISTS placement INTEGER DEFAULT NULL CHECK (placement IN (1, 2, 3));

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  capacity INTEGER,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'past', 'cancelled')),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_rsvps table
CREATE TABLE IF NOT EXISTS public.event_rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'attending' CHECK (status IN ('attending', 'not_attending', 'maybe')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_event_id ON public.event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user_id ON public.event_rsvps(user_id);

-- RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

-- Events: everyone can read, only admins can create/update/delete
CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT USING (true);

CREATE POLICY "Admins can create events"
  ON public.events FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Event RSVPs: users see all, manage own
CREATE POLICY "Anyone can view rsvps"
  ON public.event_rsvps FOR SELECT USING (true);

CREATE POLICY "Authenticated users can rsvp"
  ON public.event_rsvps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rsvp"
  ON public.event_rsvps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rsvp"
  ON public.event_rsvps FOR DELETE
  USING (auth.uid() = user_id);
