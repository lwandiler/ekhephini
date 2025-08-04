-- Create podcasts table
CREATE TABLE public.podcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  podcast_link TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admins can manage podcasts)
CREATE POLICY "Authenticated users can view podcasts" 
ON public.podcasts 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert podcasts" 
ON public.podcasts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update podcasts" 
ON public.podcasts 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete podcasts" 
ON public.podcasts 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_podcasts_updated_at
BEFORE UPDATE ON public.podcasts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for podcast thumbnails
INSERT INTO storage.buckets (id, name, public) 
VALUES ('podcast-thumbnails', 'podcast-thumbnails', true);

-- Create storage policies for podcast thumbnails
CREATE POLICY "Anyone can view podcast thumbnails" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'podcast-thumbnails');

CREATE POLICY "Authenticated users can upload podcast thumbnails" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'podcast-thumbnails');

CREATE POLICY "Authenticated users can update podcast thumbnails" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'podcast-thumbnails');

CREATE POLICY "Authenticated users can delete podcast thumbnails" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'podcast-thumbnails');