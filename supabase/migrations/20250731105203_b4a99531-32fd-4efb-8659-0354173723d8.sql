-- First, set all show_id references in recorded_shows to NULL
UPDATE public.recorded_shows SET show_id = NULL WHERE show_id IS NOT NULL;

-- Then delete all shows
DELETE FROM public.shows;