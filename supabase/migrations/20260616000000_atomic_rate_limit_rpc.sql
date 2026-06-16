-- Atomic rate-limit increment: avoids race condition in upsert+update pattern.
-- Returns the new request_count after incrementing.
create or replace function increment_api_rate_limit(
  p_bucket_key text,
  p_endpoint text,
  p_window_start timestamptz
) returns integer
language plpgsql
security definer
as $$
declare
  v_count integer;
begin
  insert into api_rate_limits (bucket_key, endpoint, request_count, window_start)
  values (p_bucket_key, p_endpoint, 1, p_window_start)
  on conflict (bucket_key, endpoint, window_start)
  do update set request_count = api_rate_limits.request_count + 1
  returning request_count into v_count;
  return v_count;
end;
$$;
