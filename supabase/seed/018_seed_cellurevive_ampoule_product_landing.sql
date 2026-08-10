-- 018_seed_cellurevive_ampoule_product_landing.sql
-- Phase 72A: Seed content block for CELLUREVIVE Ampoule product landing.
-- Non-destructive: merges missing fields if existing, inserts if absent.

DO $$
DECLARE
  v_block_id uuid;
  v_default_content jsonb;
  v_existing_content jsonb;
  v_merged_content jsonb;
  v_key text;
BEGIN
  v_default_content := '{
    "eyebrow": "VAVAW COSMETIC AMPOULE",
    "title": "CELLUREVIVE Ampoule",
    "headline": "Ampoule cô đặc hỗ trợ phục hồi làn da và cải thiện vẻ rạng rỡ sau chăm sóc chuyên sâu.",
    "description": "CELLUREVIVE Ampoule là bước treatment chuyên sâu trong routine phục hồi VAVAW, được thiết kế để hỗ trợ làn da cần cấp ẩm, làm dịu và cải thiện bề mặt da trông mịn màng hơn.",
    "ctaLabel": "Nhận tư vấn CELLUREVIVE Ampoule",
    "ctaHref": "/contact?type=cosmetic_interest&product=cellurevive_ampoule&source=product_landing",
    "secondaryCtaLabel": "Xem Luminous Set",
    "secondaryCtaHref": "/cosmetic/products/luminous-revitalization-sheer-set",
    "heroMediaSlot": "cosmetic-set-cellurevive-ampoule",
    "insideSet": [
      {
        "name": "CELLUREVIVE Ampoule",
        "size": "7ml",
        "role": "Ampoule treatment cô đặc",
        "description": "Hỗ trợ làn da cần phục hồi sau chăm sóc chuyên sâu, giúp da trông ẩm mịn và rạng rỡ hơn.",
        "mediaSlot": "cosmetic-set-cellurevive-ampoule"
      }
    ],
    "recoveryLogic": [
      { "step": "01. Prepare", "title": "Làm sạch và cân bằng da trước treatment", "description": "" },
      { "step": "02. Treat", "title": "Thoa CELLUREVIVE Ampoule như bước treatment chính", "description": "" },
      { "step": "03. Recover", "title": "Hỗ trợ cảm giác dễ chịu cho làn da đang cần phục hồi", "description": "" },
      { "step": "04. Seal", "title": "Khóa ẩm bằng kem dưỡng phù hợp", "description": "" },
      { "step": "05. Protect", "title": "Ban ngày dùng thêm kem chống nắng", "description": "" }
    ],
    "activeTech": [
      {
        "name": "Exosome",
        "role": "Renewal signal support",
        "description": "Hỗ trợ vẻ ngoài mịn màng và rạng rỡ của làn da.",
        "product": "CELLUREVIVE Ampoule"
      },
      {
        "name": "Collagen Water",
        "role": "Hydration support",
        "description": "Giúp làn da có cảm giác ẩm mượt và mềm mại hơn.",
        "product": "CELLUREVIVE Ampoule"
      },
      {
        "name": "Peptide Complex",
        "role": "Barrier support",
        "description": "Hỗ trợ hàng rào bảo vệ và giúp da trông săn mịn hơn.",
        "product": "CELLUREVIVE Ampoule"
      },
      {
        "name": "Korean Recovery Ritual",
        "role": "Treatment step",
        "description": "Được dùng như bước treatment trong routine phục hồi VAVAW.",
        "product": "VAVAW Cosmetic routine"
      }
    ],
    "whoItsFor": [
      "Da cần phục hồi sau spa/treatment",
      "Da khô, yếu, thiếu sức sống",
      "Da cần hỗ trợ hàng rào bảo vệ",
      "Da cần cải thiện vẻ mịn màng và rạng rỡ",
      "Người muốn bổ sung bước ampoule chuyên sâu trong routine tại nhà"
    ],
    "howToUse": [
      { "step": "01", "title": "Làm sạch da và cân bằng bằng toner", "description": "" },
      { "step": "02", "title": "Lấy lượng ampoule vừa đủ", "description": "" },
      { "step": "03", "title": "Thoa đều lên mặt, tránh vùng mắt", "description": "" },
      { "step": "04", "title": "Vỗ nhẹ đến khi thẩm thấu", "description": "" },
      { "step": "05", "title": "Khóa ẩm bằng REGENAGLOW NOURISH SHEER CREAM hoặc kem dưỡng phù hợp", "description": "" }
    ],
    "spaBridge": {
      "title": "Kết hợp trong routine phục hồi tại VAVAW Beauty & Co",
      "description": "CELLUREVIVE Ampoule có thể được tư vấn như một bước treatment hỗ trợ routine phục hồi sau trải nghiệm chăm sóc chuyên sâu tại VAVAW Beauty & Co.",
      "ctaLabel": "Trải nghiệm tại VAVAW Beauty & Co",
      "ctaHref": "/go/beauty"
    },
    "productInfo": [
      { "label": "Tên sản phẩm", "value": "CELLUREVIVE Ampoule" },
      { "label": "Dung tích", "value": "7ml" },
      { "label": "Loại sản phẩm", "value": "Ampoule treatment" },
      { "label": "Bước sử dụng", "value": "Sau toner, trước kem dưỡng" },
      { "label": "Gợi ý kết hợp", "value": "REGENAGLOW NOURISH SHEER CREAM" },
      { "label": "Lưu ý", "value": "Chỉ dùng ngoài da. Tránh tiếp xúc trực tiếp với mắt." }
    ],
    "finalCta": {
      "title": "Bắt đầu tư vấn CELLUREVIVE Ampoule",
      "description": "Nhận gợi ý cách kết hợp CELLUREVIVE Ampoule vào routine phục hồi phù hợp với tình trạng da của bạn.",
      "ctaLabel": "Nhận tư vấn Ampoule",
      "ctaHref": "/contact?type=cosmetic_interest&product=cellurevive_ampoule&source=product_landing_final"
    }
  }';

  SELECT id, content INTO v_block_id, v_existing_content
  FROM content_blocks
  WHERE site_key = 'main' 
    AND page_path = '/cosmetic/products/cellurevive-ampoule' 
    AND block_type = 'cosmetic-product-landing-cellurevive-ampoule'
  ORDER BY updated_at DESC
  LIMIT 1;

  IF v_block_id IS NULL THEN
    INSERT INTO content_blocks (site_key, page_path, block_type, content, is_active, sort_order)
    VALUES (
      'main',
      '/cosmetic/products/cellurevive-ampoule',
      'cosmetic-product-landing-cellurevive-ampoule',
      v_default_content,
      true,
      1
    );
    RAISE NOTICE 'Inserted missing CELLUREVIVE Ampoule product landing block.';
  ELSE
    v_merged_content := v_existing_content;

    FOR v_key IN SELECT jsonb_object_keys(v_default_content)
    LOOP
      IF NOT v_merged_content ? v_key THEN
        v_merged_content := jsonb_set(
          v_merged_content, 
          array[v_key], 
          v_default_content -> v_key
        );
      END IF;
    END LOOP;

    IF v_merged_content != v_existing_content THEN
      UPDATE content_blocks 
      SET content = v_merged_content,
          updated_at = NOW()
      WHERE id = v_block_id;
      RAISE NOTICE 'Merged missing fields into existing CELLUREVIVE Ampoule product landing block (%).', v_block_id;
    ELSE
      RAISE NOTICE 'CELLUREVIVE Ampoule product landing block (%) is fully populated. No changes made.', v_block_id;
    END IF;
  END IF;
END $$;

-- Verification
SELECT 
  site_key,
  page_path,
  block_type,
  is_active,
  content->>'title' AS title,
  jsonb_array_length(CASE jsonb_typeof(content->'insideSet') WHEN 'array' THEN content->'insideSet' ELSE '[]'::jsonb END) AS inside_set_count,
  jsonb_array_length(CASE jsonb_typeof(content->'activeTech') WHEN 'array' THEN content->'activeTech' ELSE '[]'::jsonb END) AS technology_count,
  jsonb_array_length(CASE jsonb_typeof(content->'productInfo') WHEN 'array' THEN content->'productInfo' ELSE '[]'::jsonb END) AS product_info_count
FROM content_blocks
WHERE block_type = 'cosmetic-product-landing-cellurevive-ampoule';
