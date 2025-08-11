-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user has admin role in profiles table
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop the existing overly permissive update policy
DROP POLICY IF EXISTS "Authenticated users can update station_settings" ON public.station_settings;

-- Create new restrictive policy for updates - only admins can modify
CREATE POLICY "Only admin users can update station_settings" 
ON public.station_settings 
FOR UPDATE 
USING (public.is_admin_user());

-- Keep the existing select policy as is (all authenticated users can view)
-- This is needed for the radio player to function properly