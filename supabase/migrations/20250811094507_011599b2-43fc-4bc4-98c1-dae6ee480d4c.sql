-- Add public access policies for podcasts and shows (they should be publicly viewable)
DROP POLICY IF EXISTS "Authenticated users can view podcasts" ON public.podcasts;
DROP POLICY IF EXISTS "Authenticated users can view shows" ON public.shows;

-- Create public access policies for podcasts
CREATE POLICY "Anyone can view podcasts" 
ON public.podcasts 
FOR SELECT 
USING (true);

-- Create public access policies for shows  
CREATE POLICY "Anyone can view shows" 
ON public.shows 
FOR SELECT 
USING (true);

-- Keep authenticated-only policies for data modification
CREATE POLICY "Authenticated users can modify podcasts" 
ON public.podcasts 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can modify shows" 
ON public.shows 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);