-- Fix security vulnerability: Restrict user_profiles access to own data only
DROP POLICY IF EXISTS "Authenticated users can view user_profiles" ON public.user_profiles;

-- Create secure policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile only" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Also update other policies to be more secure
DROP POLICY IF EXISTS "Authenticated users can update user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Authenticated users can insert user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Authenticated users can delete user_profiles" ON public.user_profiles;

-- Allow users to update only their own profile
CREATE POLICY "Users can update their own profile only" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow users to insert only their own profile
CREATE POLICY "Users can insert their own profile only" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete only their own profile
CREATE POLICY "Users can delete their own profile only" 
ON public.user_profiles 
FOR DELETE 
USING (auth.uid() = user_id);