-- Create ads table for advertisement management
CREATE TABLE public.ads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title character varying NOT NULL,
  description text,
  image_url text,
  click_url text,
  position character varying NOT NULL DEFAULT 'banner',
  active boolean DEFAULT true,
  priority integer DEFAULT 0,
  start_date date,
  end_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Create policies for ads
CREATE POLICY "Admins can manage ads" 
  ON public.ads 
  FOR ALL 
  USING (true);

-- Create policy for public to view active ads
CREATE POLICY "Public can view active ads" 
  ON public.ads 
  FOR SELECT 
  USING (active = true AND (start_date IS NULL OR start_date <= CURRENT_DATE) AND (end_date IS NULL OR end_date >= CURRENT_DATE));

-- Create indexes for better performance
CREATE INDEX idx_ads_active ON public.ads(active);
CREATE INDEX idx_ads_position ON public.ads(position);
CREATE INDEX idx_ads_dates ON public.ads(start_date, end_date);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ads_updated_at
  BEFORE UPDATE ON public.ads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();