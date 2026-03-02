-- Add membership fields to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS membership_id text UNIQUE,
ADD COLUMN IF NOT EXISTS membership_status text DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS membership_tier text DEFAULT 'none',
ADD COLUMN IF NOT EXISTS qr_code text,
ADD COLUMN IF NOT EXISTS payment_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS membership_expires timestamp with time zone;

-- Create membership_payments table to track payment history
CREATE TABLE IF NOT EXISTS public.membership_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  stripe_payment_id text NOT NULL,
  membership_tier text NOT NULL DEFAULT 'basic',
  created_at timestamp with time zone DEFAULT timezone('utc', now()),
  status text NOT NULL DEFAULT 'completed'
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_membership_payments_user_id ON public.membership_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_membership_id ON public.user_profiles(membership_id);

-- Enable Row Level Security for membership_payments
ALTER TABLE public.membership_payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own membership payments" ON public.membership_payments;
DROP POLICY IF EXISTS "Users can insert own membership payments" ON public.membership_payments;

-- Create RLS policies for membership_payments
CREATE POLICY "Users can view own membership payments"
ON public.membership_payments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own membership payments"
ON public.membership_payments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Function to generate membership ID
CREATE OR REPLACE FUNCTION generate_membership_id()
RETURNS text AS $$
DECLARE
  new_id text;
  id_exists boolean;
BEGIN
  LOOP
    -- Generate format: WLA-XXXXX (5 random uppercase alphanumeric)
    new_id := 'WLA-' || upper(substring(md5(random()::text) from 1 for 5));
    
    -- Check if this ID already exists
    SELECT EXISTS(SELECT 1 FROM public.user_profiles WHERE membership_id = new_id) INTO id_exists;
    
    -- Exit loop if ID is unique
    EXIT WHEN NOT id_exists;
  END LOOP;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;
