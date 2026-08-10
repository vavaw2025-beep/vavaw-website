-- 024_seed_lumiglow_sunscreen_product_landing.sql
-- Phase 72G: Seed content block for LUMIGLOW ROSY SHEER SUNSCREEN product landing.
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
    "eyebrow": "VAVAW COSMETIC SUNSCREEN",
    "title": "LUMIGLOW ROSY SHEER SUNSCREEN",
    "headline": "Kem chống nắng nâng tông hồng nhẹ giúp bảo vệ da ban ngày và hoàn thiện routine phục hồi.",
    "description": "LUMIGLOW ROSY SHEER SUNSCREEN là bước bảo vệ ban ngày trong routine VAVAW, được thiết kế để hỗ trợ bảo vệ da trước tác động môi trường, tạo hiệu ứng da sáng khỏe tự nhiên và hoàn thiện routine phục hồi hằng ngày.",
    "ctaLabel": "Nhận tư vấn LUMIGLOW Sunscreen",
    "ctaHref": "/contact?type=cosmetic_interest&product=lumiglow_sunscreen&source=product_landing",
    "secondaryCtaLabel": "Quay lại VAVAW Cosmetic",
    "secondaryCtaHref": "/cosmetic",
    "heroMediaSlot": "cosmetic-product-lumiglow-sunscreen",
    "insideSet": [
      {
        "name": "LUMIGLOW ROSY SHEER SUNSCREEN",
        "size": "50ml",
        "role": "Kem chống nắng nâng tông hồng nhẹ",
        "description": "Hỗ trợ bảo vệ da ban ngày, giúp da trông sáng khỏe tự nhiên và phù hợp để hoàn thiện routine phục hồi buổi sáng.",
        "mediaSlot": "cosmetic-product-lumiglow-sunscreen"
      }
    ],
    "recoveryLogic": [
      { "step": "01. Prepare", "title": "Làm sạch và cân bằng da.", "description": "" },
      { "step": "02. Treat", "title": "Dùng serum hoặc ampoule phù hợp nếu có.", "description": "" },
      { "step": "03. Recover", "title": "Dưỡng ẩm bằng gel hoặc kem dưỡng.", "description": "" },
      { "step": "04. Seal", "title": "Hoàn thiện lớp dưỡng trước chống nắng.", "description": "" },
      { "step": "05. Protect", "title": "Thoa LUMIGLOW ROSY SHEER SUNSCREEN vào ban ngày.", "description": "" }
    ],
    "activeTech": [
      {
        "name": "Hybrid UV Filter",
        "role": "Daily protection shield",
        "description": "Hỗ trợ bảo vệ da khỏi tác động của ánh nắng trong routine ban ngày.",
        "product": "LUMIGLOW ROSY SHEER SUNSCREEN"
      },
      {
        "name": "Rosy Tone-Up Finish",
        "role": "Healthy glow appearance",
        "description": "Giúp da trông sáng khỏe tự nhiên với hiệu ứng hồng nhẹ.",
        "product": "LUMIGLOW ROSY SHEER SUNSCREEN"
      },
      {
        "name": "Moisture Support",
        "role": "Comfort layer",
        "description": "Hỗ trợ cảm giác ẩm mượt và dễ chịu khi dùng hằng ngày.",
        "product": "LUMIGLOW ROSY SHEER SUNSCREEN"
      },
      {
        "name": "Sheer Sunscreen Texture",
        "role": "Lightweight daytime finish",
        "description": "Kết cấu mỏng nhẹ, phù hợp sử dụng sau routine dưỡng buổi sáng.",
        "product": "LUMIGLOW ROSY SHEER SUNSCREEN"
      }
    ],
    "whoItsFor": [
      "Da cần kem chống nắng dùng hằng ngày",
      "Da muốn hiệu ứng sáng khỏe hồng nhẹ",
      "Da đang trong routine phục hồi buổi sáng",
      "Người muốn lớp chống nắng mỏng nhẹ, dễ dùng",
      "Người cần hoàn thiện routine chăm sóc tại nhà"
    ],
    "howToUse": [
      { "step": "01", "title": "Hoàn thiện các bước dưỡng da buổi sáng", "description": "" },
      { "step": "02", "title": "Lấy lượng kem chống nắng vừa đủ", "description": "" },
      { "step": "03", "title": "Thoa đều lên mặt và cổ", "description": "" },
      { "step": "04", "title": "Dặm lại khi cần thiết trong ngày", "description": "" },
      { "step": "05", "title": "Kết hợp che chắn khi tiếp xúc ánh nắng lâu", "description": "" }
    ],
    "spaBridge": {
      "title": "Bước bảo vệ ban ngày trong routine tại VAVAW Beauty & Co",
      "description": "LUMIGLOW ROSY SHEER SUNSCREEN có thể được tư vấn như bước bảo vệ ban ngày sau routine phục hồi, giúp duy trì làn da trông sáng khỏe và được chăm sóc đều đặn.",
      "ctaLabel": "Trải nghiệm tại VAVAW Beauty & Co",
      "ctaHref": "/go/beauty"
    },
    "productInfo": [
      { "label": "Tên sản phẩm", "value": "LUMIGLOW ROSY SHEER SUNSCREEN" },
      { "label": "Dung tích", "value": "50ml" },
      { "label": "Loại sản phẩm", "value": "Kem chống nắng nâng tông" },
      { "label": "Bước sử dụng", "value": "Bước cuối routine buổi sáng" },
      { "label": "Gợi ý kết hợp", "value": "P30 Boost Facial Moisturizer hoặc REGENAGLOW NOURISH SHEER CREAM" },
      { "label": "Lưu ý", "value": "Chỉ dùng ngoài da. Tránh tiếp xúc trực tiếp với mắt. Dùng lại khi cần thiết trong ngày." }
    ],
    "finalCta": {
      "title": "Bắt đầu tư vấn LUMIGLOW Sunscreen",
      "description": "Nhận gợi ý cách kết hợp LUMIGLOW ROSY SHEER SUNSCREEN vào routine ban ngày phù hợp với tình trạng da của bạn.",
      "ctaLabel": "Nhận tư vấn Sunscreen",
      "ctaHref": "/contact?type=cosmetic_interest&product=lumiglow_sunscreen&source=product_landing_final"
    }
  }';

  SELECT id, content INTO v_block_id, v_existing_content
  FROM content_blocks
  WHERE site_key = 'main' 
    AND page_path = '/cosmetic/products/lumiglow-rosy-sheer-sunscreen' 
    AND block_type = 'cosmetic-product-landing-lumiglow-sunscreen'
  ORDER BY updated_at DESC
  LIMIT 1;

  IF v_block_id IS NULL THEN
    INSERT INTO content_blocks (site_key, page_path, block_type, content, is_active, sort_order)
    VALUES (
      'main',
      '/cosmetic/products/lumiglow-rosy-sheer-sunscreen',
      'cosmetic-product-landing-lumiglow-sunscreen',
      v_default_content,
      true,
      1
    );
    RAISE NOTICE 'Inserted missing LUMIGLOW ROSY SHEER SUNSCREEN product landing block.';
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
      RAISE NOTICE 'Merged missing fields into existing LUMIGLOW ROSY SHEER SUNSCREEN product landing block (%).', v_block_id;
    ELSE
      RAISE NOTICE 'LUMIGLOW ROSY SHEER SUNSCREEN product landing block (%) is fully populated. No changes made.', v_block_id;
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
WHERE block_type = 'cosmetic-product-landing-lumiglow-sunscreen';
