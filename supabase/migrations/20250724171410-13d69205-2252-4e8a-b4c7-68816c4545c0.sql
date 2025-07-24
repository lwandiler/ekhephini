-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a cron job to run auto-record every minute
SELECT cron.schedule(
  'auto-record-shows',
  '* * * * *', -- Every minute
  $$
  SELECT
    net.http_post(
        url:='https://yfkdcqgmyyrcxppxcswz.supabase.co/functions/v1/auto-record-shows',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlma2RjcWdteXlyY3hwcHhjc3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NTc0OTcsImV4cCI6MjA2ODIzMzQ5N30.dlEDNLZa6kLz_BCiGC1JJX83ceYTRRNc8mn1R70sOIw"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);