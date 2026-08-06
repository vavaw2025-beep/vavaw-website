-- ============================================================
-- 009_normalize_cosmetic_signature_collection_slots.sql
--
-- Safe, non-destructive migration.
-- Normalizes legacy short mediaSlot keys in content_blocks
-- for cosmetic-signature-collection to canonical "cosmetic-product-*" form.
--
-- Safe guarantees:
-- * No schema changes
-- * No full overwrite of content jsonb
-- * Preserves all other content fields
-- * Idempotent (safe to run multiple times)
-- * Only modifies mediaSlot fields within items[] and featured
-- ============================================================

DO $$
DECLARE
  rec         RECORD;
  new_items   jsonb;
  new_item    jsonb;
  new_content jsonb;
  item        jsonb;
  i           int;
  old_slot    text;
  new_slot    text;
BEGIN

  FOR rec IN
    SELECT id, content
    FROM public.content_blocks
    WHERE site_key   = 'main'
      AND page_path  = '/cosmetic'
      AND block_type = 'cosmetic-signature-collection'
  LOOP

    new_content := rec.content;

    -- ── 1. Normalize featured.mediaSlot ─────────────────────────────────────
    old_slot := new_content -> 'featured' ->> 'mediaSlot';
    IF old_slot IS NOT NULL THEN
      new_slot := CASE old_slot
        WHEN 'luminous-set'       THEN 'cosmetic-product-luminous-set'
        WHEN 'luminous'           THEN 'cosmetic-product-luminous-set'
        WHEN 'featured-set'       THEN 'cosmetic-product-luminous-set'
        WHEN 'regenaglow-cream'   THEN 'cosmetic-product-regenaglow-cream'
        WHEN 'regenaglow'         THEN 'cosmetic-product-regenaglow-cream'
        WHEN 'calmiance-gel'      THEN 'cosmetic-product-calmiance-gel'
        WHEN 'calmiance'          THEN 'cosmetic-product-calmiance-gel'
        WHEN 'renew-ampoule'      THEN 'cosmetic-product-renew-ampoule'
        WHEN 'renew'              THEN 'cosmetic-product-renew-ampoule'
        WHEN 'ampoule'            THEN 'cosmetic-product-renew-ampoule'
        WHEN 'p30-moisturizer'    THEN 'cosmetic-product-p30-moisturizer'
        WHEN 'moisturizer'        THEN 'cosmetic-product-p30-moisturizer'
        WHEN 'p30-toner'          THEN 'cosmetic-product-p30-toner'
        WHEN 'toner'              THEN 'cosmetic-product-p30-toner'
        WHEN 'lumiglow-sunscreen' THEN 'cosmetic-product-lumiglow-sunscreen'
        WHEN 'lumiglow'           THEN 'cosmetic-product-lumiglow-sunscreen'
        WHEN 'sunscreen'          THEN 'cosmetic-product-lumiglow-sunscreen'
        ELSE old_slot             -- Already canonical or unknown: leave as-is
      END;
      IF new_slot IS DISTINCT FROM old_slot THEN
        new_content := jsonb_set(
          new_content,
          '{featured, mediaSlot}',
          to_jsonb(new_slot),
          false  -- do not create key if missing (it was already there)
        );
        RAISE NOTICE '[009] Block % — featured.mediaSlot: % → %', rec.id, old_slot, new_slot;
      END IF;
    END IF;

    -- ── 2. Normalize items[].mediaSlot ──────────────────────────────────────
    IF jsonb_typeof(new_content -> 'items') = 'array' THEN
      new_items := '[]'::jsonb;

      FOR i IN 0 .. jsonb_array_length(new_content -> 'items') - 1 LOOP
        item     := new_content -> 'items' -> i;
        old_slot := item ->> 'mediaSlot';

        IF old_slot IS NOT NULL THEN
          new_slot := CASE old_slot
            WHEN 'luminous-set'       THEN 'cosmetic-product-luminous-set'
            WHEN 'luminous'           THEN 'cosmetic-product-luminous-set'
            WHEN 'featured-set'       THEN 'cosmetic-product-luminous-set'
            WHEN 'regenaglow-cream'   THEN 'cosmetic-product-regenaglow-cream'
            WHEN 'regenaglow'         THEN 'cosmetic-product-regenaglow-cream'
            WHEN 'calmiance-gel'      THEN 'cosmetic-product-calmiance-gel'
            WHEN 'calmiance'          THEN 'cosmetic-product-calmiance-gel'
            WHEN 'renew-ampoule'      THEN 'cosmetic-product-renew-ampoule'
            WHEN 'renew'              THEN 'cosmetic-product-renew-ampoule'
            WHEN 'ampoule'            THEN 'cosmetic-product-renew-ampoule'
            WHEN 'p30-moisturizer'    THEN 'cosmetic-product-p30-moisturizer'
            WHEN 'moisturizer'        THEN 'cosmetic-product-p30-moisturizer'
            WHEN 'p30-toner'          THEN 'cosmetic-product-p30-toner'
            WHEN 'toner'              THEN 'cosmetic-product-p30-toner'
            WHEN 'lumiglow-sunscreen' THEN 'cosmetic-product-lumiglow-sunscreen'
            WHEN 'lumiglow'           THEN 'cosmetic-product-lumiglow-sunscreen'
            WHEN 'sunscreen'          THEN 'cosmetic-product-lumiglow-sunscreen'
            ELSE old_slot
          END;

          IF new_slot IS DISTINCT FROM old_slot THEN
            item := jsonb_set(item, '{mediaSlot}', to_jsonb(new_slot), false);
            RAISE NOTICE '[009] Block % item[%] mediaSlot: % → %', rec.id, i, old_slot, new_slot;
          END IF;
        END IF;

        new_items := new_items || jsonb_build_array(item);
      END LOOP;

      new_content := jsonb_set(new_content, '{items}', new_items, false);
    END IF;

    -- ── 3. Write back (only if content changed) ──────────────────────────────
    IF new_content IS DISTINCT FROM rec.content THEN
      UPDATE public.content_blocks
      SET
        content    = new_content,
        updated_at = NOW()
      WHERE id = rec.id;

      RAISE NOTICE '[009] Block % updated.', rec.id;
    ELSE
      RAISE NOTICE '[009] Block % — no changes needed (already canonical).', rec.id;
    END IF;

  END LOOP;

END $$;

-- ============================================================
-- VERIFICATION QUERY
-- Run after migration to confirm all slots are canonical.
-- Expected: every value starts with "cosmetic-product-"
-- ============================================================
SELECT
  id,
  jsonb_path_query_array(content, '$.items[*].mediaSlot') AS item_media_slots,
  content -> 'featured' ->> 'mediaSlot'                   AS featured_media_slot,
  updated_at
FROM public.content_blocks
WHERE site_key   = 'main'
  AND page_path  = '/cosmetic'
  AND block_type = 'cosmetic-signature-collection';
