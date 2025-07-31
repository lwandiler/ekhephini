-- Add new columns to shows table
ALTER TABLE public.shows 
ADD COLUMN IF NOT EXISTS day_of_week TEXT,
ADD COLUMN IF NOT EXISTS start_time TEXT,
ADD COLUMN IF NOT EXISTS end_time TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update existing records to have some default values
UPDATE public.shows 
SET 
  day_of_week = 'Monday',
  start_time = CASE 
    WHEN time_slot LIKE '%06:00%' THEN '06:00'
    WHEN time_slot LIKE '%12:00%' THEN '12:00'
    WHEN time_slot LIKE '%18:00%' THEN '18:00'
    ELSE '09:00'
  END,
  end_time = CASE 
    WHEN time_slot LIKE '%09:00%' THEN '09:00'
    WHEN time_slot LIKE '%14:00%' THEN '14:00'
    WHEN time_slot LIKE '%20:00%' THEN '20:00'
    ELSE '12:00'
  END,
  description = 'Great show with amazing content and entertainment for our listeners.'
WHERE day_of_week IS NULL;