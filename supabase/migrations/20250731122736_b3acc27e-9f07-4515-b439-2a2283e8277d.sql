-- Create shows table
CREATE TABLE public.shows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  host TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_profiles table for admin users
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'DJ',
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create station_settings table
CREATE TABLE public.station_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  station_name TEXT NOT NULL DEFAULT 'Your Radio Station',
  tagline TEXT NOT NULL DEFAULT 'The best music, all day long',
  description TEXT NOT NULL DEFAULT 'Your favorite radio station...',
  stream_url TEXT NOT NULL DEFAULT 'https://stream.yourstation.com/live',
  backup_stream_url TEXT DEFAULT 'https://backup.yourstation.com/live',
  bitrate TEXT NOT NULL DEFAULT '128kbps',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.station_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for shows (allow all authenticated users to manage shows)
CREATE POLICY "Authenticated users can view shows" 
ON public.shows 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert shows" 
ON public.shows 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update shows" 
ON public.shows 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete shows" 
ON public.shows 
FOR DELETE 
TO authenticated
USING (true);

-- Create policies for user_profiles
CREATE POLICY "Authenticated users can view user_profiles" 
ON public.user_profiles 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert user_profiles" 
ON public.user_profiles 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update user_profiles" 
ON public.user_profiles 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete user_profiles" 
ON public.user_profiles 
FOR DELETE 
TO authenticated
USING (true);

-- Create policies for station_settings
CREATE POLICY "Authenticated users can view station_settings" 
ON public.station_settings 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update station_settings" 
ON public.station_settings 
FOR UPDATE 
TO authenticated
USING (true);

-- Insert default station settings
INSERT INTO public.station_settings (station_name, tagline, description, stream_url, backup_stream_url, bitrate)
VALUES ('Your Radio Station', 'The best music, all day long', 'Your favorite radio station...', 'https://stream.yourstation.com/live', 'https://backup.yourstation.com/live', '128kbps');

-- Insert sample shows
INSERT INTO public.shows (title, host, time_slot, status) VALUES
('Morning Drive', 'John Smith', '06:00 - 09:00', 'Live'),
('Lunch Break', 'Sarah Johnson', '12:00 - 14:00', 'Upcoming'),
('Evening Mix', 'Mike Davis', '18:00 - 20:00', 'Scheduled');

-- Insert sample user profiles
INSERT INTO public.user_profiles (name, email, role, status) VALUES
('John Smith', 'john@station.com', 'DJ', 'Active'),
('Sarah Johnson', 'sarah@station.com', 'Host', 'Active'),
('Mike Davis', 'mike@station.com', 'Producer', 'Inactive');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_shows_updated_at
BEFORE UPDATE ON public.shows
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_station_settings_updated_at
BEFORE UPDATE ON public.station_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();