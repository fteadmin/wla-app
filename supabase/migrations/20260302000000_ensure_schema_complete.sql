-- Comprehensive migration to ensure all schema changes are applied
-- This migration is idempotent (safe to run multiple times)

-- Ensure user_profiles table exists with all necessary columns
DO $$ 
BEGIN
  -- Create user_profiles table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_profiles') THEN
    CREATE TABLE public.user_profiles (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      first_name text,
      last_name text,
      email text,
      created_at timestamp with time zone DEFAULT timezone('utc', now())
    );
  END IF;
END $$;

-- Add tokens column if it doesn't exist
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS tokens integer NOT NULL DEFAULT 0;

-- Add role column if it doesn't exist
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'basic';

-- Ensure token_purchases table exists
CREATE TABLE IF NOT EXISTS public.token_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  stripe_payment_id text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc', now()),
  status text NOT NULL DEFAULT 'completed',
  token_id text
);

-- Create index if not exists
CREATE INDEX IF NOT EXISTS idx_token_purchases_user_id ON public.token_purchases(user_id);

-- Enable Row Level Security for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow select on user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow insert on user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow update on user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow delete on user_profiles" ON public.user_profiles;

-- Create RLS policies for user_profiles
CREATE POLICY "Allow select on user_profiles"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Allow insert on user_profiles"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow update on user_profiles"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow delete on user_profiles"
ON public.user_profiles
FOR DELETE
USING (auth.uid() = id);

-- Enable Row Level Security for token_purchases
ALTER TABLE public.token_purchases ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own token purchases" ON public.token_purchases;
DROP POLICY IF EXISTS "Users can insert own token purchases" ON public.token_purchases;

-- Create RLS policies for token_purchases
CREATE POLICY "Users can view own token purchases"
ON public.token_purchases
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own token purchases"
ON public.token_purchases
FOR INSERT
WITH CHECK (auth.uid() = user_id);
