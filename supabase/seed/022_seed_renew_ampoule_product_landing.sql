-- 022_seed_renew_ampoule_product_landing.sql
-- Phase 72E: Seed content block for Gentle Activation Renew Ampoule product landing.
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
    "title": "Gentle Activation Renew Ampoule",
    "headline": "Ampoule treatment dịu nhẹ hỗ trợ vẻ ngoài rạng rỡ, mịn màng và phục hồi sau chăm sóc chuyên sâu.",
    "description": "Gentle Activation Renew Ampoule là bước treatment trong routine phục hồi VAVAW, được thiết kế để hỗ trợ làn da cần cải thiện vẻ xỉn màu, bề mặt kém mịn và cảm giác thiếu sức sống sau các tác động hằng ngày.",
    "ctaLabel": "Nhận tư vấn Renew Ampoule",
    "ctaHref": "/contact?type=cosmetic_interest&product=renew_ampoule&source=product_landing",
    "secondaryCtaLabel": "Quay lại VAVAW Cosmetic",
    "secondaryCtaHref": "/cosmetic",
    "heroMediaSlot": "cosmetic-product-renew-ampoule",
    "insideSet": [
      {
        "name": "Gentle Activation Renew Ampoule",
        "size": "30ml",
        "role": "Ampoule treatment phục hồi rạng rỡ",
        "description": "Hỗ trợ làn da trông mịn màng, rạng rỡ hơn và giúp routine phục hồi có bước treatment chuyên sâu nhưng vẫn nhẹ nhàng.",
        "mediaSlot": "cosmetic-product-renew-ampoule"
      }
    ],
    "recoveryLogic": [
      { "step": "01. Prepare", "title": "Làm sạch và cân bằng da bằng toner.", "description": "" },
      { "step": "02. Treat", "title": "Thoa Gentle Activation Renew Ampoule như bước treatment chính.", "description": "" },
      { "step": "03. Recover", "title": "Hỗ trợ làn da trông rạng rỡ và đều bề mặt hơn.", "description": "" },
      { "step": "04. Seal", "title": "Khóa ẩm bằng gel hoặc kem dưỡng phù hợp.", "description": "" },
      { "step": "05. Protect", "title": "Ban ngày kết hợp kem chống nắng.", "description": "" }
    ],
    "activeTech": [
      {
        "name": "Exosome",
        "role": "Renewal appearance support",
        "description": "Hỗ trợ vẻ ngoài mịn màng, rạng rỡ và giúp làn da trông có sức sống hơn.",
        "product": "Gentle Activation Renew Ampoule"
      },
      {
        "name": "Bakuchiol",
        "role": "Gentle renewal support",
        "description": "Hỗ trợ routine làm mới làn da với cảm giác nhẹ nhàng hơn.",
        "product": "Gentle Activation Renew Ampoule"
      },
      {
        "name": "Peptide Complex",
        "role": "Firmness support",
        "description": "Hỗ trợ hàng rào bảo vệ và giúp bề mặt da trông săn mịn hơn.",
        "product": "Gentle Activation Renew Ampoule"
      },
      {
        "name": "Hydration Support",
        "role": "Comfort layer",
        "description": "Giúp làn da có cảm giác ẩm mượt và dễ chịu hơn sau bước treatment.",
        "product": "Gentle Activation Renew Ampoule"
      }
    ],
    "whoItsFor": [
      "Da xỉn màu, thiếu sức sống",
      "Da cần cải thiện vẻ mịn màng",
      "Da cần bước treatment dịu nhẹ trong routine phục hồi",
      "Da sau chăm sóc chuyên sâu cần routine tại nhà ổn định",
      "Người muốn hỗ trợ vẻ ngoài rạng rỡ mà không làm routine quá nặng"
    ],
    "howToUse": [
      { "step": "01", "title": "Làm sạch và cân bằng da", "description": "" },
      { "step": "02", "title": "Lấy lượng ampoule vừa đủ", "description": "" },
      { "step": "03", "title": "Thoa đều lên mặt, tránh vùng mắt", "description": "" },
      { "step": "04", "title": "Vỗ nhẹ đến khi thẩm thấu", "description": "" },
      { "step": "05", "title": "Khóa ẩm bằng gel hoặc kem dưỡng phù hợp", "description": "" }
    ],
    "spaBridge": {
      "title": "Bước treatment rạng rỡ trong routine tại VAVAW Beauty & Co",
      "description": "Gentle Activation Renew Ampoule có thể được tư vấn như bước treatment hỗ trợ vẻ ngoài rạng rỡ và mịn màng hơn trong routine phục hồi tại nhà sau trải nghiệm chăm sóc chuyên sâu.",
      "ctaLabel": "Trải nghiệm tại VAVAW Beauty & Co",
      "ctaHref": "/go/beauty"
    },
    "productInfo": [
      { "label": "Tên sản phẩm", "value": "Gentle Activation Renew Ampoule" },
      { "label": "Dung tích", "value": "30ml" },
      { "label": "Loại sản phẩm", "value": "Ampoule treatment" },
      { "label": "Bước sử dụng", "value": "Sau toner, trước gel/kem dưỡng" },
      { "label": "Gợi ý kết hợp", "value": "P30 Boost Facial Hydrating Toner hoặc REGENAGLOW NOURISH SHEER CREAM" },
      { "label": "Lưu ý", "value": "Chỉ dùng ngoài da. Tránh tiếp xúc trực tiếp với mắt." }
    ],
    "finalCta": {
      "title": "Bắt đầu tư vấn Renew Ampoule",
      "description": "Nhận gợi ý cách kết hợp Gentle Activation Renew Ampoule vào routine phục hồi phù hợp với tình trạng da của bạn.",
      "ctaLabel": "Nhận tư vấn Renew Ampoule",
      "ctaHref": "/contact?type=cosmetic_interest&product=renew_ampoule&source=product_landing_final"
    }
  }';

  SELECT id, content INTO v_block_id, v_existing_content
  FROM content_blocks
  WHERE site_key = 'main' 
    AND page_path = '/cosmetic/products/gentle-activation-renew-ampoule' 
    AND block_type = 'cosmetic-product-landing-renew-ampoule'
  ORDER BY updated_at DESC
  LIMIT 1;

  IF v_block_id IS NULL THEN
    INSERT INTO content_blocks (site_key, page_path, block_type, content, is_active, sort_order)
    VALUES (
      'main',
      '/cosmetic/products/gentle-activation-renew-ampoule',
      'cosmetic-product-landing-renew-ampoule',
      v_default_content,
      true,
      1
    );
    RAISE NOTICE 'Inserted missing Gentle Activation Renew Ampoule product landing block.';
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
      RAISE NOTICE 'Merged missing fields into existing Gentle Activation Renew Ampoule product landing block (%).', v_block_id;
    ELSE
      RAISE NOTICE 'Gentle Activation Renew Ampoule product landing block (%) is fully populated. No changes made.', v_block_id;
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
WHERE block_type = 'cosmetic-product-landing-renew-ampoule';
