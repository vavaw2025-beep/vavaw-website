-- Enrich existing cosmetic-brand-philosophy items non-destructively
DO $$
DECLARE
  target_id UUID;
  current_content JSONB;
  items JSONB;
  item JSONB;
  new_items JSONB := '[]'::jsonb;
  idx INT := 0;
  has_changed BOOLEAN := false;
  default_icons TEXT[] := ARRAY['flask-conical', 'sparkles', 'shield-check'];
  default_nums TEXT[] := ARRAY['01', '02', '03'];
  item_icon TEXT;
  item_num TEXT;
  item_desc TEXT;
  item_title TEXT;
BEGIN
  -- 1. Find the target block
  SELECT id, coalesce(content, '{}'::jsonb) INTO target_id, current_content
  FROM content_blocks
  WHERE site_key = 'main' AND page_path = '/cosmetic' AND block_type = 'cosmetic-brand-philosophy'
  LIMIT 1;

  IF target_id IS NOT NULL THEN
    items := current_content->'items';
    
    IF items IS NOT NULL AND jsonb_typeof(items) = 'array' AND jsonb_array_length(items) > 0 THEN
      -- Loop over each card to enrich it
      FOR idx IN 0..(jsonb_array_length(items) - 1) LOOP
        item := items->idx;
        
        -- Get default number if missing
        IF idx < 3 THEN
          item_num := default_nums[idx + 1];
        ELSE
          item_num := LPAD((idx + 1)::text, 2, '0');
        END IF;

        -- Get default icon if missing
        IF idx < 3 THEN
          item_icon := default_icons[idx + 1];
        ELSE
          item_icon := 'sparkles';
        END IF;

        -- Check if anything was missing and needs enriching
        IF NOT (item ? 'number') THEN
          item := item || jsonb_build_object('number', coalesce(item->>'num', item_num));
          has_changed := true;
        END IF;
        
        IF NOT (item ? 'icon') THEN
          item := item || jsonb_build_object('icon', item_icon);
          has_changed := true;
        END IF;

        IF NOT (item ? 'description') THEN
          item := item || jsonb_build_object('description', coalesce(item->>'desc', ''));
          has_changed := true;
        END IF;

        IF NOT (item ? 'title') THEN
          item := item || jsonb_build_object('title', coalesce(item->>'title', ''));
          has_changed := true;
        END IF;
        
        new_items := new_items || jsonb_build_array(item);
      END LOOP;

      -- Update the block only if change detected
      IF has_changed THEN
        UPDATE content_blocks
        SET 
          content = jsonb_set(current_content, '{items}', new_items),
          updated_at = now()
        WHERE id = target_id;
      END IF;
      
    ELSE
      -- Fallback if items array is missing or empty entirely
      UPDATE content_blocks
      SET 
        content = jsonb_set(
          current_content,
          '{items}',
          '[
            {
              "number": "01",
              "icon": "flask-conical",
              "title": "Scientific Beauty",
              "description": "Clinical skincare system shaped by professional care standards — developed for visible, lasting results."
            },
            {
              "number": "02",
              "icon": "sparkles",
              "title": "Premium Program",
              "description": "Personalized skincare experience for modern skin concerns — designed for spa, clinic, and home ritual."
            },
            {
              "number": "03",
              "icon": "shield-check",
              "title": "Functional Cosmetics",
              "description": "Korean-developed formulas designed for visible skin recovery, balancing efficacy with elegance."
            }
          ]'::jsonb
        ),
        updated_at = now()
      WHERE id = target_id;
    END IF;
  END IF;
END $$;
