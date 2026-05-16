-- Article scheduling + AI writing assistant.
-- Adds scheduled-publish support and a per-post AI usage counter.

-- 1. New columns -------------------------------------------------------------
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ai_uses INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.posts
  DROP CONSTRAINT IF EXISTS posts_ai_uses_non_negative;
ALTER TABLE public.posts
  ADD CONSTRAINT posts_ai_uses_non_negative CHECK (ai_uses >= 0);

CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at
  ON public.posts (scheduled_at)
  WHERE status = 'scheduled';

-- 2. Visibility --------------------------------------------------------------
-- A scheduled post becomes publicly readable the instant its time arrives,
-- even before the cron job below flips its status to 'published'.
DROP POLICY IF EXISTS "Published posts are public" ON public.posts;
CREATE POLICY "Published posts are public"
  ON public.posts FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    OR (status = 'scheduled' AND scheduled_at IS NOT NULL AND scheduled_at <= now())
  );

-- 3. Auto-publisher ----------------------------------------------------------
-- Flips every scheduled post whose time has arrived to 'published'.
CREATE OR REPLACE FUNCTION public.publish_due_posts()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.posts
  SET status = 'published',
      published_at = COALESCE(scheduled_at, now())
  WHERE status = 'scheduled'
    AND scheduled_at IS NOT NULL
    AND scheduled_at <= now();
$$;

-- Run the auto-publisher once a minute.
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Re-using the same job name updates the existing schedule if it exists.
SELECT cron.schedule(
  'publish-due-posts',
  '* * * * *',
  $$ SELECT public.publish_due_posts(); $$
);

-- 4. AI usage metering -------------------------------------------------------
-- Atomically consumes one AI use for a post. Returns the new count, or NULL
-- when the post has already reached its limit. Called only by the
-- improve-article edge function via the service role.
CREATE OR REPLACE FUNCTION public.consume_ai_use(p_post_id UUID, p_limit INTEGER DEFAULT 5)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.posts
  SET ai_uses = ai_uses + 1
  WHERE id = p_post_id AND ai_uses < p_limit
  RETURNING ai_uses INTO new_count;
  RETURN new_count;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_ai_use(UUID, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_ai_use(UUID, INTEGER) TO service_role;
