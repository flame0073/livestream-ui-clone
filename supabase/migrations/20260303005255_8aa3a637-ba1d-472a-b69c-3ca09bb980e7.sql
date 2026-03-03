
-- Auto-assign admin role when the specific admin email signs up
CREATE OR REPLACE FUNCTION public.assign_admin_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'jamesbenavides617@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_admin_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.assign_admin_on_signup();
