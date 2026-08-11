-- 033_add_luminous_anti_gravity_visibility_flags.sql
-- Seed default antiGravity visibility flags for Luminous Set if missing

UPDATE public.content_blocks
SET content = jsonb_set(
  jsonb_set(
    content,
    '{antiGravity, showHeadline}',
    COALESCE(content->'antiGravity'->'showHeadline', 'true'::jsonb)
  ),
  '{antiGravity, showDescription}',
  COALESCE(content->'antiGravity'->'showDescription', 'true'::jsonb)
)
WHERE block_type = 'cosmetic-product-landing-luminous-set'
  AND site_key = 'main'
  AND content->'antiGravity' IS NOT NULL;
