ALTER TABLE public.client_testimonials
  ADD COLUMN IF NOT EXISTS testimonial_type text NOT NULL DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS consent_at timestamptz;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'client_testimonials_testimonial_type_check'
      AND conrelid = 'public.client_testimonials'::regclass
  ) THEN
    ALTER TABLE public.client_testimonials
      ADD CONSTRAINT client_testimonials_testimonial_type_check
      CHECK (testimonial_type IN ('text', 'video'));
  END IF;
END $$;

UPDATE public.client_testimonials
SET status = 'submitted', is_featured = false
WHERE rating < 4 AND (status = 'approved' OR is_featured = true);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'testimonial-media',
  'testimonial-media',
  false,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']::text[]
)
ON CONFLICT (id) DO UPDATE
SET public = false,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Allow client update by token" ON public.client_testimonials;
DROP POLICY IF EXISTS "Allow full access to service_role and authenticated" ON public.client_testimonials;
DROP POLICY IF EXISTS "Allow public read featured testimonials" ON public.client_testimonials;
DROP POLICY IF EXISTS "Allow insert testimonial request" ON public.client_testimonials;
DROP POLICY IF EXISTS "Allow read token for submission" ON public.client_testimonials;
DROP POLICY IF EXISTS "Public can read approved testimonials" ON public.client_testimonials;
DROP POLICY IF EXISTS "Portfolio admin manages testimonials" ON public.client_testimonials;

CREATE POLICY "Public can read approved testimonials"
ON public.client_testimonials
FOR SELECT
TO anon, authenticated
USING (status = 'approved' AND is_featured = true AND rating >= 4);

CREATE POLICY "Portfolio admin manages testimonials"
ON public.client_testimonials
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email') = 'digitalmerch4862@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'digitalmerch4862@gmail.com');

DROP POLICY IF EXISTS "Portfolio admin uploads testimonial photos" ON storage.objects;
CREATE POLICY "Portfolio admin uploads testimonial photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'testimonial-media'
  AND (storage.foldername(name))[1] = 'admin'
  AND (auth.jwt() ->> 'email') = 'digitalmerch4862@gmail.com'
);
