
-- Fix channels table: only admins can insert/update/delete
DROP POLICY "Anyone can delete channels" ON public.channels;
DROP POLICY "Anyone can insert channels" ON public.channels;
DROP POLICY "Anyone can update channels" ON public.channels;

CREATE POLICY "Admins can insert channels" ON public.channels FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update channels" ON public.channels FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete channels" ON public.channels FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
