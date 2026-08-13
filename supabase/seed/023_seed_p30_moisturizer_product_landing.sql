-- 023_seed_p30_moisturizer_product_landing.sql
-- Phase 72F: Seed content block for P30 Boost Facial Moisturizer product landing.
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
    "eyebrow": "VAVAW COSMETIC MOISTURIZER",
    "title": "P30 Boost Facial Moisturizer",
    "headline": "Kem dưỡng cấp ẩm giúp khóa lại độ ẩm và hỗ trợ làn da mềm mại, ổn định hơn sau các bước phục hồi.",
    "description": "P30 Boost Facial Moisturizer là bước dưỡng ẩm trong routine VAVAW, được thiết kế để giúp duy trì cảm giác ẩm mượt, hỗ trợ hàng rào bảo vệ và hoàn thiện routine phục hồi hằng ngày.",
    "ctaLabel": "Nhận tư vấn P30 Moisturizer",
    "ctaHref": "/contact?type=cosmetic_interest&product=p30_moisturizer&source=product_landing",
    "secondaryCtaLabel": "Quay lại VAVAW Cosmetic",
    "secondaryCtaHref": "/cosmetic",
    "heroMediaSlot": "cosmetic-product-p30-moisturizer",
    "insideSet": [
      {
        "name": "P30 Boost Facial Moisturizer",
        "size": "50ml",
        "role": "Kem dưỡng cấp ẩm",
        "description": "Hỗ trợ duy trì độ ẩm, làm da có cảm giác mềm mại hơn và giúp routine phục hồi ổn định sau toner hoặc treatment.",
        "mediaSlot": "cosmetic-product-p30-moisturizer"
      }
    ],
    "recoveryLogic": [
      { "step": "01. Prepare", "title": "Làm sạch và cân bằng da bằng toner.", "description": "" },
      { "step": "02. Treat", "title": "Dùng ampoule hoặc serum phù hợp nếu có.", "description": "" },
      { "step": "03. Recover", "title": "Hỗ trợ làn da cần cấp ẩm và ổn định.", "description": "" },
      { "step": "04. Seal", "title": "Thoa P30 Boost Facial Moisturizer để khóa ẩm.", "description": "" },
      { "step": "05. Protect", "title": "Ban ngày kết hợp kem chống nắng.", "description": "" }
    ],
    "activeTech": [
      {
        "name": "Hyaluronic Acid",
        "role": "Hydration support",
        "description": "Giúp da có cảm giác ẩm mượt và mềm mại hơn.",
        "product": "P30 Boost Facial Moisturizer"
      },
      {
        "name": "P30 Moisture Complex",
        "role": "Moisture-lock support",
        "description": "Hỗ trợ duy trì độ ẩm và cảm giác dễ chịu cho da trong routine hằng ngày.",
        "product": "P30 Boost Facial Moisturizer"
      },
      {
        "name": "Peptide Support",
        "role": "Barrier support",
        "description": "Hỗ trợ hàng rào bảo vệ và giúp bề mặt da trông mịn màng hơn.",
        "product": "P30 Boost Facial Moisturizer"
      },
      {
        "name": "Soft Cream Texture",
        "role": "Daily comfort finish",
        "description": "Kết cấu kem mềm nhẹ, phù hợp sử dụng sáng và tối sau toner hoặc treatment.",
        "product": "P30 Boost Facial Moisturizer"
      }
    ],
    "whoItsFor": [
      "Da cần dưỡng ẩm sau toner hoặc ampoule",
      "Da khô nhẹ, thiếu độ mềm mại",
      "Da cần hỗ trợ hàng rào bảo vệ",
      "Da muốn kem dưỡng dùng hằng ngày không quá nặng mặt",
      "Người đang xây dựng routine phục hồi tại nhà"
    ],
    "howToUse": [
      { "step": "01", "title": "Làm sạch và cân bằng da", "description": "" },
      { "step": "02", "title": "Dùng ampoule hoặc serum nếu có", "description": "" },
      { "step": "03", "title": "Lấy lượng kem vừa đủ", "description": "" },
      { "step": "04", "title": "Thoa đều lên mặt và cổ", "description": "" },
      { "step": "05", "title": "Ban ngày dùng thêm kem chống nắng", "description": "" }
    ],
    "spaBridge": {
      "title": "Bước khóa ẩm trong routine tại VAVAW Beauty & Co",
      "description": "P30 Boost Facial Moisturizer có thể được tư vấn như bước dưỡng ẩm hằng ngày, giúp hoàn thiện routine phục hồi sau các bước cấp ẩm hoặc treatment chuyên sâu.",
      "ctaLabel": "Trải nghiệm tại VAVAW Beauty & Co",
      "ctaHref": "https://beauty.vavaw.vn"
    },
    "productInfo": [
      { "label": "Tên sản phẩm", "value": "P30 Boost Facial Moisturizer" },
      { "label": "Dung tích", "value": "50ml" },
      { "label": "Loại sản phẩm", "value": "Kem dưỡng cấp ẩm" },
      { "label": "Bước sử dụng", "value": "Sau toner/ampoule/serum, trước kem chống nắng ban ngày" },
      { "label": "Gợi ý kết hợp", "value": "P30 Boost Facial Hydrating Toner hoặc Gentle Activation Renew Ampoule" },
      { "label": "Lưu ý", "value": "Chỉ dùng ngoài da. Tránh tiếp xúc trực tiếp với mắt." }
    ],
    "finalCta": {
      "title": "Bắt đầu tư vấn P30 Moisturizer",
      "description": "Nhận gợi ý cách kết hợp P30 Boost Facial Moisturizer vào routine phục hồi phù hợp với tình trạng da của bạn.",
      "ctaLabel": "Nhận tư vấn P30 Moisturizer",
      "ctaHref": "/contact?type=cosmetic_interest&product=p30_moisturizer&source=product_landing_final"
    }
  }';

  SELECT id, content INTO v_block_id, v_existing_content
  FROM content_blocks
  WHERE site_key = 'main' 
    AND page_path = '/cosmetic/products/p30-boost-facial-moisturizer' 
    AND block_type = 'cosmetic-product-landing-p30-moisturizer'
  ORDER BY updated_at DESC
  LIMIT 1;

  IF v_block_id IS NULL THEN
    INSERT INTO content_blocks (site_key, page_path, block_type, content, is_active, sort_order)
    VALUES (
      'main',
      '/cosmetic/products/p30-boost-facial-moisturizer',
      'cosmetic-product-landing-p30-moisturizer',
      v_default_content,
      true,
      1
    );
    RAISE NOTICE 'Inserted missing P30 Boost Facial Moisturizer product landing block.';
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
      RAISE NOTICE 'Merged missing fields into existing P30 Boost Facial Moisturizer product landing block (%).', v_block_id;
    ELSE
      RAISE NOTICE 'P30 Boost Facial Moisturizer product landing block (%) is fully populated. No changes made.', v_block_id;
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
WHERE block_type = 'cosmetic-product-landing-p30-moisturizer';

