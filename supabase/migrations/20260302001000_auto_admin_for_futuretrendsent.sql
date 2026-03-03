-- Update the handle_new_user function to automatically assign admin role to @futuretrendsent.info emails
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
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
