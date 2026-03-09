-- Sync all existing auth.users to user_profiles
-- This ensures any users who signed up before the trigger was working
-- will have their profiles created

DO $$
DECLARE
  user_record RECORD;
  user_role TEXT;
BEGIN
  -- Loop through all auth.users that don't have a profile
  FOR user_record IN 
    SELECT u.id, u.email, u.raw_user_meta_data
    FROM auth.users u
    LEFT JOIN public.user_profiles up ON u.id = up.id
    WHERE up.id IS NULL
  LOOP
    -- Determine role based on email
    IF user_record.email LIKE '%@futuretrendsent.info' THEN
      user_role := 'admin';
    ELSE
      user_role := 'community';
    END IF;

    -- Create the profile
    INSERT INTO public.user_profiles (id, email, first_name, last_name, role, membership_tier)
    VALUES (
      user_record.id,
      user_record.email,
      COALESCE(user_record.raw_user_meta_data->>'first_name', ''),
      COALESCE(user_record.raw_user_meta_data->>'last_name', ''),
      user_role,
      'none'
    )
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Created profile for user: %', user_record.email;
  END LOOP;
END $$;
