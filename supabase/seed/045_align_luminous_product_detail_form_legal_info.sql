-- 045_align_luminous_product_detail_form_legal_info.sql
-- Goal: Safely inject the new legalInfo and productItems into Luminous Set block

DO  
DECLARE
  v_block_id uuid;
  v_content jsonb;
  v_current_detail_form jsonb;
  v_legal_info jsonb := '[
    { "label": "Tên sản phẩm", "value": "LUMINOUS REVITALIZATION SHEER SET" },
    { "label": "Đối tượng sử dụng", "value": "Phù hợp với tất cả các loại da", "highlight": true },
    { "label": "Hạn sử dụng sau khi mở nắp", "value": "12 tháng" },
    { "label": "Hạn sử dụng trước khi mở nắp", "value": "Xem ghi chú riêng trên bao bì sản phẩm" },
    { "label": "Nhà sản xuất", "value": "IRE Cosmetic Co., Ltd." },
    { "label": "Đơn vị chịu trách nhiệm phân phối", "value": "BRL Company Co., Ltd.", "highlight": true },
    { "label": "Trung tâm chăm sóc khách hàng", "value": "070-7633-0987", "highlight": true },
    { "label": "Nước sản xuất", "value": "Hàn Quốc" },
    { "label": "Tình trạng phê duyệt mỹ phẩm chức năng của Bộ An toàn Thực phẩm và Dược phẩm Hàn Quốc (MFDS)", "value": "Có (Mỹ phẩm chức năng kép: Hỗ trợ làm sáng da và hỗ trợ cải thiện nếp nhăn).", "highlight": true },
    { "label": "Hướng dẫn sử dụng", "value": "Lấy một lượng sản phẩm vừa đủ, thoa đều lên da theo chiều kết cấu da.", "highlight": true }
  ]';
  v_product_items jsonb := '[
    {
      "name": "Kem dưỡng REGENAGLOW Nourish Sheer Cream",
      "volume": "35 ml",
      "functionClaim": "Mỹ phẩm chức năng kép: Hỗ trợ làm sáng da & hỗ trợ cải thiện nếp nhăn",
      "ingredients": "Nước tinh khiết (Water), Dicaprylyl Carbonate, Caprylic/Capric Triglyceride, 2,3-Butanediol, Glycerin, Polyglyceryl-2 Dipolyhydroxystearate, Polyglyceryl-3 Diisostearate, Niacinamide, 1,2-Hexanediol, Propanediol, Sodium Chloride, Squalane, Dầu hạt nho (Grape Seed Oil), Chiết xuất việt quất Lowbush (Low Sweet Blueberry Extract), Chiết xuất dâu tây (Strawberry Extract), Chiết xuất quả Acai (Acai Berry Fruit Extract), Chiết xuất mâm xôi (Raspberry Extract), Chiết xuất quả Bilberry (Bilberry Fruit Extract), Chiết xuất Lingonberry (Lingonberry Extract), Chiết xuất nam việt quất (Cranberry Extract), Từ ngoại bào tử tế bào mô sẹo Rau Má (Centella Asiatica Callus Extracellular Vesicles), Hydrolyzed Hyaluronic Acid, Hyaluronic Acid, Hydroxypropyltrimonium Hyaluronate, Sodium Hyaluronate, Sodium Acetylated Hyaluronate, Sodium Hyaluronate Crosspolymer, Hydrolyzed Sodium Hyaluronate, Potassium Hyaluronate, Sodium Hyaluronate Dimethylsilanol, Dimethylsilanol Hyaluronate, Adenosine, Xanthan Gum, Disodium EDTA, SH-Oligopeptide-2, SH-Polypeptide-1, RH-Oligopeptide-1, Ethylhexylglycerin."
    },
    {
      "name": "Tinh chất CelluRevive Intensive Sheer Ampoule",
      "volume": "7 ml × 4 ống",
      "functionClaim": "Mỹ phẩm chức năng: Hỗ trợ cải thiện nếp nhăn",
      "ingredients": "Nước Collagen (830,000 ppm), Methylpropanediol, Glycerin, Glyceryl Acrylate/Acrylic Acid Copolymer, Sodium Hyaluronate, 1,2-Hexanediol, Túi ngoại bào từ tế bào mô sẹo Rau Má (Centella Asiatica Callus Extracellular Vesicles) (10,000 ppm), SH-Oligopeptide-2, Carbomer, Arginine, Polyglyceryl-10 Laurate, Ethylhexylglycerin, Adenosine, Trisodium EDTA, SH-Polypeptide-1, RH-Oligopeptide-1, Hydrolyzed Hyaluronic Acid, Hyaluronic Acid, Hydroxypropyltrimonium Hyaluronate, Sodium Acetylated Hyaluronate, Sodium Hyaluronate Crosspolymer, Hydrolyzed Sodium Hyaluronate, Potassium Hyaluronate, Sodium Hyaluronate Dimethylsilanol, Dimethylsilanol Hyaluronate, Butylene Glycol."
    }
  ]';
  v_cautions jsonb := '["Nếu trong hoặc sau khi sử dụng sản phẩm, vùng da sử dụng xuất hiện các dấu hiệu bất thường hoặc tác dụng không mong muốn như nổi mẩn đỏ, sưng tấy, ngứa… do tiếp xúc với ánh nắng trực tiếp, hãy ngừng sử dụng và tham khảo ý kiến bác sĩ hoặc chuyên gia da liễu.", "Không sử dụng trên vùng da có vết thương hở.", "Bảo quản và lưu ý khi sử dụng: Để xa tầm tay trẻ em.", "Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp."]';
  v_storage text := 'Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.';
  v_quality_guarantee text := 'Trong trường hợp sản phẩm có lỗi, việc bồi thường sẽ được thực hiện theo Tiêu chuẩn giải quyết tranh chấp người tiêu dùng do Ủy ban Thương mại Công bằng Hàn Quốc ban hành.';
BEGIN
  -- 1. Find the target block
  FOR v_block_id, v_content IN SELECT id, content
  FROM content_blocks
  WHERE site_key = 'main'
    AND page_path IN ('/cosmetic/products/luminous-revitalization-sheer-set', '/cosmetic')
    AND block_type = 'cosmetic-product-landing-luminous-set'
  LOOP
  

  

  v_current_detail_form := COALESCE(v_content->'productDetailForm', '{}'::jsonb);

  -- 2. Inject legalInfo if missing or empty
  IF NOT v_current_detail_form ? 'legalInfo' OR jsonb_array_length(COALESCE(v_current_detail_form->'legalInfo', '[]'::jsonb)) = 0 THEN
    v_current_detail_form := jsonb_set(v_current_detail_form, '{legalInfo}', v_legal_info);
  END IF;

  -- 3. Inject productItems if missing or empty
  IF NOT v_current_detail_form ? 'productItems' OR jsonb_array_length(COALESCE(v_current_detail_form->'productItems', '[]'::jsonb)) = 0 THEN
    v_current_detail_form := jsonb_set(v_current_detail_form, '{productItems}', v_product_items);
  END IF;

  -- 4. Inject cautions if missing, empty, or likely legacy (length < 4)
  IF NOT v_current_detail_form ? 'cautions' OR jsonb_array_length(COALESCE(v_current_detail_form->'cautions', '[]'::jsonb)) < 4 THEN
    v_current_detail_form := jsonb_set(v_current_detail_form, '{cautions}', v_cautions);
  END IF;

  -- 5. Inject storage and qualityGuarantee if missing
  IF NOT v_current_detail_form ? 'storage' THEN
    v_current_detail_form := jsonb_set(v_current_detail_form, '{storage}', to_jsonb(v_storage));
  END IF;
  
  IF NOT v_current_detail_form ? 'qualityGuarantee' THEN
    v_current_detail_form := jsonb_set(v_current_detail_form, '{qualityGuarantee}', to_jsonb(v_quality_guarantee));
  END IF;

  -- 6. Inject visibility toggles if missing
  IF NOT v_current_detail_form ? 'showDescription' THEN v_current_detail_form := jsonb_set(v_current_detail_form, '{showDescription}', 'true'::jsonb); END IF;
  IF NOT v_current_detail_form ? 'showLegalInfo' THEN v_current_detail_form := jsonb_set(v_current_detail_form, '{showLegalInfo}', 'true'::jsonb); END IF;
  IF NOT v_current_detail_form ? 'showProductItems' THEN v_current_detail_form := jsonb_set(v_current_detail_form, '{showProductItems}', 'true'::jsonb); END IF;
  IF NOT v_current_detail_form ? 'showIngredients' THEN v_current_detail_form := jsonb_set(v_current_detail_form, '{showIngredients}', 'true'::jsonb); END IF;
  IF NOT v_current_detail_form ? 'showCautions' THEN v_current_detail_form := jsonb_set(v_current_detail_form, '{showCautions}', 'true'::jsonb); END IF;
  IF NOT v_current_detail_form ? 'showStorage' THEN v_current_detail_form := jsonb_set(v_current_detail_form, '{showStorage}', 'true'::jsonb); END IF;
  IF NOT v_current_detail_form ? 'showQualityGuarantee' THEN v_current_detail_form := jsonb_set(v_current_detail_form, '{showQualityGuarantee}', 'true'::jsonb); END IF;

  -- 7. Fix legacy info where "REGENAGLOW ... 30ml" exists
  IF v_current_detail_form ? 'info' THEN
    DECLARE
      v_text_form text;
    BEGIN
      v_text_form := v_current_detail_form::text;
      v_text_form := replace(v_text_form, 'REGENAGLOW Nourish Sheer Cream 30ml', 'REGENAGLOW Nourish Sheer Cream 35 ml');
      v_text_form := replace(v_text_form, '30 ml', '35 ml');
      v_current_detail_form := v_text_form::jsonb;
    END;
  END IF;

  -- 8. Apply back to content
  v_content := jsonb_set(v_content, '{productDetailForm}', v_current_detail_form);

  UPDATE content_blocks
  SET content = v_content, updated_at = NOW()
  WHERE id = v_block_id;

  RAISE NOTICE 'Successfully updated Luminous Set productDetailForm legal info.';
END ;
