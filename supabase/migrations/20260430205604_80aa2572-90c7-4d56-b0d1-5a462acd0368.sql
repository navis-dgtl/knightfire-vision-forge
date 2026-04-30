-- Allowlist of emails that should automatically receive the admin role
CREATE TABLE IF NOT EXISTS public.admin_email_allowlist (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_email_allowlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage allowlist" ON public.admin_email_allowlist;
CREATE POLICY "Admins can manage allowlist"
ON public.admin_email_allowlist
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Seed the two admin emails
INSERT INTO public.admin_email_allowlist (email) VALUES
  ('nickcprince@gmail.com'),
  ('miranda@ktekglobal.com')
ON CONFLICT (email) DO NOTHING;

-- Trigger function: when a new auth user is created, grant admin role if email is allowlisted
CREATE OR REPLACE FUNCTION public.grant_admin_if_allowlisted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.admin_email_allowlist
    WHERE lower(email) = lower(NEW.email)
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_grant_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.grant_admin_if_allowlisted();

-- Backfill: grant admin to any allowlisted user that already exists
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
JOIN public.admin_email_allowlist a ON lower(a.email) = lower(u.email)
ON CONFLICT (user_id, role) DO NOTHING;