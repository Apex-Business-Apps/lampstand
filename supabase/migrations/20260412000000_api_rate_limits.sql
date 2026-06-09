-- Rate limiting table for AI/TTS edge functions
-- bucket_key: 'user:<uuid>' for authenticated, 'ip:<address>' for anonymous
-- window_start: truncated to day (midnight UTC) for daily limits
CREATE TABLE public.api_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bucket_key TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(bucket_key, endpoint, window_start)
);

-- Only the service role (used by edge functions) can write to this table.
-- No user-facing RLS policies: this table is internal bookkeeping only.
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Purge records older than 7 days to keep the table small
CREATE OR REPLACE FUNCTION public.purge_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.api_rate_limits
  WHERE window_start < now() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
