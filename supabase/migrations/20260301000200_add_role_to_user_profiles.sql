-- Add role column to user_profiles (basic | admin)
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'basic';
