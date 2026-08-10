-- 021_seed_p30_toner_product_landing.sql
-- Phase 72D: Seed content block for P30 Boost Facial Hydrating Toner product landing.
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
    "eyebrow": "VAVAW COSMETIC TONER",
    "title": "P30 Boost Facial Hydrating Toner",
    "headline": "Toner cân bằng độ ẩm giúp chuẩn bị làn da cho các bước phục hồi và dưỡng chất tiếp theo.",
    "description": "P30 Boost Facial Hydrating Toner là bước prepare trong routine VAVAW, hỗ trợ cân bằng cảm giác ẩm mượt sau làm sạch, giúp bề mặt da sẵn sàng hơn cho ampoule, serum và kem dưỡng.",
    "ctaLabel": "Nhận tư vấn P30 Toner",
    "ctaHref": "/contact?type=cosmetic_interest&product=p30_toner&source=product_landing",
    "secondaryCtaLabel": "Quay lại VAVAW Cosmetic",
    "secondaryCtaHref": "/cosmetic",
    "heroMediaSlot": "cosmetic-product-p30-toner",
    "insideSet": [
      {
        "name": "P30 Boost Facial Hydrating Toner",
        "size": "150ml",
        "role": "Toner cân bằng độ ẩm",
        "description": "Hỗ trợ làm mềm bề mặt da sau làm sạch, giúp da có cảm giác ẩm mượt và sẵn sàng cho các bước phục hồi tiếp theo.",
        "mediaSlot": "cosmetic-product-p30-toner"
      }
    ],
    "recoveryLogic": [
      { "step": "01. Prepare", "title": "Dùng toner sau làm sạch để cân bằng cảm giác ẩm mượt.", "description": "" },
      { "step": "02. Treat", "title": "Tiếp tục với ampoule hoặc serum phù hợp.", "description": "" },
      { "step": "03. Recover", "title": "Hỗ trợ routine phục hồi bằng bước cấp ẩm nền.", "description": "" },
      { "step": "04. Seal", "title": "Khóa ẩm bằng gel hoặc kem dưỡng.", "description": "" },
      { "step": "05. Protect", "title": "Ban ngày kết hợp kem chống nắng.", "description": "" }
    ],
    "activeTech": [
      {
        "name": "Hyaluronic Acid",
        "role": "Hydration layer",
        "description": "Giúp làn da có cảm giác ẩm mượt và mềm mại hơn sau bước làm sạch.",
        "product": "P30 Boost Facial Hydrating Toner"
      },
      {
        "name": "P30 Moisture Complex",
        "role": "Moisture preparation",
        "description": "Hỗ trợ chuẩn bị bề mặt da để tiếp nhận các bước chăm sóc tiếp theo.",
        "product": "P30 Boost Facial Hydrating Toner"
      },
      {
        "name": "Panthenol Support",
        "role": "Comfort support",
        "description": "Hỗ trợ cảm giác dễ chịu và cân bằng cho da trong routine hằng ngày.",
        "product": "P30 Boost Facial Hydrating Toner"
      },
      {
        "name": "Lightweight Water Texture",
        "role": "Fresh finish",
        "description": "Kết cấu nước nhẹ, phù hợp dùng sáng và tối trước các bước phục hồi.",
        "product": "P30 Boost Facial Hydrating Toner"
      }
    ],
    "whoItsFor": [
      "Da cần cân bằng sau làm sạch",
      "Da khô nhẹ hoặc thiếu nước",
      "Da cần bước prepare trước ampoule/serum",
      "Da muốn routine cấp ẩm nhẹ nhàng",
      "Người đang xây dựng routine phục hồi tại nhà"
    ],
    "howToUse": [
      { "step": "01", "title": "Làm sạch da", "description": "" },
      { "step": "02", "title": "Lấy toner ra tay hoặc bông cotton", "description": "" },
      { "step": "03", "title": "Thoa/vỗ nhẹ lên mặt và cổ", "description": "" },
      { "step": "04", "title": "Tiếp tục với ampoule hoặc serum", "description": "" },
      { "step": "05", "title": "Khóa ẩm bằng gel hoặc kem dưỡng phù hợp", "description": "" }
    ],
    "spaBridge": {
      "title": "Bước chuẩn bị da trong routine tại VAVAW Beauty & Co",
      "description": "P30 Boost Facial Hydrating Toner có thể được tư vấn như bước cân bằng và chuẩn bị làn da trước các bước phục hồi chuyên sâu trong routine tại nhà.",
      "ctaLabel": "Trải nghiệm tại VAVAW Beauty & Co",
      "ctaHref": "/go/beauty"
    },
    "productInfo": [
      { "label": "Tên sản phẩm", "value": "P30 Boost Facial Hydrating Toner" },
      { "label": "Dung tích", "value": "150ml" },
      { "label": "Loại sản phẩm", "value": "Toner cấp ẩm" },
      { "label": "Bước sử dụng", "value": "Sau làm sạch, trước ampoule/serum" },
      { "label": "Gợi ý kết hợp", "value": "Calmiance Superior Sheer Gel hoặc P30 Boost Facial Moisturizer" },
      { "label": "Lưu ý", "value": "Chỉ dùng ngoài da. Tránh tiếp xúc trực tiếp với mắt." }
    ],
    "finalCta": {
      "title": "Bắt đầu tư vấn P30 Toner",
      "description": "Nhận gợi ý cách kết hợp P30 Boost Facial Hydrating Toner vào routine phục hồi phù hợp với tình trạng da của bạn.",
      "ctaLabel": "Nhận tư vấn P30 Toner",
      "ctaHref": "/contact?type=cosmetic_interest&product=p30_toner&source=product_landing_final"
    }
  }';

  SELECT id, content INTO v_block_id, v_existing_content
  FROM content_blocks
  WHERE site_key = 'main' 
    AND page_path = '/cosmetic/products/p30-boost-facial-hydrating-toner' 
    AND block_type = 'cosmetic-product-landing-p30-toner'
  ORDER BY updated_at DESC
  LIMIT 1;

  IF v_block_id IS NULL THEN
    INSERT INTO content_blocks (site_key, page_path, block_type, content, is_active, sort_order)
    VALUES (
      'main',
      '/cosmetic/products/p30-boost-facial-hydrating-toner',
      'cosmetic-product-landing-p30-toner',
      v_default_content,
      true,
      1
    );
    RAISE NOTICE 'Inserted missing P30 Boost Facial Hydrating Toner product landing block.';
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
      RAISE NOTICE 'Merged missing fields into existing P30 Boost Facial Hydrating Toner product landing block (%).', v_block_id;
    ELSE
      RAISE NOTICE 'P30 Boost Facial Hydrating Toner product landing block (%) is fully populated. No changes made.', v_block_id;
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
WHERE block_type = 'cosmetic-product-landing-p30-toner';
