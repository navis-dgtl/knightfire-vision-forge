-- Outrank → Publications sync.
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS external_source TEXT,
  ADD COLUMN IF NOT EXISTS external_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS posts_external_source_external_id_unique
  ON public.posts (external_source, external_id)
  WHERE external_source IS NOT NULL AND external_id IS NOT NULL;

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION public.trigger_outrank_daily_sync()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, vault
AS $$
DECLARE
  v_project_url TEXT;
  v_service_key TEXT;
  v_request_id  BIGINT;
BEGIN
  SELECT decrypted_secret INTO v_project_url
    FROM vault.decrypted_secrets WHERE name = 'project_url' LIMIT 1;
  SELECT decrypted_secret INTO v_service_key
    FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1;

  IF v_project_url IS NULL OR v_service_key IS NULL THEN
    RAISE NOTICE 'Outrank daily sync skipped: vault secrets project_url / service_role_key not configured.';
    RETURN NULL;
  END IF;

  SELECT net.http_post(
    url     := v_project_url || '/functions/v1/sync-outrank',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || v_service_key
    ),
    body    := jsonb_build_object('mode', 'daily'),
    timeout_milliseconds := 60000
  ) INTO v_request_id;

  RETURN v_request_id;
END;
$$;

REVOKE ALL ON FUNCTION public.trigger_outrank_daily_sync() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.trigger_outrank_daily_sync() TO postgres, service_role;

SELECT cron.schedule(
  'outrank-daily-sync',
  '0 8 * * *',
  $cron$ SELECT public.trigger_outrank_daily_sync(); $cron$
);