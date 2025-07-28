-- Create ad clicks tracking table
CREATE TABLE public.ad_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id UUID NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  device_type TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ad_clicks ENABLE ROW LEVEL SECURITY;

-- Create policies for ad clicks
CREATE POLICY "Public can record ad clicks" 
ON public.ad_clicks 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view ad clicks" 
ON public.ad_clicks 
FOR SELECT 
USING (true);

-- Create content interactions table for likes/views
CREATE TABLE public.content_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type VARCHAR NOT NULL CHECK (content_type IN ('podcast', 'show', 'blog_post')),
  content_id UUID NOT NULL,
  interaction_type VARCHAR NOT NULL CHECK (interaction_type IN ('like', 'view', 'play')),
  session_id TEXT NOT NULL,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  device_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for content interactions
CREATE POLICY "Public can record content interactions" 
ON public.content_interactions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view content interactions" 
ON public.content_interactions 
FOR SELECT 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_ad_clicks_ad_id ON public.ad_clicks(ad_id);
CREATE INDEX idx_ad_clicks_clicked_at ON public.ad_clicks(clicked_at);
CREATE INDEX idx_content_interactions_content ON public.content_interactions(content_type, content_id);
CREATE INDEX idx_content_interactions_type ON public.content_interactions(interaction_type);
CREATE INDEX idx_content_interactions_created_at ON public.content_interactions(created_at);