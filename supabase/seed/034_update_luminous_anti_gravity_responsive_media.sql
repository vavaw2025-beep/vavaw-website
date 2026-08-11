-- 034_update_luminous_anti_gravity_responsive_media.sql
-- Seed default antiGravity responsive media settings for Luminous Set if missing

UPDATE public.content_blocks
SET content = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          content,
          '{antiGravity, desktopMediaSlot}',
          COALESCE(content->'antiGravity'->'desktopMediaSlot', '"cosmetic-luminous-anti-gravity-desktop"'::jsonb)
        ),
        '{antiGravity, mobileMediaSlot}',
        COALESCE(content->'antiGravity'->'mobileMediaSlot', '"cosmetic-luminous-anti-gravity-mobile"'::jsonb)
      ),
      '{antiGravity, desktopImageMode}',
      COALESCE(content->'antiGravity'->'desktopImageMode', '"cover"'::jsonb)
    ),
    '{antiGravity, desktopObjectPosition}',
    COALESCE(content->'antiGravity'->'desktopObjectPosition', '"center center"'::jsonb)
  ),
  '{antiGravity, mobileObjectPosition}',
  COALESCE(content->'antiGravity'->'mobileObjectPosition', '"center top"'::jsonb)
)
WHERE block_type = 'cosmetic-product-landing-luminous-set'
  AND site_key = 'main'
  AND content->'antiGravity' IS NOT NULL;
