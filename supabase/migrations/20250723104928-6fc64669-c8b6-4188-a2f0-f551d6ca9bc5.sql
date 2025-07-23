-- Add duration and rotation fields to ads table
ALTER TABLE public.ads 
ADD COLUMN display_duration_seconds INTEGER DEFAULT 30,
ADD COLUMN last_rotation_time TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add comment to explain the duration field
COMMENT ON COLUMN public.ads.display_duration_seconds IS 'How long this ad should be displayed before rotating to next ad, in seconds';
COMMENT ON COLUMN public.ads.last_rotation_time IS 'Timestamp when this ad was last shown for rotation logic';