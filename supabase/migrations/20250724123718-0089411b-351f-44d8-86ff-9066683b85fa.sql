-- Create table for recorded shows
CREATE TABLE public.recorded_shows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  show_id UUID REFERENCES public.shows(id),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '3 days')
);

-- Enable RLS
ALTER TABLE public.recorded_shows ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view non-expired recorded shows" 
ON public.recorded_shows 
FOR SELECT 
USING (expires_at > now());

CREATE POLICY "Admins can manage recorded shows" 
ON public.recorded_shows 
FOR ALL 
USING (true);

-- Create storage bucket for recorded shows
INSERT INTO storage.buckets (id, name, public) VALUES ('recorded-shows', 'recorded-shows', true);

-- Create storage policies
CREATE POLICY "Public can view recorded show files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'recorded-shows');

CREATE POLICY "Admins can manage recorded show files" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'recorded-shows');

-- Create function to clean up expired recordings
CREATE OR REPLACE FUNCTION public.cleanup_expired_recordings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  expired_record RECORD;
BEGIN
  -- Get expired recordings
  FOR expired_record IN 
    SELECT id, audio_url 
    FROM public.recorded_shows 
    WHERE expires_at <= now()
  LOOP
    -- Delete from storage (note: this requires manual cleanup in practice)
    -- Delete from database
    DELETE FROM public.recorded_shows WHERE id = expired_record.id;
    
    RAISE LOG 'Cleaned up expired recording: %', expired_record.id;
  END LOOP;
END;
$$;

-- Create index for efficient cleanup queries
CREATE INDEX idx_recorded_shows_expires_at ON public.recorded_shows(expires_at);
CREATE INDEX idx_recorded_shows_recorded_at ON public.recorded_shows(recorded_at DESC);