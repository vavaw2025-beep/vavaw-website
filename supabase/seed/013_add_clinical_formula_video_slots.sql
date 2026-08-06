-- 013_add_clinical_formula_video_slots.sql
-- Phase 65C: Add videoSlot fields to cosmetic-product-cards items.
-- Non-destructive: only adds videoSlot/mediaSlot if missing per item.
-- Does NOT change schema, RLS, or reorder products.

DO $$
DECLARE
  v_block_id uuid;
  v_content jsonb;
  v_items jsonb;
  v_new_items jsonb := '[]'::jsonb;
  v_item jsonb;
  v_name text;
  v_video_slot text;
  v_media_slot text;
  v_i int;
BEGIN
  -- Find the cosmetic-product-cards block
  SELECT id, content INTO v_block_id, v_content
  FROM public.content_blocks
  WHERE site_key = 'main'
    AND page_path = '/cosmetic'
    AND block_type = 'cosmetic-product-cards'
  LIMIT 1;

  IF v_block_id IS NULL THEN
    RAISE NOTICE 'cosmetic-product-cards block not found. Skipping.';
    RETURN;
  END IF;

  v_items := COALESCE(v_content->'items', '[]'::jsonb);

  FOR v_i IN 0..jsonb_array_length(v_items) - 1 LOOP
    v_item := v_items->v_i;
    v_name := LOWER(COALESCE(v_item->>'name', ''));

    -- Determine canonical videoSlot by product name
    v_video_slot := NULL;
    v_media_slot := NULL;

    IF v_name LIKE '%regenaglow%' AND (v_name LIKE '%cream%' OR v_name LIKE '%nourish%') THEN
      v_video_slot := 'cosmetic-video-regenaglow-cream';
      v_media_slot := 'cosmetic-product-regenaglow-cream';
    ELSIF v_name LIKE '%calmiance%' THEN
      v_video_slot := 'cosmetic-video-calmiance-gel';
      v_media_slot := 'cosmetic-product-calmiance-gel';
    ELSIF v_name LIKE '%renew%' OR (v_name LIKE '%gentle%' AND v_name LIKE '%ampoule%') THEN
      v_video_slot := 'cosmetic-video-renew-ampoule';
      v_media_slot := 'cosmetic-product-renew-ampoule';
    ELSIF v_name LIKE '%moisturizer%' THEN
      v_video_slot := 'cosmetic-video-p30-moisturizer';
      v_media_slot := 'cosmetic-product-p30-moisturizer';
    ELSIF v_name LIKE '%toner%' THEN
      v_video_slot := 'cosmetic-video-p30-toner';
      v_media_slot := 'cosmetic-product-p30-toner';
    ELSIF v_name LIKE '%lumiglow%' OR v_name LIKE '%sunscreen%' THEN
      v_video_slot := 'cosmetic-video-lumiglow-sunscreen';
      v_media_slot := 'cosmetic-product-lumiglow-sunscreen';
    END IF;

    -- Add videoSlot only if missing
    IF v_video_slot IS NOT NULL AND (v_item->>'videoSlot') IS NULL THEN
      v_item := v_item || jsonb_build_object('videoSlot', v_video_slot);
    END IF;

    -- Add mediaSlot only if missing
    IF v_media_slot IS NOT NULL AND (v_item->>'mediaSlot') IS NULL THEN
      v_item := v_item || jsonb_build_object('mediaSlot', v_media_slot);
    END IF;

    v_new_items := v_new_items || jsonb_build_array(v_item);
  END LOOP;

  -- Update the block with new items
  UPDATE public.content_blocks
  SET
    content = jsonb_set(v_content, '{items}', v_new_items),
    updated_at = NOW()
  WHERE id = v_block_id;

  RAISE NOTICE 'Updated cosmetic-product-cards with videoSlot fields. Block ID: %', v_block_id;
END;
$$;

-- Verification query:
-- SELECT
--   item_index,
--   item->>'name' AS name,
--   item->>'mediaSlot' AS image_slot,
--   item->>'videoSlot' AS video_slot
-- FROM public.content_blocks cb,
-- jsonb_array_elements(cb.content->'items') WITH ORDINALITY AS arr(item, item_index)
-- WHERE cb.site_key = 'main'
--   AND cb.page_path = '/cosmetic'
--   AND cb.block_type = 'cosmetic-product-cards'
-- ORDER BY item_index;
