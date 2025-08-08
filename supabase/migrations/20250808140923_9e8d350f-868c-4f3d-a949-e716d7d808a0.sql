-- Create a table for storing social media links and contact information
CREATE TABLE public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  display_name TEXT,
  icon_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Create policies for social links
CREATE POLICY "Anyone can view social links" 
ON public.social_links 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can manage social links" 
ON public.social_links 
FOR ALL
USING (true);

-- Insert default social media links
INSERT INTO public.social_links (platform, url, display_name, icon_name) VALUES
('facebook', 'https://facebook.com/ekhephinifm', 'Facebook', 'Facebook'),
('twitter', 'https://twitter.com/ekhephinifm', 'Twitter', 'Twitter'),
('instagram', 'https://instagram.com/ekhephinifm', 'Instagram', 'Instagram'),
('youtube', 'https://youtube.com/ekhephinifm', 'YouTube', 'Youtube');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_social_links_updated_at
BEFORE UPDATE ON public.social_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();