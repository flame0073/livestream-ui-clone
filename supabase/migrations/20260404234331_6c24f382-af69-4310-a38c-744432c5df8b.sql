DROP POLICY IF EXISTS "Admins can update channels" ON public.channels;

CREATE POLICY "Admins can update channels"
ON public.channels
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));