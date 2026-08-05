-- Sync Lumiglow Sunscreen Into Missing Cosmetic Blocks Only
-- Appends Lumiglow Sunscreen to cosmetic-signature-collection and step 06 to cosmetic-daily-ritual if missing.

DO $$
DECLARE
  sig_block_id UUID;
  sig_content JSONB;
  has_sig_lumiglow BOOLEAN;

  rit_block_id UUID;
  rit_content JSONB;
  has_rit_lumiglow BOOLEAN;
BEGIN
  -- 1. Sync cosmetic-signature-collection
  SELECT id, content INTO sig_block_id, sig_content
  FROM content_blocks
  WHERE page_path = '/cosmetic' AND block_type = 'cosmetic-signature-collection'
  LIMIT 1;

  IF sig_block_id IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 
      FROM jsonb_array_elements(sig_content->'items') AS item
      WHERE item->>'name' = 'LUMIGLOW ROSY SHEER SUNSCREEN SPF50+/PA+++'
    ) INTO has_sig_lumiglow;

    IF NOT has_sig_lumiglow THEN
      UPDATE content_blocks
      SET 
        content = jsonb_set(
          sig_content,
          '{items}',
          (sig_content->'items') || '{
            "name": "LUMIGLOW ROSY SHEER SUNSCREEN SPF50+/PA+++",
            "type": "KEM CHỐNG NẮNG",
            "key": "Hybrid UV Filter · Niacinamide 2% · Bakuchiol · Sodium Hyaluronate",
            "description": "Kem chống nắng căng bóng dưỡng trắng, giúp bảo vệ da trước tia UV, nâng tone tự nhiên và hỗ trợ làn da sáng hồng khỏe mạnh.",
            "mediaSlot": "cosmetic-product-lumiglow-sunscreen"
          }'::jsonb
        ),
        updated_at = now()
      WHERE id = sig_block_id;
    END IF;
  END IF;

  -- 2. Sync cosmetic-daily-ritual
  SELECT id, content INTO rit_block_id, rit_content
  FROM content_blocks
  WHERE page_path = '/cosmetic' AND block_type = 'cosmetic-daily-ritual'
  LIMIT 1;

  IF rit_block_id IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 
      FROM jsonb_array_elements(rit_content->'items') AS item
      WHERE item->>'step' = '06' OR item->>'product' = 'LUMIGLOW ROSY SHEER SUNSCREEN SPF50+/PA+++'
    ) INTO has_rit_lumiglow;

    IF NOT has_rit_lumiglow THEN
      UPDATE content_blocks
      SET 
        content = jsonb_set(
          rit_content,
          '{items}',
          (rit_content->'items') || '{
            "step": "06",
            "name": "Sun Protection",
            "title": "Chống nắng / Bảo vệ da",
            "detail": "LUMIGLOW ROSY SHEER SUNSCREEN SPF50+/PA+++ — bảo vệ da trước tia UV, nâng tone tự nhiên và hỗ trợ làn da sáng hồng căng bóng mỗi ngày.",
            "product": "LUMIGLOW ROSY SHEER SUNSCREEN SPF50+/PA+++",
            "mediaSlot": "cosmetic-product-lumiglow-sunscreen"
          }'::jsonb
        ),
        updated_at = now()
      WHERE id = rit_block_id;
    END IF;
  END IF;

END $$;
