DO $$
DECLARE
  products_id UUID;
BEGIN
  IF EXISTS (SELECT 1 FROM public.nav_items WHERE location = 'header') THEN
    RETURN;
  END IF;

  INSERT INTO public.nav_items (label, url, location, sort_order) VALUES
    ('Home', '/', 'header', 0);

  INSERT INTO public.nav_items (label, url, location, sort_order)
    VALUES ('Products', '/products', 'header', 10)
    RETURNING id INTO products_id;

  INSERT INTO public.nav_items (label, url, parent_id, location, sort_order) VALUES
    ('All Products',       '/products',                products_id, 'header', 0),
    ('Thermal Stop™',      '/products/thermal-stop',   products_id, 'header', 10),
    ('Thermal Shield™',    '/products/thermal-shield', products_id, 'header', 20),
    ('Suppressit™',        '/products/suppressit',     products_id, 'header', 30),
    ('Fire Quit™',         '/products/fire-quit',      products_id, 'header', 40),
    ('Elixir 5™',          '/products/elixir-5',       products_id, 'header', 50),
    ('Product Comparison', '/products/comparison',     products_id, 'header', 60);

  INSERT INTO public.nav_items (label, url, location, sort_order) VALUES
    ('Industries',   '/industries',   'header', 20),
    ('Distributors', '/distributors', 'header', 30),
    ('Media',        '/publications', 'header', 40),
    ('About',        '/about',        'header', 50),
    ('Contact',      '/contact',      'header', 60);
END $$;