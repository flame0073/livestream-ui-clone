
-- Manually assign admin role to existing user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'jamesbenavides617@gmail.com'
ON CONFLICT DO NOTHING;
