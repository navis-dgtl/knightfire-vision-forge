-- Outrank → Publications sync.
-- Lets the sync-outrank edge function import articles from the Outrank API
-- into public.posts, and schedules a daily job that pulls yesterday's new
-- Outrank articles automatically.

-- 1. Tracking columns -------------------------------------------------------
-- external_source identifies the upstream system (currently only 'outrank');
-- external_id is the article's id within that system. Together they make a
-- natural key the sync can upsert on so re-running never creates duplicates.
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS external_source TEXT,
  ADD COLUMN IF NOT EXISTS external_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS posts_external_source_external_id_unique
  ON public.posts (external_source, external_id)
  WHERE external_source IS NOT NULL AND external_id IS NOT NULL;

-- 2. Extensions -------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 3. Daily trigger function ------------------------------------------------
-- Called by pg_cron once per day. Posts to the sync-outrank edge function
-- with mode='daily' (yesterday's articles). Reads the project URL and a
-- service-role JWT from vault.decrypted_secrets — see comment block at the
-- bottom of this file for the one-time vault setup the operator must run.
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

-- 4. Cron schedule ----------------------------------------------------------
-- Runs every day at 08:00 UTC. Re-running this migration safely updates the
-- existing schedule because cron.schedule() upserts on job name.
SELECT cron.schedule(
  'outrank-daily-sync',
  '0 8 * * *',
  $$ SELECT public.trigger_outrank_daily_sync(); $$
);

-- ---------------------------------------------------------------------------
-- One-time operator setup (run once in the Supabase SQL editor, NOT in code):
--
--   SELECT vault.create_secret(
--     'https://xkpkxsxkpydoxzsankyj.supabase.co',
--     'project_url'
--   );
--   SELECT vault.create_secret(
--     '<paste the project service_role JWT here>',
--     'service_role_key'
--   );
--
-- And in Supabase Dashboard → Edge Functions → sync-outrank → Secrets:
--   OUTRANK_API_KEY = outr_live_…   (the org admin API key)
--
-- After both are set, the cron job above can run unattended.
-- ---------------------------------------------------------------------------
