-- Fix RLS policies to allow profile creation during signup

-- Drop existing policies
DROP POLICY IF EXISTS "Allow select on user_profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow insert on user_profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow update on user_profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow delete on user_profiles" ON user_profiles;

-- Allow users to insert their own profile (including during signup)
CREATE POLICY "Users can insert own profile"
ON user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
ON user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete own profile"
ON user_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- Also allow service role (for admin operations)
CREATE POLICY "Service role has full access"
ON user_profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
