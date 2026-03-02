-- Drop the redundant user_id column from user_profiles
-- We use 'id' as the primary key that references auth.users(id)
ALTER TABLE public.user_profiles 
DROP COLUMN IF EXISTS user_id CASCADE;
