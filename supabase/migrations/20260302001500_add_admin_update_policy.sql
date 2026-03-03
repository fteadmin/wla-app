-- Add policy to allow admin users to update other profiles
-- This is safe now because we're using a function that doesn't cause recursion

-- Create a function to check if current user is admin (cached in session)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Now create policy that uses this function for admins to update others
CREATE POLICY "Admins can update other users"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());
