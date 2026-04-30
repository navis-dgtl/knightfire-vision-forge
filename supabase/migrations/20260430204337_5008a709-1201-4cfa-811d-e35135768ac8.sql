-- Lock down has_role: only authenticated users (and the postgres role) may execute it
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

-- Tighten public INSERT policies with content guards
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(email) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(first_name) BETWEEN 1 AND 100
    AND char_length(last_name) BETWEEN 1 AND 100
    AND char_length(phone) BETWEEN 1 AND 50
    AND (company IS NULL OR char_length(company) <= 200)
    AND (details IS NULL OR char_length(details) <= 5000)
    AND coalesce(array_length(products, 1), 0) <= 20
  );

DROP POLICY IF EXISTS "Anyone can submit distributor application" ON public.distributor_applications;
CREATE POLICY "Anyone can submit distributor application"
  ON public.distributor_applications FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(email) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(first_name) BETWEEN 1 AND 100
    AND char_length(last_name) BETWEEN 1 AND 100
    AND char_length(phone) BETWEEN 1 AND 50
    AND char_length(company) BETWEEN 1 AND 200
    AND (job_title IS NULL OR char_length(job_title) <= 150)
    AND (country IS NULL OR char_length(country) <= 100)
    AND (experience IS NULL OR char_length(experience) <= 5000)
    AND (additional_info IS NULL OR char_length(additional_info) <= 5000)
    AND coalesce(array_length(markets, 1), 0) <= 50
  );

DROP POLICY IF EXISTS "Anyone can request brochure" ON public.brochure_requests;
CREATE POLICY "Anyone can request brochure"
  ON public.brochure_requests FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(email) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(first_name) BETWEEN 1 AND 100
    AND char_length(last_name) BETWEEN 1 AND 100
    AND char_length(phone) BETWEEN 1 AND 50
    AND char_length(company) BETWEEN 1 AND 200
    AND (job_title IS NULL OR char_length(job_title) <= 150)
    AND (intended_use IS NULL OR char_length(intended_use) <= 5000)
  );