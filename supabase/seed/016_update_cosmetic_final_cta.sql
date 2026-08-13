-- 016_update_cosmetic_final_cta.sql
-- Phase 70A: Optimize Cosmetic Final CTA.
-- Non-destructive: enriches the content of cosmetic-final-cta block, preserving other custom keys.
-- Does NOT change database schema or RLS policies.

DO $$
DECLARE
  v_block_id uuid;
  v_content jsonb;
  v_trust_points jsonb := '[]'::jsonb;
BEGIN
  -- Find the cosmetic-final-cta block
  SELECT id, content INTO v_block_id, v_content
  FROM public.content_blocks
  WHERE site_key = 'main'
    AND page_path = '/cosmetic'
    AND block_type = 'cosmetic-final-cta'
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
      'cosmetic-final-cta',
      true,
      10,
      jsonb_build_object(
        'eyebrow', 'VAVAW COSMETIC CONSULTATION',
        'title', 'Begin Your VAVAW Skin Consultation',
        'description', 'Khám phá routine phục hồi phù hợp với tình trạng da của bạn — từ sản phẩm chăm sóc tại nhà đến trải nghiệm chuyên sâu tại VAVAW Beauty & Co.',
        'ctaLabel', 'Nhận tư vấn sản phẩm',
        'ctaHref', '/contact?type=cosmetic_interest&source=final_cta',
        'secondaryCtaLabel', 'Trải nghiệm tại VAVAW Beauty & Co',
        'secondaryCtaHref', 'https://beauty.vavaw.vn',
        'trustPoints', '[
          "Clinical Korean cosmetic ritual",
          "Spa-use recovery guidance",
          "Home-care routine support"
        ]'::jsonb
      ),
      NOW(),
      NOW()
    );
    RAISE NOTICE 'Created missing cosmetic-final-cta block.';
    RETURN;
  END IF;

  -- Enforce canonical updates
  IF (v_content->>'eyebrow') IS NULL OR v_content->>'eyebrow' = 'VAVAW Cosmetic' THEN
    v_content := v_content || jsonb_build_object('eyebrow', 'VAVAW COSMETIC CONSULTATION');
  END IF;

  IF (v_content->>'title') IS NULL OR v_content->>'title' = 'Premium RAW Skincare System' THEN
    v_content := v_content || jsonb_build_object('title', 'Begin Your VAVAW Skin Consultation');
  END IF;

  IF (v_content->>'description') IS NULL THEN
    v_content := v_content || jsonb_build_object('description', 'Khám phá routine phục hồi phù hợp với tình trạng da của bạn — từ sản phẩm chăm sóc tại nhà đến trải nghiệm chuyên sâu tại VAVAW Beauty & Co.');
  END IF;

  IF (v_content->>'ctaLabel') IS NULL OR v_content->>'ctaLabel' = 'START AN INQUIRY' THEN
    v_content := v_content || jsonb_build_object('ctaLabel', 'Nhận tư vấn sản phẩm');
  END IF;

  IF (v_content->>'ctaHref') IS NULL OR v_content->>'ctaHref' = '/contact?type=cosmetic_interest' THEN
    v_content := v_content || jsonb_build_object('ctaHref', '/contact?type=cosmetic_interest&source=final_cta');
  END IF;

  IF (v_content->>'secondaryCtaLabel') IS NULL THEN
    v_content := v_content || jsonb_build_object('secondaryCtaLabel', 'Trải nghiệm tại VAVAW Beauty & Co');
  END IF;

  IF (v_content->>'secondaryCtaHref') IS NULL THEN
    v_content := v_content || jsonb_build_object('secondaryCtaHref', 'https://beauty.vavaw.vn');
  END IF;

  -- Add trust points if missing or empty
  IF (v_content->'trustPoints') IS NULL OR jsonb_typeof(v_content->'trustPoints') <> 'array' OR jsonb_array_length(v_content->'trustPoints') = 0 THEN
    v_content := v_content || jsonb_build_object(
      'trustPoints', '[
        "Clinical Korean cosmetic ritual",
        "Spa-use recovery guidance",
        "Home-care routine support"
      ]'::jsonb
    );
  END IF;

  -- Update
  UPDATE public.content_blocks
  SET
    content = v_content,
    updated_at = NOW()
  WHERE id = v_block_id;

  RAISE NOTICE 'Successfully updated cosmetic-final-cta block.';
END $$;

