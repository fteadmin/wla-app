-- Allow admins to read all token purchases (for revenue stats)
DROP POLICY IF EXISTS "Admins can view all token purchases" ON public.token_purchases;
CREATE POLICY "Admins can view all token purchases"
ON public.token_purchases
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admins to read all membership payments (for revenue stats)
DROP POLICY IF EXISTS "Admins can view all membership payments" ON public.membership_payments;
CREATE POLICY "Admins can view all membership payments"
ON public.membership_payments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
