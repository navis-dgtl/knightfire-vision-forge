
-- Block signups for emails not on the allowlist
CREATE OR REPLACE FUNCTION public.enforce_signup_allowlist()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.admin_email_allowlist
    WHERE lower(email) = lower(NEW.email)
  ) THEN
    RAISE EXCEPTION 'Signups are restricted. Contact your KnightTek administrator to be added to the allowlist.'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_signup_allowlist_trigger ON auth.users;
CREATE TRIGGER enforce_signup_allowlist_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_signup_allowlist();

-- Auto-grant admin role on signup for allowlisted users
DROP TRIGGER IF EXISTS grant_admin_if_allowlisted_trigger ON auth.users;
CREATE TRIGGER grant_admin_if_allowlisted_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.grant_admin_if_allowlisted();
