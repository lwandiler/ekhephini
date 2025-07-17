
-- Create podcasts table
CREATE TABLE public.podcasts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title character varying NOT NULL,
  host character varying NOT NULL,
  description text,
  image_url text,
  duration character varying,
  publish_date date NOT NULL,
  episode_number integer,
  listen_url text,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage podcasts
CREATE POLICY "Admins can manage podcasts" 
  ON public.podcasts 
  FOR ALL 
  USING (true);

-- Create policy for public to view active podcasts
CREATE POLICY "Public can view active podcasts" 
  ON public.podcasts 
  FOR SELECT 
  USING (active = true);

-- Create index for better performance
CREATE INDEX idx_podcasts_active ON public.podcasts(active);
CREATE INDEX idx_podcasts_publish_date ON public.podcasts(publish_date DESC);
