-- Waitlist reliability: store name, founder export RPC, keep public join safe

ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS name text;

CREATE OR REPLACE FUNCTION public.join_waitlist(
  p_email text,
  p_source text DEFAULT 'hero',
  p_name text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_email text := lower(trim(p_email));
  v_name text := nullif(trim(coalesce(p_name, '')), '');
  v_position bigint;
  v_row_count integer;
BEGIN
  IF v_email IS NULL OR v_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$' THEN
    RETURN json_build_object('ok', false, 'error', 'invalid_email');
  END IF;

  INSERT INTO public.waitlist (email, source, name)
  VALUES (
    v_email,
    coalesce(nullif(trim(p_source), ''), 'hero'),
    v_name
  )
  ON CONFLICT ((lower(email))) DO NOTHING;

  GET DIAGNOSTICS v_row_count = ROW_COUNT;

  IF v_row_count = 0 AND v_name IS NOT NULL THEN
    UPDATE public.waitlist
    SET name = coalesce(name, v_name)
    WHERE lower(email) = v_email;
  END IF;

  SELECT count(*)::bigint INTO v_position
  FROM public.waitlist w
  WHERE w.created_at <= (
    SELECT created_at FROM public.waitlist WHERE lower(email) = v_email LIMIT 1
  );

  RETURN json_build_object(
    'ok', true,
    'duplicate', v_row_count = 0,
    'position', v_position,
    'total', (SELECT count(*)::bigint FROM public.waitlist)
  );
END;
$$;

-- Founder-only export. Secret must match waitlist-admin.html
CREATE OR REPLACE FUNCTION public.list_waitlist_entries(p_secret text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF p_secret IS DISTINCT FROM 'regrade-waitlist-export-2026' THEN
    RETURN json_build_object('ok', false, 'error', 'unauthorized');
  END IF;

  RETURN json_build_object(
    'ok', true,
    'total', (SELECT count(*)::bigint FROM public.waitlist),
    'entries', coalesce((
      SELECT json_agg(row_to_json(x) ORDER BY x.created_at ASC)
      FROM (
        SELECT
          id,
          email,
          name,
          source,
          created_at
        FROM public.waitlist
        ORDER BY created_at ASC
      ) x
    ), '[]'::json)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_waitlist(text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.join_waitlist(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.list_waitlist_entries(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_waitlist_stats() TO anon;
