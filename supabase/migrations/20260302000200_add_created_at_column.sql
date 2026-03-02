-- Add created_at column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT timezone('utc', now());
