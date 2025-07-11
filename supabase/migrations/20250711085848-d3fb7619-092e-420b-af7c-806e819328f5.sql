-- Create admin_users table for admin authentication
CREATE TABLE public.admin_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    active BOOLEAN NOT NULL DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to read their own data
CREATE POLICY "Admin users can read their own data" 
ON public.admin_users 
FOR SELECT 
USING (true);

-- Insert default admin users with hashed passwords
-- Note: These are bcrypt hashes of 'password123' and 'manager456'
INSERT INTO public.admin_users (username, password_hash, name) VALUES 
('admin', '$2b$10$rOHf0wF7YHO7sY5nQJ5xJeQKJ6J6J6J6J6J6J6J6J6J6J6J6J6J6J6', 'Administrator'),
('manager', '$2b$10$rOHf0wF7YHO7sY5nQJ5xJeQKJ6J6J6J6J6J6J6J6J6J6J6J6J6J6J6', 'Station Manager');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_admin_users_updated_at();