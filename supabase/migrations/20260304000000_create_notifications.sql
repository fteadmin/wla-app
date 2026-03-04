-- ── Create notifications table ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,  -- 'new_contest' | 'new_event' | 'rsvp_confirmed' | 'token_purchase' | 'membership_activated'
  title        TEXT NOT NULL,
  message      TEXT,
  read         BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id    ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read       ON public.notifications(read);

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only read their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can mark their own notifications as read
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ── Enable Supabase Realtime ──────────────────────────────────────────────────
-- Wrapped in DO block: safe whether the publication is FOR ALL TABLES or not
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime' AND puballtables = true
  ) THEN
    ALTER publication supabase_realtime ADD TABLE public.notifications;
  END IF;
EXCEPTION WHEN others THEN
  NULL; -- already added or other harmless error
END $$;

-- ── Trigger helpers ───────────────────────────────────────────────────────────

-- 1. Token purchase → notify the buyer
CREATE OR REPLACE FUNCTION notify_on_token_purchase()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message)
  VALUES (
    NEW.user_id,
    'token_purchase',
    'Token Purchase Successful!',
    'Your token purchase was confirmed. Your balance has been updated.'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_token_purchase ON public.token_purchases;
CREATE TRIGGER trigger_notify_token_purchase
  AFTER INSERT ON public.token_purchases
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_token_purchase();

-- 2. Membership activated → notify the user
CREATE OR REPLACE FUNCTION notify_on_membership_activated()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.membership_status = 'active'
     AND (OLD.membership_status IS DISTINCT FROM 'active') THEN
    INSERT INTO public.notifications (user_id, type, title, message)
    VALUES (
      NEW.id,
      'membership_activated',
      'Membership Activated!',
      'Your WLA membership is now active. Welcome to the club!'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_membership_activated ON public.user_profiles;
CREATE TRIGGER trigger_notify_membership_activated
  AFTER UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_membership_activated();

-- 3. Event RSVP → confirm to the user
CREATE OR REPLACE FUNCTION notify_on_event_rsvp()
RETURNS TRIGGER AS $$
DECLARE
  event_title TEXT;
BEGIN
  IF NEW.status = 'attending' THEN
    SELECT title INTO event_title FROM public.events WHERE id = NEW.event_id;
    INSERT INTO public.notifications (user_id, type, title, message)
    VALUES (
      NEW.user_id,
      'rsvp_confirmed',
      'RSVP Confirmed!',
      'You''re registered for "' || COALESCE(event_title, 'the event') || '".'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_event_rsvp ON public.event_rsvps;
CREATE TRIGGER trigger_notify_event_rsvp
  AFTER INSERT ON public.event_rsvps
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_event_rsvp();

-- 4. New contest created → notify all community members
CREATE OR REPLACE FUNCTION notify_on_new_contest()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message)
  SELECT
    id,
    'new_contest',
    'New Contest: ' || NEW.title,
    'Prize: ' || NEW.prize || '. Ends ' || TO_CHAR(NEW.end_date, 'Mon DD') || '. Enter now!'
  FROM public.user_profiles
  WHERE role IN ('community', 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_new_contest ON public.contests;
CREATE TRIGGER trigger_notify_new_contest
  AFTER INSERT ON public.contests
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_new_contest();

-- 5. New event created → notify all community members
CREATE OR REPLACE FUNCTION notify_on_new_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message)
  SELECT
    id,
    'new_event',
    'New Event: ' || NEW.title,
    NEW.title || ' — ' || NEW.location || ' on ' || TO_CHAR(NEW.event_date AT TIME ZONE 'UTC', 'Mon DD') || '.'
  FROM public.user_profiles
  WHERE role IN ('community', 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_new_event ON public.events;
CREATE TRIGGER trigger_notify_new_event
  AFTER INSERT ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_new_event();
