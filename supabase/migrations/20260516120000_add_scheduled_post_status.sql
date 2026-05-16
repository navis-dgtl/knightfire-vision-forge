-- Adds a 'scheduled' post status so posts can be queued to publish automatically.
-- Kept in its own migration: a new enum value cannot be used in the same
-- transaction it is added in, so the rest of the work lives in the next file.
ALTER TYPE public.post_status ADD VALUE IF NOT EXISTS 'scheduled';
