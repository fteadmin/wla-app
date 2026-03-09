-- ── Update RLS policies to support both community chat and DMs ──────────────

-- Drop existing policies
DROP POLICY IF EXISTS "Community members can view messages" ON public.messages;
DROP POLICY IF EXISTS "Community members can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;

-- New policy: Users can view community messages (recipient_id IS NULL) OR their own DMs
CREATE POLICY "Users can view messages"
  ON public.messages FOR SELECT
  USING (
    -- For community messages (no recipient)
    (recipient_id IS NULL AND EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role IN ('community', 'admin')
    ))
    OR
    -- For direct messages (user is sender or recipient)
    (recipient_id IS NOT NULL AND (auth.uid() = sender_id OR auth.uid() = recipient_id))
  );

-- New policy: Users can send community messages OR direct messages
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid()
    )
    AND (
      -- Community message (no recipient, must be community/admin)
      (recipient_id IS NULL AND EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role IN ('community', 'admin')
      ))
      OR
      -- Direct message (must have recipient, not to self)
      (recipient_id IS NOT NULL AND recipient_id != sender_id)
    )
  );
