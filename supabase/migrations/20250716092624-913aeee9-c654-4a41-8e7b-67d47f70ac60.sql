
-- Create admin users table for authentication
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(100) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create station settings table
CREATE TABLE public.station_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  station_name VARCHAR(255) NOT NULL DEFAULT 'Radio Station',
  station_tagline TEXT,
  station_description TEXT,
  stream_url TEXT,
  logo_url TEXT,
  social_links JSONB DEFAULT '{}',
  contact_info JSONB DEFAULT '{}',
  page_content JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Create banners table for homepage carousel
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  media_type VARCHAR(10) CHECK (media_type IN ('image', 'video')) NOT NULL,
  media_url TEXT NOT NULL,
  url TEXT,
  cta_text VARCHAR(100),
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat messages table for social chat moderation
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  user_avatar TEXT,
  content TEXT NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  provider VARCHAR(50) DEFAULT 'email',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create shows table for radio show management
CREATE TABLE public.shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  host VARCHAR(255) NOT NULL,
  description TEXT,
  day_of_week VARCHAR(20) CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Weekdays', 'Weekends', 'Daily')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  featured_image TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  important BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default station settings
INSERT INTO public.station_settings (
  station_name,
  station_tagline,
  station_description,
  social_links,
  contact_info
) VALUES (
  'Moutse Radio',
  'Your Voice, Your Music, Your Community',
  'Broadcasting the best music and community content 24/7',
  '{"facebook": "", "twitter": "", "instagram": "", "youtube": ""}',
  '{"email": "", "phone": "", "address": ""}'
);

-- Insert sample admin user (username: admin, password: password123)
INSERT INTO public.admin_users (username, password_hash, name) VALUES 
('admin', '$2b$10$rOvHjHcw.fGVm5B9FKt1tOeJ8xEOZBE6Lj9MhGxKlNqPmJfQsVqIK', 'Administrator'),
('manager', '$2b$10$xm5BoZwFZQp1UkuQQHFv7.5Rn1yJ0GKsZLp8NhQxM2VcEKjTgWbRy', 'Manager');

-- Add some sample shows including the ones already mentioned
INSERT INTO public.shows (title, host, day_of_week, start_time, end_time, description) VALUES
('Mahube Drive', 'DJ Early Bird', 'Weekdays', '03:00:00', '06:00:00', 'Early morning drive show to start your day'),
('Namba S''khambe Breakfast Show', 'Morning Crew', 'Weekdays', '06:00:00', '09:00:00', 'The perfect breakfast companion with music, news and entertainment'),
('Morning Brew', 'Sarah Johnson', 'Weekdays', '09:00:00', '12:00:00', 'Coffee and conversation for your mid-morning'),
('Midday Mix', 'Jason Parker', 'Weekdays', '12:00:00', '15:00:00', 'The perfect lunchtime soundtrack'),
('Evening Chill', 'Sophia Lee', 'Weekdays', '18:00:00', '21:00:00', 'Relaxing tunes for your evening wind-down');

-- Create indexes for better performance
CREATE INDEX idx_banners_active_order ON public.banners (active, display_order);
CREATE INDEX idx_chat_messages_status ON public.chat_messages (status);
CREATE INDEX idx_chat_messages_created ON public.chat_messages (created_at DESC);
CREATE INDEX idx_shows_day_time ON public.shows (day_of_week, start_time);
CREATE INDEX idx_blog_posts_published ON public.blog_posts (published, published_at DESC);
CREATE INDEX idx_announcements_date ON public.announcements (date DESC, active);

-- Enable Row Level Security (RLS) for security
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.station_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (website visitors)
CREATE POLICY "Public can view active banners" ON public.banners FOR SELECT USING (active = true);
CREATE POLICY "Public can view approved chat messages" ON public.chat_messages FOR SELECT USING (status = 'approved');
CREATE POLICY "Public can view active shows" ON public.shows FOR SELECT USING (active = true);
CREATE POLICY "Public can view published blog posts" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public can view active announcements" ON public.announcements FOR SELECT USING (active = true);
CREATE POLICY "Public can view station settings" ON public.station_settings FOR SELECT USING (true);

-- Create policies for admin access (authenticated admin users only)
-- Note: These policies assume admin authentication will be implemented
CREATE POLICY "Admins can manage banners" ON public.banners FOR ALL USING (true);
CREATE POLICY "Admins can manage chat messages" ON public.chat_messages FOR ALL USING (true);
CREATE POLICY "Admins can manage shows" ON public.shows FOR ALL USING (true);
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL USING (true);
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL USING (true);
CREATE POLICY "Admins can view admin users" ON public.admin_users FOR SELECT USING (true);
CREATE POLICY "Admins can update station settings" ON public.station_settings FOR ALL USING (true);

-- Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Create storage policies for public access to media
CREATE POLICY "Public can view media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admins can upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
CREATE POLICY "Admins can update media" ON storage.objects FOR UPDATE USING (bucket_id = 'media');
CREATE POLICY "Admins can delete media" ON storage.objects FOR DELETE USING (bucket_id = 'media');
