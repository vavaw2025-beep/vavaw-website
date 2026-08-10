-- 020_seed_calmiance_gel_product_landing.sql
-- Phase 72C: Seed content block for Calmiance Superior Sheer Gel product landing.
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
    "eyebrow": "VAVAW COSMETIC RECOVERY GEL",
    "title": "Calmiance Superior Sheer Gel",
    "headline": "Gel phục hồi mỏng nhẹ giúp làm dịu cảm giác khó chịu và hỗ trợ làn da cần cân bằng sau chăm sóc chuyên sâu.",
    "description": "Calmiance Superior Sheer Gel là bước gel phục hồi trong routine VAVAW, được thiết kế cho làn da cần cảm giác nhẹ dịu, ẩm mát và hỗ trợ hàng rào bảo vệ trong quá trình phục hồi hằng ngày.",
    "ctaLabel": "Nhận tư vấn Calmiance Gel",
    "ctaHref": "/contact?type=cosmetic_interest&product=calmiance_gel&source=product_landing",
    "secondaryCtaLabel": "Quay lại VAVAW Cosmetic",
    "secondaryCtaHref": "/cosmetic",
    "heroMediaSlot": "cosmetic-product-calmiance-gel",
    "insideSet": [
      {
        "name": "Calmiance Superior Sheer Gel",
        "size": "120ml",
        "role": "Gel phục hồi mỏng nhẹ",
        "description": "Hỗ trợ cảm giác dễ chịu cho da, giúp cấp ẩm nhẹ và duy trì hàng rào bảo vệ da ổn định hơn.",
        "mediaSlot": "cosmetic-product-calmiance-gel"
      }
    ],
    "recoveryLogic": [
      { "step": "01. Prepare", "title": "Làm sạch và cân bằng da.", "description": "" },
      { "step": "02. Treat", "title": "Dùng treatment phù hợp nếu có.", "description": "" },
      { "step": "03. Recover", "title": "Thoa Calmiance Superior Sheer Gel để hỗ trợ cảm giác dịu mát.", "description": "" },
      { "step": "04. Seal", "title": "Có thể khóa ẩm thêm bằng kem dưỡng nếu da khô.", "description": "" },
      { "step": "05. Protect", "title": "Ban ngày kết hợp kem chống nắng.", "description": "" }
    ],
    "activeTech": [
      {
        "name": "Cica 7 Complex",
        "role": "Soothing barrier care",
        "description": "Hỗ trợ cảm giác dễ chịu cho da và giúp làn da trông ổn định hơn.",
        "product": "Calmiance Superior Sheer Gel"
      },
      {
        "name": "Hyaluronic Acid",
        "role": "Lightweight hydration",
        "description": "Giúp bổ sung cảm giác ẩm mượt mà không làm da nặng mặt.",
        "product": "Calmiance Superior Sheer Gel"
      },
      {
        "name": "Peptide Support",
        "role": "Barrier support",
        "description": "Hỗ trợ hàng rào bảo vệ và giúp bề mặt da trông mềm mịn hơn.",
        "product": "Calmiance Superior Sheer Gel"
      },
      {
        "name": "Sheer Gel Texture",
        "role": "Cooling comfort finish",
        "description": "Kết cấu gel mỏng nhẹ, phù hợp dùng sáng và tối trong routine phục hồi.",
        "product": "Calmiance Superior Sheer Gel"
      }
    ],
    "whoItsFor": [
      "Da cần cảm giác dịu nhẹ sau chăm sóc chuyên sâu",
      "Da khô nhẹ, thiếu nước hoặc dễ căng",
      "Da cần routine phục hồi mỏng nhẹ",
      "Da muốn cấp ẩm nhưng không thích cảm giác bí nặng",
      "Người cần sản phẩm hỗ trợ hàng rào bảo vệ trong routine hằng ngày"
    ],
    "howToUse": [
      { "step": "01", "title": "Làm sạch và cân bằng da", "description": "" },
      { "step": "02", "title": "Lấy lượng gel vừa đủ", "description": "" },
      { "step": "03", "title": "Thoa đều lên mặt và cổ", "description": "" },
      { "step": "04", "title": "Vỗ nhẹ để gel thẩm thấu", "description": "" },
      { "step": "05", "title": "Ban ngày dùng thêm kem chống nắng", "description": "" }
    ],
    "spaBridge": {
      "title": "Bước phục hồi nhẹ dịu trong routine tại VAVAW Beauty & Co",
      "description": "Calmiance Superior Sheer Gel có thể được tư vấn như bước hỗ trợ phục hồi nhẹ nhàng sau trải nghiệm chăm sóc chuyên sâu, giúp duy trì cảm giác ẩm mát và dễ chịu cho làn da.",
      "ctaLabel": "Trải nghiệm tại VAVAW Beauty & Co",
      "ctaHref": "/go/beauty"
    },
    "productInfo": [
      { "label": "Tên sản phẩm", "value": "Calmiance Superior Sheer Gel" },
      { "label": "Dung tích", "value": "120ml" },
      { "label": "Loại sản phẩm", "value": "Gel phục hồi mỏng nhẹ" },
      { "label": "Bước sử dụng", "value": "Sau toner hoặc treatment, trước kem dưỡng nếu cần" },
      { "label": "Gợi ý kết hợp", "value": "P30 Boost Facial Hydrating Toner hoặc REGENAGLOW NOURISH SHEER CREAM" },
      { "label": "Lưu ý", "value": "Chỉ dùng ngoài da. Tránh tiếp xúc trực tiếp với mắt." }
    ],
    "finalCta": {
      "title": "Bắt đầu tư vấn Calmiance Gel",
      "description": "Nhận gợi ý cách kết hợp Calmiance Superior Sheer Gel vào routine phục hồi phù hợp với tình trạng da của bạn.",
      "ctaLabel": "Nhận tư vấn Calmiance Gel",
      "ctaHref": "/contact?type=cosmetic_interest&product=calmiance_gel&source=product_landing_final"
    }
  }';

  SELECT id, content INTO v_block_id, v_existing_content
  FROM content_blocks
  WHERE site_key = 'main' 
    AND page_path = '/cosmetic/products/calmiance-superior-sheer-gel' 
    AND block_type = 'cosmetic-product-landing-calmiance-gel'
  ORDER BY updated_at DESC
  LIMIT 1;

  IF v_block_id IS NULL THEN
    INSERT INTO content_blocks (site_key, page_path, block_type, content, is_active, sort_order)
    VALUES (
      'main',
      '/cosmetic/products/calmiance-superior-sheer-gel',
      'cosmetic-product-landing-calmiance-gel',
      v_default_content,
      true,
      1
    );
    RAISE NOTICE 'Inserted missing Calmiance Superior Sheer Gel product landing block.';
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
      RAISE NOTICE 'Merged missing fields into existing Calmiance Superior Sheer Gel product landing block (%).', v_block_id;
    ELSE
      RAISE NOTICE 'Calmiance Superior Sheer Gel product landing block (%) is fully populated. No changes made.', v_block_id;
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
WHERE block_type = 'cosmetic-product-landing-calmiance-gel';
