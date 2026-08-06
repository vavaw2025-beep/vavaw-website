-- non-destructive seed script to upgrade luminous set product viewer details
-- patches content.setProducts with interactive details for each of the 2 products.
-- preserves existing unrelated fields and handles empty/existing setProducts safely.

DO $$
DECLARE
  target_id uuid;
  existing_content jsonb;
  updated_set_products jsonb;
BEGIN
  SELECT id, coalesce(content, '{}'::jsonb)
  INTO target_id, existing_content
  FROM public.content_blocks
  WHERE site_key = 'main'
    AND page_path = '/cosmetic'
    AND block_type = 'cosmetic-hero-product'
  LIMIT 1;

  IF target_id IS NOT NULL THEN
    -- Define the updated detailed 2 products array
    updated_set_products := '[
      {
        "id": "cellurevive-ampoule",
        "name": "CELLUREVIVE Ampoule",
        "size": "7ml × 4ea",
        "role": "Ampoule cô đặc",
        "description": "Hỗ trợ phục hồi làn da, cải thiện độ sáng và giúp bề mặt da trông mịn màng, tươi khỏe hơn.",
        "detailTitle": "Tinh chất phục hồi chuyên sâu",
        "detailDescription": "Ampoule cô đặc trong bộ Luminous Set, được thiết kế để hỗ trợ làn da cần phục hồi, cải thiện độ rạng rỡ và tăng cảm giác mịn màng sau các bước chăm sóc nền.",
        "actives": ["Exosome", "Peptide Complex", "Collagen Support"],
        "benefits": ["Hỗ trợ phục hồi", "Tăng độ rạng rỡ", "Làm mịn bề mặt da"],
        "usage": "Dùng sau bước cân bằng da. Thoa lượng vừa đủ lên toàn mặt, massage nhẹ đến khi thẩm thấu.",
        "mediaSlot": "cosmetic-set-cellurevive-ampoule"
      },
      {
        "id": "regenaglow-sheer-cream",
        "name": "REGENAGLOW NOURISH SHEER CREAM",
        "size": "30ml × 1ea",
        "role": "Kem dưỡng phục hồi",
        "description": "Giúp khóa ẩm, làm mềm da và củng cố hàng rào bảo vệ để duy trì làn da ổn định hơn.",
        "detailTitle": "Kem dưỡng khóa ẩm và phục hồi hàng rào da",
        "detailDescription": "Kem dưỡng trong bộ Luminous Set giúp hoàn thiện routine phục hồi bằng cách khóa ẩm, hỗ trợ hàng rào bảo vệ và duy trì làn da mềm mượt, ổn định hơn.",
        "actives": ["Collagen", "Peptide Complex", "Moisture Barrier Support"],
        "benefits": ["Khóa ẩm", "Củng cố hàng rào da", "Làm mềm da"],
        "usage": "Dùng sau ampoule. Lấy lượng vừa đủ, thoa đều lên mặt và cổ, vỗ nhẹ để dưỡng chất thẩm thấu.",
        "mediaSlot": "cosmetic-set-regenaglow-sheer-cream"
      }
    ]'::jsonb;

    -- Update setProducts field in content jsonb
    UPDATE public.content_blocks
    SET
      content = jsonb_set(existing_content, '{setProducts}', updated_set_products),
      updated_at = now()
    WHERE id = target_id;

    RAISE NOTICE 'Updated Luminous Set setProducts list with interactive detail metadata.';
  ELSE
    RAISE WARNING 'cosmetic-hero-product block not found. No update applied.';
  END IF;
END $$;

-- Verification Query
select
  block_type,
  content->>'title' as title,
  jsonb_array_length(coalesce(content->'setProducts', '[]'::jsonb)) as set_products_count,
  content->'setProducts' as set_products
from public.content_blocks
where site_key = 'main'
  and page_path = '/cosmetic'
  and block_type = 'cosmetic-hero-product';
