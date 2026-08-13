-- 017_seed_luminous_set_product_landing.sql
-- Phase 71C: Seed content block for Luminous Revitalization Sheer Set product landing.
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
    "eyebrow": "VAVAW COSMETIC",
    "title": "Luminous Revitalization Sheer Set",
    "headline": "Chăm sóc chuyên sâu — củng cố hàng rào bảo vệ và phục hồi làn da rạng rỡ.",
    "description": "Bộ chăm sóc phục hồi chuyên sâu kết hợp ampoule cô đặc và kem dưỡng phục hồi, hỗ trợ làn da cần phục hồi, cấp ẩm và cải thiện vẻ rạng rỡ.",
    "ctaLabel": "Nhận tư vấn Luminous Set",
    "ctaHref": "/contact?type=cosmetic_interest&product=luminous_set&source=product_landing",
    "secondaryCtaLabel": "Trải nghiệm tại VAVAW Beauty & Co",
    "secondaryCtaHref": "https://beauty.vavaw.vn",
    "heroMediaSlot": "cosmetic-product-luminous-set",
    "insideSet": [
      {
        "name": "CELLUREVIVE Ampoule",
        "size": "7ml × 4ea",
        "role": "Ampoule cô đặc",
        "description": "Hỗ trợ phục hồi làn da, cải thiện vẻ rạng rỡ và giúp bề mặt da trông mịn màng hơn.",
        "mediaSlot": "cosmetic-set-cellurevive-ampoule"
      },
      {
        "name": "REGENAGLOW NOURISH SHEER CREAM",
        "size": "30ml × 1ea",
        "role": "Kem dưỡng phục hồi",
        "description": "Giúp khóa ẩm, làm mềm da và củng cố hàng rào bảo vệ để duy trì làn da ổn định hơn.",
        "mediaSlot": "cosmetic-set-regenaglow-sheer-cream"
      }
    ],
    "recoverySteps": [
      { "step": "01. Prepare", "title": "Chuẩn bị da", "description": "Supports healthy skin hydration and balances pH levels after cleansing." },
      { "step": "02. Treat", "title": "Đặc trị chuyên sâu", "description": "Helps improve appearance of skin tone and texture with active technology." },
      { "step": "03. Recover", "title": "Phục hồi", "description": "Supports skin barrier recovery and helps maintain natural resilience." },
      { "step": "04. Seal", "title": "Khóa ẩm", "description": "Helps skin feel smoother and retains moisture for long-lasting hydration." },
      { "step": "05. Protect", "title": "Bảo vệ", "description": "Helps defend against external environmental stressors during daytime." }
    ],
    "technologies": [
      { "name": "Exosome", "role": "Hỗ trợ phục hồi & truyền tín hiệu tế bào", "description": "Công nghệ sinh học tiên tiến hỗ trợ vận chuyển dưỡng chất, giúp da trông khỏe mạnh hơn và mang lại cảm giác dễ chịu cho làn da nhạy cảm.", "foundIn": "CELLUREVIVE Ampoule" },
      { "name": "Collagen Water", "role": "Cấp ẩm & giúp duy trì săn chắc", "description": "Cung cấp nền tảng ẩm mượt dồi dào, giúp da trông căng mịn và cải thiện vẻ rạng rỡ tự nhiên.", "foundIn": "Cả hai sản phẩm" },
      { "name": "Peptide Complex", "role": "Hỗ trợ cấu trúc da", "description": "Chuỗi peptide chuyên biệt hỗ trợ hàng rào bảo vệ, giúp duy trì độ đàn hồi và bề mặt da trông săn mịn.", "foundIn": "Cả hai sản phẩm" },
      { "name": "MG3-Plus", "role": "Làm dịu & hỗ trợ giữ ẩm", "description": "Hoạt chất phục hồi giúp da cảm thấy dễ chịu hơn khi khô yếu và hỗ trợ duy trì độ ẩm trong nhiều giờ.", "foundIn": "REGENAGLOW NOURISH SHEER CREAM" }
    ],
    "whoFor": [
      "Da sau spa/treatment cần routine phục hồi nhẹ nhàng",
      "Da khô, yếu, thiếu sức sống",
      "Da cần hỗ trợ hàng rào bảo vệ",
      "Da cần cải thiện vẻ mịn màng và rạng rỡ",
      "Người muốn routine chăm sóc tại nhà sau trải nghiệm spa"
    ],
    "howToUse": [
      { "step": "01", "title": "Làm sạch và cân bằng da", "description": "Rửa mặt sạch bằng sữa rửa mặt dịu nhẹ, sau đó cân bằng độ ẩm bằng toner." },
      { "step": "02", "title": "Thoa CELLUREVIVE Ampoule", "description": "Mở nắp lọ ampoule, thoa một lượng vừa đủ lên toàn mặt." },
      { "step": "03", "title": "Massage nhẹ đến khi thẩm thấu", "description": "Vỗ nhẹ và massage hướng lên để các exosome thẩm thấu sâu vào da." },
      { "step": "04", "title": "Giữ ẩm bằng REGENAGLOW NOURISH SHEER CREAM", "description": "Thoa một lớp kem mỏng để giúp duy trì các dưỡng chất từ ampoule." },
      { "step": "05", "title": "Bảo vệ ban ngày", "description": "Luôn kết hợp kem chống nắng có màng lọc bảo vệ phổ rộng khi đi ra ngoài." }
    ],
    "spaBridge": {
      "title": "Có thể trải nghiệm trong quy trình chăm sóc tại VAVAW Beauty & Co",
      "description": "VAVAW Beauty & Co giúp khách hàng hiểu cách kết hợp sản phẩm trong trải nghiệm chăm sóc chuyên nghiệp và routine tại nhà.",
      "ctaLabel": "Trải nghiệm tại VAVAW Beauty & Co",
      "ctaHref": "https://beauty.vavaw.vn"
    },
    "productInfo": [
      { "label": "Tên sản phẩm", "value": "Luminous Revitalization Sheer Set" },
      { "label": "Quy cách đóng gói", "value": "CELLUREVIVE Ampoule (7ml × 4 lọ) & REGENAGLOW NOURISH SHEER CREAM (30ml × 1 tuýp)" },
      { "label": "Công dụng chính", "value": "Hỗ trợ phục hồi da sau trị liệu, củng cố hàng rào ẩm, cải thiện độ đàn hồi và làm sáng da tự nhiên." },
      { "label": "Hướng dẫn bảo quản", "value": "Nơi khô ráo thoáng mát, tránh ánh nắng trực tiếp. Nên dùng lọ ampoule trong vòng 7 ngày sau khi mở nắp." },
      { "label": "Lưu ý khi sử dụng", "value": "Chỉ dùng ngoài da. Tránh tiếp xúc trực tiếp với mắt. Ngưng sử dụng nếu có dấu hiệu kích ứng." }
    ],
    "finalCta": {
      "title": "Bắt đầu tư vấn Luminous Set",
      "description": "Nhận gợi ý routine phù hợp với tình trạng da và nhu cầu chăm sóc của bạn.",
      "ctaLabel": "Nhận tư vấn Luminous Set",
      "ctaHref": "/contact?type=cosmetic_interest&product=luminous_set&source=product_landing_final"
    }
  }'::jsonb;

  -- Check if block already exists (use latest if duplicates)
  SELECT id, content INTO v_block_id, v_existing_content
  FROM public.content_blocks
  WHERE site_key = 'main'
    AND page_path = '/cosmetic/products/luminous-revitalization-sheer-set'
    AND block_type = 'cosmetic-product-landing-luminous-set'
  ORDER BY updated_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    -- Insert new block
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
      '/cosmetic/products/luminous-revitalization-sheer-set',
      'cosmetic-product-landing-luminous-set',
      true,
      1,
      v_default_content,
      now(),
      now()
    );
    RAISE NOTICE 'Content block cosmetic-product-landing-luminous-set created successfully.';
  ELSE
    -- Merge missing fields only
    v_merged_content := v_existing_content;
    
    FOR v_key IN SELECT jsonb_object_keys(v_default_content) LOOP
      IF NOT (v_merged_content ? v_key) THEN
        v_merged_content := v_merged_content || jsonb_build_object(v_key, v_default_content->v_key);
      END IF;
    END LOOP;

    UPDATE public.content_blocks
    SET content = v_merged_content,
        updated_at = now()
    WHERE id = v_block_id;
    RAISE NOTICE 'Content block cosmetic-product-landing-luminous-set updated and merged successfully.';
  END IF;
END $$;

