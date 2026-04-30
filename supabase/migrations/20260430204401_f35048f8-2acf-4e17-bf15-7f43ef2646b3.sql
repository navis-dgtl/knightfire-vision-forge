-- Drop the old INSERT policy so we can add new required-field columns first
DROP POLICY IF EXISTS "Anyone can submit distributor application" ON public.distributor_applications;

-- Drop columns we no longer use; add the rich set the form actually collects
ALTER TABLE public.distributor_applications
  DROP COLUMN IF EXISTS first_name,
  DROP COLUMN IF EXISTS last_name,
  DROP COLUMN IF EXISTS phone,
  DROP COLUMN IF EXISTS country,
  DROP COLUMN IF EXISTS experience,
  DROP COLUMN IF EXISTS additional_info,
  DROP COLUMN IF EXISTS company,
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS job_title;

ALTER TABLE public.distributor_applications
  ADD COLUMN business_name TEXT NOT NULL,
  ADD COLUMN business_address TEXT NOT NULL,
  ADD COLUMN website TEXT,
  ADD COLUMN business_phone TEXT NOT NULL,
  ADD COLUMN contact_name TEXT NOT NULL,
  ADD COLUMN contact_title TEXT NOT NULL,
  ADD COLUMN contact_phone TEXT NOT NULL,
  ADD COLUMN contact_email TEXT NOT NULL,
  ADD COLUMN linkedin TEXT,
  ADD COLUMN year_established TEXT NOT NULL,
  ADD COLUMN employees TEXT NOT NULL,
  ADD COLUMN territory TEXT NOT NULL,
  ADD COLUMN company_profile TEXT NOT NULL;

CREATE POLICY "Anyone can submit distributor application"
  ON public.distributor_applications FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(contact_email) BETWEEN 3 AND 255
    AND contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(business_name) BETWEEN 1 AND 200
    AND char_length(business_address) BETWEEN 1 AND 500
    AND char_length(business_phone) BETWEEN 1 AND 50
    AND char_length(contact_name) BETWEEN 1 AND 150
    AND char_length(contact_title) BETWEEN 1 AND 150
    AND char_length(contact_phone) BETWEEN 1 AND 50
    AND char_length(year_established) BETWEEN 1 AND 20
    AND char_length(employees) BETWEEN 1 AND 50
    AND char_length(territory) BETWEEN 1 AND 500
    AND char_length(company_profile) BETWEEN 1 AND 5000
    AND (website IS NULL OR char_length(website) <= 500)
    AND (linkedin IS NULL OR char_length(linkedin) <= 500)
    AND coalesce(array_length(markets, 1), 0) <= 50
    AND us_confirmed = true
  );