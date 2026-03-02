-- Add email column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS email text;

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
