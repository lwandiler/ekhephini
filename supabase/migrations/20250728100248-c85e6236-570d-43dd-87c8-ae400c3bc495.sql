-- Clear all existing analytics data to start fresh
TRUNCATE TABLE public.analytics_sessions CASCADE;
TRUNCATE TABLE public.analytics_listening_events CASCADE;
TRUNCATE TABLE public.analytics_daily_stats CASCADE;
TRUNCATE TABLE public.analytics_show_stats CASCADE;
TRUNCATE TABLE public.ad_clicks CASCADE;
TRUNCATE TABLE public.content_interactions CASCADE;

-- Reset any auto-incrementing sequences if they exist
-- Note: Our tables use UUIDs, so no sequences to reset

-- Verify tables are empty and ready for fresh data
SELECT 'analytics_sessions' as table_name, COUNT(*) as record_count FROM public.analytics_sessions
UNION ALL
SELECT 'analytics_listening_events' as table_name, COUNT(*) as record_count FROM public.analytics_listening_events
UNION ALL
SELECT 'analytics_daily_stats' as table_name, COUNT(*) as record_count FROM public.analytics_daily_stats
UNION ALL
SELECT 'analytics_show_stats' as table_name, COUNT(*) as record_count FROM public.analytics_show_stats
UNION ALL
SELECT 'ad_clicks' as table_name, COUNT(*) as record_count FROM public.ad_clicks
UNION ALL
SELECT 'content_interactions' as table_name, COUNT(*) as record_count FROM public.content_interactions;