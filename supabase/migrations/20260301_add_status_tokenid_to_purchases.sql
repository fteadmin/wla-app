-- Add status and human-readable token_id to token_purchases
ALTER TABLE public.token_purchases
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'completed',
  ADD COLUMN IF NOT EXISTS token_id text;

-- Backfill token_id for any existing rows
UPDATE public.token_purchases
SET token_id = 'TKN-' || UPPER(SUBSTRING(id::text, 1, 8))
WHERE token_id IS NULL;

ALTER TABLE public.token_purchases
  ALTER COLUMN token_id SET NOT NULL;
