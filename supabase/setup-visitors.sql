-- Run once in Supabase: SQL Editor → New query → paste → Run
-- Tracks unique website visitors (one row per browser ID).

create table if not exists public.site_visitors (
  visitor_id uuid primary key,
  first_seen_at timestamptz not null default timezone('utc', now()),
  landing_path text not null default '/'
);

alter table public.site_visitors enable row level security;

-- Block direct table access; use RPC functions below.
revoke all on table public.site_visitors from anon, authenticated;

create or replace function public.register_visitor(
  p_visitor_id uuid,
  p_path text default '/'
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  row_count integer;
  total_count bigint;
begin
  if p_visitor_id is null then
    raise exception 'visitor_id required';
  end if;

  insert into public.site_visitors (visitor_id, landing_path)
  values (
    p_visitor_id,
    coalesce(nullif(trim(p_path), ''), '/')
  )
  on conflict (visitor_id) do nothing;

  get diagnostics row_count = row_count;

  select count(*)::bigint into total_count from public.site_visitors;

  return json_build_object(
    'registered', row_count > 0,
    'total', total_count
  );
end;
$$;

create or replace function public.get_visitor_stats()
returns json
language plpgsql
security definer
set search_path = public
as $$
begin
  return json_build_object(
    'total', (select count(*)::bigint from public.site_visitors),
    'today', (
      select count(*)::bigint
      from public.site_visitors
      where first_seen_at >= date_trunc('day', timezone('utc', now()))
    ),
    'week', (
      select count(*)::bigint
      from public.site_visitors
      where first_seen_at >= date_trunc('day', timezone('utc', now())) - interval '7 days'
    ),
    'updated_at', timezone('utc', now())
  );
end;
$$;

revoke all on function public.register_visitor(uuid, text) from public;
grant execute on function public.register_visitor(uuid, text) to anon, authenticated;

revoke all on function public.get_visitor_stats() from public;
grant execute on function public.get_visitor_stats() to anon, authenticated;
