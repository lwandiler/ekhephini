-- Add recording stream URL field to station settings
ALTER TABLE public.station_settings 
ADD COLUMN recording_stream_url TEXT;