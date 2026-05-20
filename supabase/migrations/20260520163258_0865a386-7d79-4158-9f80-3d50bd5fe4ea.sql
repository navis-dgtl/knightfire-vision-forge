
-- ANNOUNCEMENT BANNERS
CREATE TABLE public.announcement_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  link_url TEXT,
  link_label TEXT,
  background_color TEXT,
  text_color TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.announcement_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active banners are public" ON public.announcement_banners
  FOR SELECT TO anon, authenticated
  USING (is_active = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (ends_at IS NULL OR ends_at > now()));
CREATE POLICY "Admins view all banners" ON public.announcement_banners
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage banners" ON public.announcement_banners
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_announcement_banners_updated
  BEFORE UPDATE ON public.announcement_banners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- HERO SLIDES
CREATE TABLE public.hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  subtitle TEXT,
  image_url TEXT,
  cta_label TEXT,
  cta_url TEXT,
  secondary_cta_label TEXT,
  secondary_cta_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active hero slides are public" ON public.hero_slides
  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins view all hero slides" ON public.hero_slides
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage hero slides" ON public.hero_slides
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_hero_slides_updated
  BEFORE UPDATE ON public.hero_slides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SITE SETTINGS (key/value JSON)
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site settings are public" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage site settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_site_settings_updated
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CUSTOM PAGES (admin-authored, block-based)
CREATE TYPE public.page_status AS ENUM ('draft', 'published');
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  og_image_url TEXT,
  status public.page_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  author_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published pages are public" ON public.pages
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Admins view all pages" ON public.pages
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage pages" ON public.pages
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_pages_updated
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_pages_slug ON public.pages(slug);

-- NAVIGATION ITEMS
CREATE TABLE public.nav_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  url TEXT,
  page_id UUID REFERENCES public.pages(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES public.nav_items(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  opens_new_tab BOOLEAN NOT NULL DEFAULT false,
  location TEXT NOT NULL DEFAULT 'header',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visible nav items are public" ON public.nav_items
  FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "Admins view all nav items" ON public.nav_items
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage nav items" ON public.nav_items
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_nav_items_updated
  BEFORE UPDATE ON public.nav_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_nav_items_parent ON public.nav_items(parent_id);
CREATE INDEX idx_nav_items_location_sort ON public.nav_items(location, sort_order);
