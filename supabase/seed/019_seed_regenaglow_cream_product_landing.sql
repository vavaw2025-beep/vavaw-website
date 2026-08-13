-- 019_seed_regenaglow_cream_product_landing.sql
-- Phase 72B: Seed content block for REGENAGLOW NOURISH SHEER CREAM product landing.
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
    "eyebrow": "VAVAW COSMETIC CREAM",
    "title": "REGENAGLOW NOURISH SHEER CREAM",
    "headline": "Kem dưỡng phục hồi giúp khóa ẩm, làm mềm da và hỗ trợ hàng rào bảo vệ sau bước treatment.",
    "description": "REGENAGLOW NOURISH SHEER CREAM là bước kem dưỡng phục hồi trong routine VAVAW, được thiết kế để giúp duy trì độ ẩm, làm da có cảm giác mềm mại hơn và hỗ trợ làn da cần ổn định sau chăm sóc chuyên sâu.",
    "ctaLabel": "Nhận tư vấn REGENAGLOW Cream",
    "ctaHref": "/contact?type=cosmetic_interest&product=regenaglow_cream&source=product_landing",
    "secondaryCtaLabel": "Xem Luminous Set",
    "secondaryCtaHref": "/cosmetic/products/luminous-revitalization-sheer-set",
    "heroMediaSlot": "cosmetic-set-regenaglow-sheer-cream",
    "insideSet": [
      {
        "name": "REGENAGLOW NOURISH SHEER CREAM",
        "size": "30ml",
        "role": "Kem dưỡng phục hồi",
        "description": "Giúp khóa ẩm sau bước treatment, hỗ trợ cảm giác mềm mượt và duy trì hàng rào bảo vệ da ổn định hơn.",
        "mediaSlot": "cosmetic-set-regenaglow-sheer-cream"
      }
    ],
    "recoveryLogic": [
      { "step": "01. Prepare", "title": "Làm sạch và cân bằng da.", "description": "" },
      { "step": "02. Treat", "title": "Dùng ampoule hoặc serum treatment phù hợp.", "description": "" },
      { "step": "03. Recover", "title": "Hỗ trợ làn da cần phục hồi sau chăm sóc chuyên sâu.", "description": "" },
      { "step": "04. Seal", "title": "Thoa REGENAGLOW NOURISH SHEER CREAM để khóa ẩm.", "description": "" },
      { "step": "05. Protect", "title": "Ban ngày kết hợp kem chống nắng.", "description": "" }
    ],
    "activeTech": [
      {
        "name": "Collagen Water",
        "role": "Hydration support",
        "description": "Giúp da có cảm giác ẩm mượt và trông mềm mại hơn.",
        "product": "REGENAGLOW NOURISH SHEER CREAM"
      },
      {
        "name": "Peptide Complex",
        "role": "Barrier support",
        "description": "Hỗ trợ hàng rào bảo vệ và giúp bề mặt da trông săn mịn hơn.",
        "product": "REGENAGLOW NOURISH SHEER CREAM"
      },
      {
        "name": "MG3-Plus",
        "role": "Moisture-lock support",
        "description": "Hỗ trợ duy trì độ ẩm và cảm giác dễ chịu cho da sau bước treatment.",
        "product": "REGENAGLOW NOURISH SHEER CREAM"
      },
      {
        "name": "Sheer Cream Texture",
        "role": "Comfort finish",
        "description": "Kết cấu kem mỏng nhẹ, phù hợp sử dụng trong routine phục hồi sáng và tối.",
        "product": "REGENAGLOW NOURISH SHEER CREAM"
      }
    ],
    "whoItsFor": [
      "Da cần khóa ẩm sau treatment/ampoule",
      "Da khô, thiếu độ mềm mại",
      "Da cần hỗ trợ hàng rào bảo vệ",
      "Da muốn cảm giác dưỡng ẩm nhưng không quá nặng mặt",
      "Người đang dùng Luminous Set tại nhà"
    ],
    "howToUse": [
      { "step": "01", "title": "Làm sạch và cân bằng da", "description": "" },
      { "step": "02", "title": "Dùng ampoule hoặc serum treatment phù hợp", "description": "" },
      { "step": "03", "title": "Lấy lượng kem vừa đủ", "description": "" },
      { "step": "04", "title": "Thoa đều lên mặt và cổ", "description": "" },
      { "step": "05", "title": "Ban ngày dùng thêm kem chống nắng", "description": "" }
    ],
    "spaBridge": {
      "title": "Hoàn thiện routine phục hồi tại VAVAW Beauty & Co",
      "description": "REGENAGLOW NOURISH SHEER CREAM có thể được tư vấn như bước khóa ẩm sau treatment, giúp duy trì cảm giác mềm mại và hỗ trợ routine phục hồi tại nhà.",
      "ctaLabel": "Trải nghiệm tại VAVAW Beauty & Co",
      "ctaHref": "https://beauty.vavaw.vn"
    },
    "productInfo": [
      { "label": "Tên sản phẩm", "value": "REGENAGLOW NOURISH SHEER CREAM" },
      { "label": "Dung tích", "value": "30ml" },
      { "label": "Loại sản phẩm", "value": "Kem dưỡng phục hồi" },
      { "label": "Bước sử dụng", "value": "Sau ampoule/serum, trước kem chống nắng ban ngày" },
      { "label": "Gợi ý kết hợp", "value": "CELLUREVIVE Ampoule hoặc Luminous Revitalization Sheer Set" },
      { "label": "Lưu ý", "value": "Chỉ dùng ngoài da. Tránh tiếp xúc trực tiếp với mắt." }
    ],
    "finalCta": {
      "title": "Bắt đầu tư vấn REGENAGLOW Cream",
      "description": "Nhận gợi ý cách kết hợp REGENAGLOW NOURISH SHEER CREAM vào routine phục hồi phù hợp với tình trạng da của bạn.",
      "ctaLabel": "Nhận tư vấn Cream",
      "ctaHref": "/contact?type=cosmetic_interest&product=regenaglow_cream&source=product_landing_final"
    }
  }';

  SELECT id, content INTO v_block_id, v_existing_content
  FROM content_blocks
  WHERE site_key = 'main' 
    AND page_path = '/cosmetic/products/regenaglow-nourish-sheer-cream' 
    AND block_type = 'cosmetic-product-landing-regenaglow-cream'
  ORDER BY updated_at DESC
  LIMIT 1;

  IF v_block_id IS NULL THEN
    INSERT INTO content_blocks (site_key, page_path, block_type, content, is_active, sort_order)
    VALUES (
      'main',
      '/cosmetic/products/regenaglow-nourish-sheer-cream',
      'cosmetic-product-landing-regenaglow-cream',
      v_default_content,
      true,
      1
    );
    RAISE NOTICE 'Inserted missing REGENAGLOW NOURISH SHEER CREAM product landing block.';
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
      RAISE NOTICE 'Merged missing fields into existing REGENAGLOW NOURISH SHEER CREAM product landing block (%).', v_block_id;
    ELSE
      RAISE NOTICE 'REGENAGLOW NOURISH SHEER CREAM product landing block (%) is fully populated. No changes made.', v_block_id;
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
WHERE block_type = 'cosmetic-product-landing-regenaglow-cream';

