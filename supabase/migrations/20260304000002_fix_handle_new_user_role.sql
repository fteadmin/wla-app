-- Fix handle_new_user:
--   1. Was setting role to 'basic' instead of 'community' (violates role CHECK constraint)
--   2. Was not setting membership_tier (violates membership_tier NOT NULL / CHECK constraint)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
● Got the additional requests — I'll finish the core build then add those. Let
DECLARE
  user_role TEXT;
BEGIN
  IF NEW.email LIKE '%@futuretrendsent.info' THEN
    user_role := 'admin';
  ELSE
    user_role := 'community';
  END IF;

  INSERT INTO public.user_profiles (id, email, first_name, last_name, role, membership_tier)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    user_role,
    'none'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, user_profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, user_profiles.last_name),
    role = EXCLUDED.role;

  RETURN NEW;
END;
$function$
