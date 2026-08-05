-- Phase 64A: Enrich cosmetic-signature-collection block non-destructively.
-- Uses product-name matching (not array index) to resolve mediaSlot.
-- Adds content.featured only if missing.
-- Preserves all existing admin edits and unknown item fields.
-- Updates updated_at only when content changes.

DO $$
DECLARE
  target_id UUID;
  current_content JSONB;
  items JSONB;
  item JSONB;
  new_items JSONB := '[]'::jsonb;
  idx INT;
  has_changed BOOLEAN := false;
  item_name TEXT;
  resolved_slot TEXT;
BEGIN
  -- 1. Find block
  SELECT id, coalesce(content, '{}'::jsonb)
  INTO target_id, current_content
  FROM content_blocks
  WHERE site_key = 'main'
    AND page_path = '/cosmetic'
    AND block_type = 'cosmetic-signature-collection'
  LIMIT 1;

  IF target_id IS NULL THEN
    RETURN;
  END IF;

  -- 2. Add default featured object if missing
  IF NOT (current_content ? 'featured') THEN
    current_content := current_content || jsonb_build_object(
      'featured', jsonb_build_object(
        'name',        'Luminous Revitalization Sheer Set',
        'type',        'FEATURED SET',
        'description', 'A complete recovery set designed to support the skin barrier and restore a luminous, balanced appearance.',
        'ingredients', '["Exosome","Collagen","Peptide Complex"]'::jsonb,
        'mediaSlot',   'cosmetic-product-luminous-set',
        'ctaLabel',    'Explore the Ritual',
        'ctaHref',     '/contact?type=cosmetic_interest'
      )
    );
    has_changed := true;
  END IF;

  -- 3. Enrich items if array is present
  items := current_content -> 'items';
  IF items IS NOT NULL AND jsonb_typeof(items) = 'array' AND jsonb_array_length(items) > 0 THEN
    FOR idx IN 0 .. (jsonb_array_length(items) - 1) LOOP
      item := items -> idx;
      item_name := lower(coalesce(item->>'name', ''));

      -- Resolve mediaSlot by product name match (only if field is missing)
      IF NOT (item ? 'mediaSlot') THEN
        resolved_slot := NULL;

        IF item_name LIKE '%regenaglow%' THEN
          resolved_slot := 'cosmetic-product-regenaglow-cream';
        ELSIF item_name LIKE '%calmiance%' THEN
          resolved_slot := 'cosmetic-product-calmiance-gel';
        ELSIF item_name LIKE '%renew%' THEN
          resolved_slot := 'cosmetic-product-renew-ampoule';
        ELSIF item_name LIKE '%p30%' AND item_name LIKE '%moisturizer%' THEN
          resolved_slot := 'cosmetic-product-p30-moisturizer';
        ELSIF item_name LIKE '%p30%' AND item_name LIKE '%toner%' THEN
          resolved_slot := 'cosmetic-product-p30-toner';
        ELSIF item_name LIKE '%lumiglow%' OR item_name LIKE '%sunscreen%' THEN
          resolved_slot := 'cosmetic-product-lumiglow-sunscreen';
        ELSIF item_name LIKE '%luminous%' THEN
          resolved_slot := 'cosmetic-product-luminous-set';
        END IF;

        IF resolved_slot IS NOT NULL THEN
          item := item || jsonb_build_object('mediaSlot', resolved_slot);
          has_changed := true;
        END IF;
        -- If no match, do not add an empty mediaSlot
      END IF;

      -- Add description from desc if missing
      IF NOT (item ? 'description') AND (item ? 'desc') THEN
        item := item || jsonb_build_object('description', item->>'desc');
        has_changed := true;
      END IF;

      new_items := new_items || jsonb_build_array(item);
    END LOOP;

    -- Write back enriched items
    IF has_changed THEN
      current_content := jsonb_set(current_content, '{items}', new_items);
    END IF;
  END IF;

  -- 4. Persist only if something changed
  IF has_changed THEN
    UPDATE content_blocks
    SET
      content    = current_content,
      updated_at = now()
    WHERE id = target_id;
  END IF;
END $$;
