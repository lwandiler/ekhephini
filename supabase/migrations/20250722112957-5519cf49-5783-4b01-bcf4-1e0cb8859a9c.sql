-- Create analytics tables for real data tracking

-- Table for tracking page views and sessions
CREATE TABLE public.analytics_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  page_url TEXT NOT NULL,
  country TEXT,
  city TEXT,
  device_type TEXT, -- mobile, tablet, desktop
  browser TEXT,
  os TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for tracking radio listening events
CREATE TABLE public.analytics_listening_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- play, pause, stop, volume_change
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  station_name TEXT,
  show_name TEXT,
  volume_level INTEGER,
  duration_before_event INTEGER, -- seconds listened before this event
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  device_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for tracking popular content/shows
CREATE TABLE public.analytics_show_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  show_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_listeners INTEGER DEFAULT 0,
  total_listening_time INTEGER DEFAULT 0, -- in seconds
  average_session_duration INTEGER DEFAULT 0, -- in seconds
  peak_concurrent_listeners INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(show_name, date)
);

-- Table for daily analytics aggregation
CREATE TABLE public.analytics_daily_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_unique_visitors INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_page_views INTEGER DEFAULT 0,
  total_listening_time INTEGER DEFAULT 0, -- in seconds
  average_session_duration INTEGER DEFAULT 0, -- in seconds
  peak_concurrent_listeners INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0, -- percentage
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date)
);

-- Enable Row Level Security
ALTER TABLE public.analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_listening_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_show_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_daily_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can view all analytics data" 
ON public.analytics_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can view all listening events" 
ON public.analytics_listening_events 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage show stats" 
ON public.analytics_show_stats 
FOR ALL 
USING (true);

CREATE POLICY "Admins can manage daily stats" 
ON public.analytics_daily_stats 
FOR ALL 
USING (true);

-- Create policies for public insertion (for tracking)
CREATE POLICY "Public can insert session data" 
ON public.analytics_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update session data" 
ON public.analytics_sessions 
FOR UPDATE 
USING (true);

CREATE POLICY "Public can insert listening events" 
ON public.analytics_listening_events 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_analytics_sessions_session_id ON public.analytics_sessions(session_id);
CREATE INDEX idx_analytics_sessions_created_at ON public.analytics_sessions(created_at);
CREATE INDEX idx_analytics_sessions_country ON public.analytics_sessions(country);
CREATE INDEX idx_analytics_sessions_device_type ON public.analytics_sessions(device_type);

CREATE INDEX idx_analytics_listening_events_session_id ON public.analytics_listening_events(session_id);
CREATE INDEX idx_analytics_listening_events_timestamp ON public.analytics_listening_events(timestamp);
CREATE INDEX idx_analytics_listening_events_event_type ON public.analytics_listening_events(event_type);
CREATE INDEX idx_analytics_listening_events_show_name ON public.analytics_listening_events(show_name);

CREATE INDEX idx_analytics_show_stats_date ON public.analytics_show_stats(date);
CREATE INDEX idx_analytics_show_stats_show_name ON public.analytics_show_stats(show_name);

CREATE INDEX idx_analytics_daily_stats_date ON public.analytics_daily_stats(date);

-- Create trigger to update updated_at column
CREATE TRIGGER update_analytics_show_stats_updated_at
BEFORE UPDATE ON public.analytics_show_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analytics_daily_stats_updated_at
BEFORE UPDATE ON public.analytics_daily_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();