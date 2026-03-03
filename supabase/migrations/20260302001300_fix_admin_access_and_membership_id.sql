-- Fix admin access to view all users and auto-generate membership IDs

-- Add policy for admins to view all user profiles
CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Add policy for admins to update all user profiles (for token management, etc.)
CREATE POLICY "Admins can update all profiles"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Generate membership_id for all existing users who don't have one
UPDATE public.user_profiles
SET membership_id = generate_membership_id()
WHERE membership_id IS NULL;

-- Create trigger to auto-generate membership_id for new users
CREATE OR REPLACE FUNCTION auto_generate_membership_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.membership_id IS NULL THEN
    NEW.membership_id := generate_membership_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS trigger_auto_generate_membership_id ON public.user_profiles;

-- Create trigger
CREATE TRIGGER trigger_auto_generate_membership_id
BEFORE INSERT ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION auto_generate_membership_id();
