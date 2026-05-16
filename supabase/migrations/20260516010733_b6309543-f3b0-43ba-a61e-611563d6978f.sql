CREATE TYPE public.post_type AS ENUM ('article', 'news', 'video', 'publication');
CREATE TYPE public.post_status AS ENUM ('draft', 'published');

CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.post_type NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  body TEXT,
  featured_image_url TEXT,
  video_url TEXT,
  pdf_url TEXT,
  external_url TEXT,
  status public.post_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are public"
  ON public.posts FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins can view all posts"
  ON public.posts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert posts"
  ON public.posts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update posts"
  ON public.posts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete posts"
  ON public.posts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_posts_status_published_at ON public.posts (status, published_at DESC);
CREATE INDEX idx_posts_type ON public.posts (type);

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.posts (type, title, slug, excerpt, body, featured_image_url, video_url, pdf_url, external_url, status, published_at)
VALUES
  ('publication',
   'Fire Magazine - September 2025',
   'fire-magazine-september-2025',
   'Featured article: "KnightTek rolls out dual agent system..." - Stephen Knight, CEO of KnightTek, discusses the innovative dual-agent approach to lithium-ion battery fire safety.',
   NULL, NULL, NULL,
   '/publications/fire-magazine-september-2025.pdf',
   NULL, 'published', now()),
  ('publication',
   'Three Minutes to Extinguish a Tesla Fire: The Miracle Solution from Nevada',
   'three-minutes-to-extinguish-a-tesla-fire',
   'Auto Infos (France) covers KnightTek''s innovative plant-based fire suppression system that can extinguish electric vehicle fires in just three minutes, addressing the critical challenge of lithium-ion battery thermal runaway.',
   NULL, NULL, NULL, NULL,
   'https://www.auto-infos.fr/article/trois-minutes-pour-eteindre-une-tesla-en-feu-la-solution-miracle-viendrait-du-nevada.287299',
   'published', now()),
  ('video', 'KnightTek Burn Demonstration 1', 'knighttek-burn-demonstration-1',
   'Burn demonstration showing thermal runaway containment with the KnightTek dual-agent system.',
   NULL, NULL, 'https://www.youtube.com/watch?v=jsvnC8jPDSk', NULL, NULL, 'published', now()),
  ('video', 'KnightTek Burn Demonstration 2', 'knighttek-burn-demonstration-2',
   'Burn demonstration showing thermal runaway containment with the KnightTek dual-agent system.',
   NULL, NULL, 'https://www.youtube.com/watch?v=l4wn4y4AyPI', NULL, NULL, 'published', now()),
  ('video', 'KnightTek Burn Demonstration 3', 'knighttek-burn-demonstration-3',
   'Burn demonstration showing thermal runaway containment with the KnightTek dual-agent system.',
   NULL, NULL, 'https://www.youtube.com/watch?v=PVMUKiYUOQM', NULL, NULL, 'published', now()),
  ('video', 'KnightTek Burn Demonstration 4', 'knighttek-burn-demonstration-4',
   'Burn demonstration showing thermal runaway containment with the KnightTek dual-agent system.',
   NULL, NULL, 'https://www.youtube.com/watch?v=0uMmqji6sg0', NULL, NULL, 'published', now()),
  ('video', 'KnightTek Burn Demonstration 5', 'knighttek-burn-demonstration-5',
   'Burn demonstration showing thermal runaway containment with the KnightTek dual-agent system.',
   NULL, NULL, 'https://www.youtube.com/watch?v=pdsO9bsEz9E', NULL, NULL, 'published', now());