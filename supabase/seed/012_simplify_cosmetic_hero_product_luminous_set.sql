-- non-destructive seed script to simplify cosmetic-hero-product block content JSONB
-- patches eyebrow, title, headline, description, mediaSlot, benefits, setProducts, ctaLabel, ctaHref.
-- preserves insideBox, scienceTitle, scienceDescription, usageSteps.

DO $$
DECLARE
  target_id uuid;
  existing_content jsonb;
  patch_content jsonb;
BEGIN
  SELECT id, coalesce(content, '{}'::jsonb)
  INTO target_id, existing_content
  FROM public.content_blocks
  WHERE site_key = 'main'
    AND page_path = '/cosmetic'
    AND block_type = 'cosmetic-hero-product'
  LIMIT 1;

  IF target_id IS NOT NULL THEN
    patch_content := jsonb_build_object(
      'eyebrow', 'FEATURED SET',
      'title', 'Luminous Revitalization Sheer Set',
      'headline', 'Chăm sóc chuyên sâu — củng cố hàng rào bảo vệ và phục hồi làn da rạng rỡ.',
      'description', 'Bộ chăm sóc phục hồi chuyên sâu kết hợp ampoule cô đặc và kem dưỡng phục hồi, giúp hỗ trợ hàng rào bảo vệ da, cải thiện độ ẩm và mang lại làn da rạng rỡ hơn.',
      'mediaSlot', 'cosmetic-product-luminous-set',
      'benefits', jsonb_build_array(
        'Barrier Support',
        'Radiance Recovery',
        'Moisture Retention'
      ),
      'setProducts', jsonb_build_array(
        jsonb_build_object(
          'name', 'CELLUREVIVE Ampoule',
          'size', '7ml × 4ea',
          'role', 'Ampoule cô đặc',
          'description', 'Hỗ trợ phục hồi làn da, cải thiện độ sáng và giúp bề mặt da trông mịn màng, tươi khỏe hơn.'
        ),
        jsonb_build_object(
          'name', 'REGENAGLOW NOURISH SHEER CREAM',
          'size', '30ml × 1ea',
          'role', 'Kem dưỡng phục hồi',
          'description', 'Giúp khóa ẩm, làm mềm da và củng cố hàng rào bảo vệ để duy trì làn da ổn định hơn.'
        )
      ),
      'ctaLabel', 'Start Consultation',
      'ctaHref', '/contact?type=cosmetic_interest&product=luminous_set'
    );

    UPDATE public.content_blocks
    SET
      content = existing_content || patch_content,
      updated_at = now()
    WHERE id = target_id;

    RAISE NOTICE 'Updated cosmetic-hero-product simplified Luminous Set content.';
  ELSE
    RAISE WARNING 'cosmetic-hero-product block not found. No update applied.';
  END IF;
END $$;

-- Verification Query
select
  block_type,
  content->>'title' as title,
  content->>'headline' as headline,
  content->>'mediaSlot' as media_slot,
  jsonb_array_length(coalesce(content->'benefits', '[]'::jsonb)) as benefits_count,
  jsonb_array_length(coalesce(content->'setProducts', '[]'::jsonb)) as set_products_count,
  content->'setProducts' as set_products
from public.content_blocks
where site_key = 'main'
  and page_path = '/cosmetic'
  and block_type = 'cosmetic-hero-product';
