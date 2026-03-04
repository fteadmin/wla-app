-- Add FK from contest_submissions.user_id → user_profiles.id so PostgREST can join them
ALTER TABLE public.contest_submissions
  ADD CONSTRAINT contest_submissions_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- Also allow admins to update submission status/placement (approve/reject/place)
DROP POLICY IF EXISTS "Admins can update any submission" ON public.contest_submissions;
CREATE POLICY "Admins can update any submission"
  ON public.contest_submissions FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
