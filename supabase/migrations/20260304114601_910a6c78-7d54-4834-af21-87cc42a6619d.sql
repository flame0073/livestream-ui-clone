-- Drop all existing RESTRICTIVE policies on channels
DROP POLICY IF EXISTS "Admins can delete channels" ON public.channels;
DROP POLICY IF EXISTS "Admins can insert channels" ON public.channels;
DROP POLICY IF EXISTS "Admins can update channels" ON public.channels;
DROP POLICY IF EXISTS "Anyone can read channels" ON public.channels;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Anyone can read channels"
  ON public.channels FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert channels"
  ON public.channels FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update channels"
  ON public.channels FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete channels"
  ON public.channels FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));