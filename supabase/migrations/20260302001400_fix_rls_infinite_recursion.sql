-- Fix infinite recursion in RLS policies by dropping the problematic policies
-- and creating simpler ones that work properly

-- Drop the policies causing infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;

-- Drop existing basic user policies to recreate them properly
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role has full access" ON public.user_profiles;

-- Allow authenticated users to view all profiles (needed for admin features)
CREATE POLICY "Authenticated users can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow service role full access (for server-side operations and triggers)
CREATE POLICY "Service role has full access"
ON public.user_profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
