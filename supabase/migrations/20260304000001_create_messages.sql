-- ── Create messages table ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 2000),
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id  ON public.messages(sender_id);

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Only community/admin members can read messages
CREATE POLICY "Community members can view messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid()
        AND role IN ('community', 'admin')
    )
  );

-- Only community/admin members can send messages (as themselves)
CREATE POLICY "Community members can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid()
        AND role IN ('community', 'admin')
    )
  );

-- ── Enable Supabase Realtime ──────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime' AND puballtables = true
  ) THEN
    ALTER publication supabase_realtime ADD TABLE public.messages;
  END IF;
EXCEPTION WHEN others THEN
  NULL;
END $$;
