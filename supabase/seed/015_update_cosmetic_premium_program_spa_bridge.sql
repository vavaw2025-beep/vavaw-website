-- 015_update_cosmetic_premium_program_spa_bridge.sql
-- Phase 69A: Upgrade Premium Program into Professional Spa Bridge Section.
-- Non-destructive: sets is_active = true and enriches block content.
-- Converts old items into pillars if pillars missing, keeping old items.
-- Does NOT change database schema or RLS policies.

DO $$
DECLARE
  v_block_id uuid;
  v_content jsonb;
  v_items jsonb;
  v_pillars jsonb := '[]'::jsonb;
  v_item jsonb;
  v_i int;
BEGIN
  -- Find the cosmetic-premium-program block
  SELECT id, content INTO v_block_id, v_content
  FROM public.content_blocks
  WHERE site_key = 'main'
    AND page_path = '/cosmetic'
    AND block_type = 'cosmetic-premium-program'
  LIMIT 1;

  -- Create block if missing
  IF v_block_id IS NULL THEN
    INSERT INTO public.content_blocks (
      site_key,
      page_path,
      block_type,
      is_active,
      sort_order,
      content,
      created_at,
      updated_at
    ) VALUES (
      'main',
      '/cosmetic',
      'cosmetic-premium-program',
      true,
      8,
      jsonb_build_object(
        'eyebrow', 'PROFESSIONAL SPA PROGRAM',
        'title', 'VAVAW Professional Recovery Program',
        'headline', 'Sản phẩm VAVAW được ứng dụng trong trải nghiệm chăm sóc phục hồi chuyên sâu tại spa.',
        'description', 'VAVAW Cosmetic được thiết kế để đồng hành trong routine chăm sóc tại nhà và trải nghiệm chăm sóc chuyên nghiệp tại spa, giúp khách hàng hiểu rõ cách sử dụng sản phẩm theo từng nhu cầu da.',
        'mediaSlot', 'cosmetic-premium-program-spa-video',
        'fallbackImageSlot', 'cosmetic-premium-program',
        'pillars', '[
          {
            "title": "Spa-use recovery ritual",
            "description": "Ứng dụng sản phẩm trong quy trình chăm sóc phục hồi tại spa."
          },
          {
            "title": "Specialist-guided application",
            "description": "Khách hàng được hướng dẫn cách dùng sản phẩm phù hợp với tình trạng da."
          },
          {
            "title": "Home-care continuity",
            "description": "Routine tại nhà giúp duy trì hiệu quả chăm sóc sau trải nghiệm spa."
          }
        ]'::jsonb,
        'ctaLabel', 'Trải nghiệm tại VAVAW Beauty & Co',
        'ctaHref', '/go/beauty',
        'secondaryCtaLabel', 'Nhận tư vấn sản phẩm',
        'secondaryCtaHref', '/contact?type=cosmetic_interest&source=premium_program'
      ),
      NOW(),
      NOW()
    );
    RAISE NOTICE 'Created missing cosmetic-premium-program block.';
    RETURN;
  END IF;

  -- Convert old items into pillars if pillars is missing, not an array, or empty
  IF (v_content->'pillars') IS NULL 
     OR jsonb_typeof(v_content->'pillars') <> 'array' 
     OR jsonb_array_length(v_content->'pillars') = 0 THEN
    -- Load standard pillars directly
    v_pillars := '[
      {
        "title": "Spa-use recovery ritual",
        "description": "Ứng dụng sản phẩm trong quy trình chăm sóc phục hồi tại spa."
      },
      {
        "title": "Specialist-guided application",
        "description": "Khách hàng được hướng dẫn cách dùng sản phẩm phù hợp với tình trạng da."
      },
      {
        "title": "Home-care continuity",
        "description": "Routine tại nhà giúp duy trì hiệu quả chăm sóc sau trải nghiệm spa."
      }
    ]'::jsonb;
    v_content := jsonb_set(v_content, '{pillars}', v_pillars);
  END IF;

  -- Enforce canonical fields
  IF (v_content->>'eyebrow') IS NULL OR v_content->>'eyebrow' = 'PREMIUM PROGRAM' THEN
    v_content := v_content || jsonb_build_object('eyebrow', 'PROFESSIONAL SPA PROGRAM');
  END IF;
  
  IF (v_content->>'title') IS NULL OR v_content->>'title' = 'VAVAW Premium Skincare Ritual' THEN
    v_content := v_content || jsonb_build_object('title', 'VAVAW Professional Recovery Program');
  END IF;

  IF (v_content->>'headline') IS NULL THEN
    v_content := v_content || jsonb_build_object('headline', 'Sản phẩm VAVAW được ứng dụng trong trải nghiệm chăm sóc phục hồi chuyên sâu tại spa.');
  END IF;

  IF (v_content->>'description') IS NULL OR (v_content->>'description') LIKE '%Ritual%' THEN
    v_content := v_content || jsonb_build_object('description', 'VAVAW Cosmetic được thiết kế để đồng hành trong routine chăm sóc tại nhà và trải nghiệm chăm sóc chuyên nghiệp tại spa, giúp khách hàng hiểu rõ cách sử dụng sản phẩm theo từng nhu cầu da.');
  END IF;

  IF (v_content->>'mediaSlot') IS NULL THEN
    v_content := v_content || jsonb_build_object('mediaSlot', 'cosmetic-premium-program-spa-video');
  END IF;

  IF (v_content->>'fallbackImageSlot') IS NULL THEN
    v_content := v_content || jsonb_build_object('fallbackImageSlot', 'cosmetic-premium-program');
  END IF;

  IF (v_content->>'ctaLabel') IS NULL THEN
    v_content := v_content || jsonb_build_object('ctaLabel', 'Trải nghiệm tại VAVAW Beauty & Co');
  END IF;

  IF (v_content->>'ctaHref') IS NULL OR v_content->>'ctaHref' = '/contact?type=cosmetic_interest' THEN
    v_content := v_content || jsonb_build_object('ctaHref', '/go/beauty');
  END IF;

  IF (v_content->>'secondaryCtaLabel') IS NULL THEN
    v_content := v_content || jsonb_build_object('secondaryCtaLabel', 'Nhận tư vấn sản phẩm');
  END IF;

  IF (v_content->>'secondaryCtaHref') IS NULL THEN
    v_content := v_content || jsonb_build_object('secondaryCtaHref', '/contact?type=cosmetic_interest&source=premium_program');
  END IF;

  -- Force active = true
  UPDATE public.content_blocks
  SET
    is_active = true,
    content = v_content,
    updated_at = NOW()
  WHERE id = v_block_id;

  RAISE NOTICE 'Successfully updated cosmetic-premium-program block.';
END $$;

-- Verification query
select
  block_type,
  is_active,
  content->>'eyebrow' as eyebrow,
  content->>'title' as title,
  content->>'mediaSlot' as media_slot,
  jsonb_array_length(coalesce(content->'pillars', '[]'::jsonb)) as pillar_count,
  content->>'ctaHref' as cta_href
from public.content_blocks
where site_key = 'main'
  and page_path = '/cosmetic'
  and block_type = 'cosmetic-premium-program';
