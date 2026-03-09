-- ── Update messages table for one-to-one messaging ────────────────────────────
-- Add recipient_id column to support direct messaging between users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' 
    AND column_name = 'recipient_id'
  ) THEN
    ALTER TABLE public.messages 
    ADD COLUMN recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create index for recipient_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);

-- Create compound index for conversation queries
CREATE INDEX IF NOT EXISTS idx_messages_conversation 
ON public.messages(sender_id, recipient_id, created_at DESC);

-- ── Drop old RLS policies (only if they exist) ────────────────────────────────
DO $$
BEGIN
  DROP POLICY IF EXISTS "Community members can view messages" ON public.messages;
  DROP POLICY IF EXISTS "Community members can send messages" ON public.messages;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- ── New RLS policies for one-to-one messaging ──────────────────────────────────
DO $$
BEGIN
  -- Drop new policies if they exist (for idempotence)
  DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
  DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
  
  -- Users can read messages where they are either sender or recipient
  CREATE POLICY "Users can view their own messages"
    ON public.messages FOR SELECT
    USING (
      auth.uid() = sender_id OR auth.uid() = recipient_id
    );

  -- Users can send messages to others (as themselves)
  CREATE POLICY "Users can send messages"
    ON public.messages FOR INSERT
    WITH CHECK (
      sender_id = auth.uid()
      AND recipient_id IS NOT NULL
      AND recipient_id != sender_id
      AND EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid()
      )
    );
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- ── Helper function to get conversation partner ────────────────────────────────
-- This function helps identify the "other person" in a conversation
CREATE OR REPLACE FUNCTION public.get_conversation_partner(
  msg_sender_id UUID,
  msg_recipient_id UUID,
  current_user_id UUID
)
RETURNS UUID AS $$
BEGIN
  IF current_user_id = msg_sender_id THEN
    RETURN msg_recipient_id;
  ELSE
    RETURN msg_sender_id;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
