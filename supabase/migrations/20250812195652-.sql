-- Create public bucket for show images if it doesn't exist
insert into storage.buckets (id, name, public)
values ('show-images', 'show-images', true)
on conflict (id) do nothing;

-- Conditionally create policies for 'show-images' bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public can view show images'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Public can view show images"
      ON storage.objects
      FOR SELECT
      USING (bucket_id = 'show-images');
    $$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can upload show images'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Authenticated users can upload show images"
      ON storage.objects
      FOR INSERT
      WITH CHECK (bucket_id = 'show-images' AND auth.role() = 'authenticated');
    $$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can update show images'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Authenticated users can update show images"
      ON storage.objects
      FOR UPDATE
      USING (bucket_id = 'show-images' AND auth.role() = 'authenticated')
      WITH CHECK (bucket_id = 'show-images' AND auth.role() = 'authenticated');
    $$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can delete show images'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Authenticated users can delete show images"
      ON storage.objects
      FOR DELETE
      USING (bucket_id = 'show-images' AND auth.role() = 'authenticated');
    $$;
  END IF;
END$$;