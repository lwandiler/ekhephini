
-- Create a storage bucket for banner media files
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'Media Files', true);

-- Set up access policies for the media bucket
CREATE POLICY "Allow public access to media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'media');

CREATE POLICY "Allow authenticated users to upload media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
