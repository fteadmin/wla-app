-- Rename basic tier to community tier

-- Step 1: Drop existing check constraints if they exist
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_membership_tier_check;

-- Step 2: Update all existing 'basic' roles to 'community'
UPDATE public.user_profiles 
SET role = 'community' 
WHERE role = 'basic';

-- Step 3: Update membership_tier references
UPDATE public.user_profiles 
SET membership_tier = 'community' 
WHERE membership_tier = 'basic';

-- Step 4: Update membership_payments table if it exists
UPDATE public.membership_payments 
SET membership_tier = 'community' 
WHERE membership_tier = 'basic';

-- Step 5: Add new check constraints with 'community' instead of 'basic'
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('admin', 'community'));

ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_membership_tier_check 
CHECK (membership_tier IN ('none', 'community'));

-- Step 6: Update default values in user_profiles
ALTER TABLE public.user_profiles 
ALTER COLUMN role SET DEFAULT 'community';

ALTER TABLE public.user_profiles 
ALTER COLUMN membership_tier SET DEFAULT 'community';

-- Step 7: Update default values in membership_payments
ALTER TABLE public.membership_payments 
ALTER COLUMN membership_tier SET DEFAULT 'community';

-- Create storage bucket for contest media
INSERT INTO storage.buckets (id, name, public)
VALUES ('contest-media', 'contest-media', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for contest media
CREATE POLICY "Anyone can view contest media"
ON storage.objects FOR SELECT
USING (bucket_id = 'contest-media');

CREATE POLICY "Authenticated users can upload contest media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'contest-media' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own contest media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'contest-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own contest media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'contest-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create contest_submissions table for user uploads
CREATE TABLE IF NOT EXISTS public.contest_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  winner BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(contest_id, user_id, media_url)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_contest_submissions_contest_id ON public.contest_submissions(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_submissions_user_id ON public.contest_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_contest_submissions_status ON public.contest_submissions(status);

-- Enable RLS
ALTER TABLE public.contest_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contest_submissions
CREATE POLICY "Anyone can view approved submissions"
  ON public.contest_submissions FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create their own submissions"
  ON public.contest_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions"
  ON public.contest_submissions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any submission"
  ON public.contest_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can delete their own submissions"
  ON public.contest_submissions FOR DELETE
  USING (auth.uid() = user_id);

-- Update RLS policies that reference 'basic' role to 'community'
-- (Most policies use 'admin' check, but let's ensure consistency)
