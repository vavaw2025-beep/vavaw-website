-- ============================================================
-- 041_fix_luminous_science_full_bleed_artwork.sql
--
-- NON-DESTRUCTIVE update for content_blocks of type
-- 'cosmetic-product-landing-luminous-set' on site 'main'.
--
-- Sets skinBarrier.mediaRenderType and mg3Plus.mediaRenderType
-- to 'full-bleed-artwork' ONLY when the field is:
--   • missing (key does not exist), OR
--   • currently equal to 'diagram'
--
-- Does NOT touch any other fields, text, media slots,
-- or media_assets.
-- ============================================================

UPDATE content_blocks
SET content = jsonb_set(
                jsonb_set(
                  content,
                  '{skinBarrier,mediaRenderType}',
                  '"full-bleed-artwork"',
                  true   -- create key if missing
                ),
                '{mg3Plus,mediaRenderType}',
                '"full-bleed-artwork"',
                true   -- create key if missing
              )
WHERE block_type = 'cosmetic-product-landing-luminous-set'
  AND site_key   = 'main'
  AND (
    -- skinBarrier.mediaRenderType is missing or 'diagram'
    (
      content -> 'skinBarrier' ->> 'mediaRenderType' IS NULL
      OR content -> 'skinBarrier' ->> 'mediaRenderType' = 'diagram'
    )
    OR
    -- mg3Plus.mediaRenderType is missing or 'diagram'
    (
      content -> 'mg3Plus' ->> 'mediaRenderType' IS NULL
      OR content -> 'mg3Plus' ->> 'mediaRenderType' = 'diagram'
    )
  );
