DROP POLICY IF EXISTS "Portfolio admin manages testimonials" ON public.client_testimonials;
CREATE POLICY "Portfolio admin manages testimonials"
ON public.client_testimonials
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email') = 'garciarobertrich@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'garciarobertrich@gmail.com');

DROP POLICY IF EXISTS "Portfolio admin uploads testimonial photos" ON storage.objects;
CREATE POLICY "Portfolio admin uploads testimonial photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'testimonial-media'
  AND (storage.foldername(name))[1] = 'admin'
  AND (auth.jwt() ->> 'email') = 'garciarobertrich@gmail.com'
);
