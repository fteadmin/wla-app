-- Update existing @futuretrendsent.info users to admin role
UPDATE public.user_profiles
SET role = 'admin'
WHERE email LIKE '%@futuretrendsent.info'
  AND role != 'admin';

-- Also update the trigger to handle updates (in case role was changed back)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Check if email is @futuretrendsent.info domain
  IF NEW.email LIKE '%@futuretrendsent.info' THEN
    user_role := 'admin';
  ELSE
    user_role := 'basic';
  END IF;

  INSERT INTO public.user_profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    user_role
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, user_profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, user_profiles.last_name),
    role = EXCLUDED.role;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
