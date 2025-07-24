-- Create ad_requests table for people to request ad placement
CREATE TABLE public.ad_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name VARCHAR NOT NULL,
  contact_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  website_url TEXT,
  ad_type VARCHAR NOT NULL, -- banner, sidebar, etc.
  message TEXT,
  budget_range VARCHAR,
  preferred_duration VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'pending', -- pending, approved, rejected, contacted
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ad_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can submit ad requests" 
ON public.ad_requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all ad requests" 
ON public.ad_requests 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update ad requests" 
ON public.ad_requests 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete ad requests" 
ON public.ad_requests 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ad_requests_updated_at
BEFORE UPDATE ON public.ad_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();