-- Create public bucket for show images if it doesn't exist
insert into storage.buckets (id, name, public)
values ('show-images', 'show-images', true)
on conflict (id) do nothing;

-- Recreate policies for 'show-images' bucket safely
DROP POLICY IF EXISTS "Public can view show images" ON storage.objects;
CREATE POLICY "Public can view show images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'show-images');

DROP POLICY IF EXISTS "Authenticated users can upload show images" ON storage.objects;
CREATE POLICY "Authenticated users can upload show images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'show-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update show images" ON storage.objects;
CREATE POLICY "Authenticated users can update show images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'show-images' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'show-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete show images" ON storage.objects;
CREATE POLICY "Authenticated users can delete show images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'show-images' AND auth.role() = 'authenticated');