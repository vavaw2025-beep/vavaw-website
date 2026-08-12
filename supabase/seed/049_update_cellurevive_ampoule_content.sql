-- 049_update_cellurevive_ampoule_content.sql
-- Phase 81A: CELLUREVIVE Ampoule Product Content Completion
-- Non-destructive update: Populates verified Product Detail Form & complete product content for CELLUREVIVE Ampoule.

DO $$
DECLARE
  v_block_id uuid;
  v_default_content jsonb;
  v_existing_content jsonb;
  v_merged_content jsonb;
  v_pdf jsonb;
BEGIN
  v_pdf := jsonb_build_object(
    'eyebrow', 'PRODUCT INFORMATION',
    'title', 'CELLUREVIVE INTENSIVE SHEER AMPOULE',
    'description', 'Thông tin chi tiết về sản phẩm Tinh chất CelluRevive Intensive Sheer Ampoule theo hồ sơ mỹ phẩm chính thức.',
    'showDescription', true,
    'showLegalInfo', true,
    'showProductItems', true,
    'showIngredients', true,
    'showCautions', true,
    'showStorage', true,
    'showQualityGuarantee', true,
    'legalInfo', jsonb_build_array(
      jsonb_build_object('label', 'Tên sản phẩm', 'value', 'Tinh chất CelluRevive Intensive Sheer Ampoule'),
      jsonb_build_object('label', 'Dung tích', 'value', '7 ml × 4 ống'),
      jsonb_build_object('label', 'Đối tượng sử dụng', 'value', 'Phù hợp cho mọi loại da, đặc biệt là da mỏng yếu và da cần phục hồi', 'highlight', true),
      jsonb_build_object('label', 'Hạn sử dụng sau khi mở nắp', 'value', '12 tháng'),
      jsonb_build_object('label', 'Hạn sử dụng trước khi mở nắp', 'value', 'Xem trên bao bì sản phẩm'),
      jsonb_build_object('label', 'Nhà sản xuất', 'value', 'IRE Cosmetic Co., Ltd.'),
      jsonb_build_object('label', 'Đơn vị phân phối', 'value', 'BRL Company Co., Ltd.', 'highlight', true),
      jsonb_build_object('label', 'Trung tâm chăm sóc khách hàng', 'value', '070-7633-0987', 'highlight', true),
      jsonb_build_object('label', 'Nước sản xuất', 'value', 'Hàn Quốc'),
      jsonb_build_object('label', 'Tình trạng phê duyệt MFDS', 'value', 'Có (Mỹ phẩm chức năng: Hỗ trợ cải thiện nếp nhăn)', 'highlight', true),
      jsonb_build_object('label', 'Hướng dẫn sử dụng', 'value', 'Lấy một lượng vừa đủ thoa đều lên da mặt sau bước toner, vỗ nhẹ để tinh chất thẩm thấu.', 'highlight', true)
    ),
    'productItems', jsonb_build_array(
      jsonb_build_object(
        'name', 'Tinh chất CelluRevive Intensive Sheer Ampoule',
        'volume', '7 ml × 4 ống',
        'functionClaim', 'Mỹ phẩm chức năng: Hỗ trợ cải thiện nếp nhăn',
        'ingredients', 'Nước Collagen (830,000 ppm), Methylpropanediol, Glycerin, Glyceryl Acrylate/Acrylic Acid Copolymer, Sodium Hyaluronate, 1,2-Hexanediol, Túi ngoại bào từ tế bào mô sẹo Rau Má (Centella Asiatica Callus Extracellular Vesicles) (10,000 ppm), SH-Oligopeptide-2, Carbomer, Arginine, Polyglyceryl-10 Laurate, Ethylhexylglycerin, Adenosine, Trisodium EDTA, SH-Polypeptide-1, RH-Oligopeptide-1, Hydrolyzed Hyaluronic Acid, Hyaluronic Acid, Hydroxypropyltrimonium Hyaluronate, Sodium Acetylated Hyaluronate, Sodium Hyaluronate Crosspolymer, Hydrolyzed Sodium Hyaluronate, Potassium Hyaluronate, Sodium Hyaluronate Dimethylsilanol, Dimethylsilanol Hyaluronate, Butylene Glycol.'
      )
    ),
    'cautions', jsonb_build_array(
      'Nếu xuất hiện triệu chứng bất thường như nổi mẩn đỏ, sưng tấy hoặc ngứa do tiếp xúc trực tiếp với ánh nắng khi sử dụng, hãy ngưng sử dụng và tham khảo ý kiến bác sĩ chuyên khoa da liễu.',
      'Không dùng trên vùng da có vết thương hở.',
      'Bảo quản xa tầm tay trẻ em.',
      'Tránh ánh nắng trực tiếp.'
    ),
    'storage', 'Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.',
    'qualityGuarantee', 'Trong trường hợp sản phẩm có lỗi, việc bồi thường sẽ được thực hiện theo Tiêu chuẩn giải quyết tranh chấp người tiêu dùng do Ủy ban Thương mại Công bằng Hàn Quốc ban hành.'
  );

  v_default_content := jsonb_build_object(
    'eyebrow', 'VAVAW COSMETIC AMPOULE',
    'title', 'CELLUREVIVE Ampoule',
    'headline', 'Ampoule cô đặc hỗ trợ phục hồi làn da và cải thiện vẻ rạng rỡ sau chăm sóc chuyên sâu.',
    'description', 'CELLUREVIVE Ampoule là bước treatment chuyên sâu trong routine phục hồi VAVAW, được thiết kế để hỗ trợ làn da cần cấp ẩm, làm dịu và cải thiện bề mặt da trông mịn màng hơn.',
    'ctaLabel', 'Nhận tư vấn CELLUREVIVE Ampoule',
    'ctaHref', '/contact?type=cosmetic_interest&product=cellurevive_ampoule&source=product_landing',
    'secondaryCtaLabel', 'Khám phá Luminous Set',
    'secondaryCtaHref', '/cosmetic/products/luminous-revitalization-sheer-set',
    'heroMediaSlot', 'cosmetic-set-cellurevive-ampoule',
    'productDetailForm', v_pdf
  );

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
    v_merged_content := jsonb_set(v_existing_content, '{productDetailForm}', v_pdf, true);

    IF v_merged_content != v_existing_content THEN
      UPDATE content_blocks 
      SET content = v_merged_content,
          updated_at = NOW()
      WHERE id = v_block_id;
      RAISE NOTICE 'Updated CELLUREVIVE Ampoule product landing block (%) with verified Product Detail Form.', v_block_id;
    END IF;
  END IF;
END $$;

-- Verification query
SELECT 
  site_key,
  page_path,
  block_type,
  is_active,
  content->>'title' AS title,
  content->'productDetailForm'->>'title' AS pdf_title,
  jsonb_array_length(COALESCE(content->'productDetailForm'->'legalInfo', '[]'::jsonb)) AS legal_info_count,
  jsonb_array_length(COALESCE(content->'productDetailForm'->'productItems', '[]'::jsonb)) AS product_items_count
FROM content_blocks
WHERE block_type = 'cosmetic-product-landing-cellurevive-ampoule';
