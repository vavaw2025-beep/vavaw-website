-- 014_update_cosmetic_ingredient_intelligence.sql
-- Phase 68A: Upgrade active ingredients into Premium Ingredient Intelligence Map.
-- Non-destructive: adds eyebrow, title, description, logicTitle, logicDescription.
-- If items are missing or empty, initializes the 8 default ingredients.
-- If items exist, enriches missing fields only where safe by matching id/name.
-- Does NOT change database schema or RLS policies.

DO $$
DECLARE
  v_block_id uuid;
  v_content jsonb;
  v_items jsonb;
  v_new_items jsonb := '[]'::jsonb;
  v_default_items jsonb := '[
    {
      "id": "exosome",
      "name": "Exosome",
      "category": "Renewal Signal",
      "icon": "atom",
      "routineStage": "TREAT",
      "usage": "PM",
      "shortRole": "Hỗ trợ vẻ ngoài mịn màng, rạng rỡ.",
      "description": "Hoạt chất được ứng dụng trong công thức chăm sóc chuyên sâu, hỗ trợ cải thiện vẻ ngoài của làn da xỉn màu, kém sức sống và cần phục hồi sau treatment.",
      "supports": ["Radiance support", "Texture refinement", "Skin renewal appearance"],
      "bestFor": ["Da xỉn màu", "Da có dấu hiệu lão hóa", "Da cần phục hồi sau treatment"],
      "foundIn": ["Gentle Activation Renew Ampoule", "CELLUREVIVE Ampoule"]
    },
    {
      "id": "peptide",
      "name": "Peptide Complex",
      "category": "Firmness Support",
      "icon": "sparkles",
      "routineStage": "RECOVER",
      "usage": "AM · PM",
      "shortRole": "Hỗ trợ độ đàn hồi và săn chắc tự nhiên.",
      "description": "Hỗn hợp peptide chuỗi sinh học hỗ trợ cải thiện độ săn chắc của da, làm mờ các nếp nhăn mảnh và tăng cường vẻ căng mịn.",
      "supports": ["Visible firmness", "Wrinkle appearance improvement", "Skin elasticity support"],
      "bestFor": ["Da giảm độ đàn hồi", "Da xuất hiện nếp nhăn", "Da thiếu săn chắc"],
      "foundIn": ["Regenaglow Nourish Sheer Cream", "P30 Boost Facial Moisturizer"]
    },
    {
      "id": "collagen",
      "name": "Collagen Support",
      "category": "Elasticity Support",
      "icon": "scan-heart",
      "routineStage": "RECOVER",
      "usage": "AM · PM",
      "shortRole": "Giúp cải thiện độ đàn hồi và độ dày biểu bì.",
      "description": "Phức hợp collagen hỗ trợ bổ sung cấu trúc nền cho da, mang lại làn da trông căng mọng, săn chắc và giảm thiểu tình trạng chảy xệ.",
      "supports": ["Elasticity support", "Plumping effect", "Skin structure integrity"],
      "bestFor": ["Da thiếu ẩm", "Da có nếp nhăn sâu", "Da kém căng bóng"],
      "foundIn": ["Regenaglow Nourish Sheer Cream", "CELLUREVIVE Ampoule"]
    },
    {
      "id": "cica",
      "name": "Cica 7 Complex",
      "category": "Soothing Barrier Care",
      "icon": "leaf",
      "routineStage": "RECOVER",
      "usage": "AM · PM",
      "shortRole": "Làm dịu làn da nhạy cảm, kích ứng.",
      "description": "Chiết xuất rau má cô đặc kết hợp 7 hoạt chất sinh học hỗ trợ phục hồi hàng rào bảo vệ da, làm dịu nhanh các tình trạng đỏ rát và nhạy cảm.",
      "supports": ["Redness appearance reduction", "Skin barrier support", "Soothing sensitive areas"],
      "bestFor": ["Da nhạy cảm", "Da dễ đỏ rát", "Da sau các liệu trình công nghệ cao"],
      "foundIn": ["Calmiance Superior Sheer Gel"]
    },
    {
      "id": "ha",
      "name": "Hyaluronic Acid",
      "category": "Hydration Layer",
      "icon": "droplet",
      "routineStage": "PREPARE / SEAL",
      "usage": "AM · PM",
      "shortRole": "Cấp ẩm sâu đa tầng, khóa ẩm bảo vệ.",
      "description": "Các phân tử HA đa kích thước thẩm thấu sâu vào các tầng biểu bì, giữ nước tối ưu và duy trì độ ẩm mịn suốt cả ngày.",
      "supports": ["Deep hydration", "Moisture barrier seal", "Instant plumpness appearance"],
      "bestFor": ["Da khô ráp", "Da mất nước", "Da bong tróc"],
      "foundIn": ["P30 Boost Facial Hydrating Toner", "P30 Boost Facial Moisturizer"]
    },
    {
      "id": "niacinamide",
      "name": "Niacinamide",
      "category": "Tone & Barrier Support",
      "icon": "badge-check",
      "routineStage": "PROTECT",
      "usage": "AM",
      "shortRole": "Dưỡng sáng da, củng cố hàng rào bảo vệ.",
      "description": "Hoạt chất đa năng hỗ trợ điều hòa bã nhờn, cải thiện tông da không đều màu và củng cố hàng rào bảo vệ da trước tác hại môi trường.",
      "supports": ["Brightening support", "Skin tone evening", "Moisture retention control"],
      "bestFor": ["Da không đều màu", "Da có vết thâm sạm", "Da xỉn màu"],
      "foundIn": ["LUMIGLOW ROSY SHEER SUNSCREEN SPF50+/PA+++"]
    },
    {
      "id": "bakuchiol",
      "name": "Bakuchiol",
      "category": "Gentle Renewal Support",
      "icon": "microscope",
      "routineStage": "TREAT",
      "usage": "PM",
      "shortRole": "Hỗ trợ chu kỳ sừng hóa tự nhiên của da.",
      "description": "Hoạt chất chống oxy hóa chiết xuất tự nhiên hoạt động tương tự retinol nhưng vô cùng dịu nhẹ, không gây kích ứng hay nhạy cảm ánh sáng.",
      "supports": ["Gentle renewal support", "Anti-ageing care", "Skin texture refinement"],
      "bestFor": ["Da lão hóa sớm", "Da nhạy cảm với retinol", "Da kém mịn màng"],
      "foundIn": ["Gentle Activation Renew Ampoule", "LUMIGLOW ROSY SHEER SUNSCREEN SPF50+/PA+++"]
    },
    {
      "id": "uv-filter",
      "name": "Hybrid UV Filter",
      "category": "Daily Protection Shield",
      "icon": "shield-check",
      "routineStage": "PROTECT",
      "usage": "AM",
      "shortRole": "Màng lọc bảo vệ da trước tia UVA/UVB.",
      "description": "Sự kết hợp tối ưu giữa màng lọc vật lý và hóa học giúp phản xạ và hấp thụ các tia UV gây hại, bảo vệ làn da khỏi lão hóa sớm.",
      "supports": ["UV shield support", "Photo-ageing defense", "Sun damage prevention"],
      "bestFor": ["Mọi loại da", "Da tiếp xúc với ánh nắng", "Da sau liệu trình cần bảo vệ nghiêm ngặt"],
      "foundIn": ["LUMIGLOW ROSY SHEER SUNSCREEN SPF50+/PA+++"]
    }
  ]'::jsonb;
  v_item_idx int;
  v_def_item jsonb;
  v_matched boolean;
  v_i int;
  v_j int;
BEGIN
  -- Find the cosmetic-ingredients block
  SELECT id, content INTO v_block_id, v_content
  FROM public.content_blocks
  WHERE site_key = 'main'
    AND page_path = '/cosmetic'
    AND block_type = 'cosmetic-ingredients'
  LIMIT 1;

  -- Create block if missing
  IF v_block_id IS NULL THEN
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
      '/cosmetic',
      'cosmetic-ingredients',
      true,
      7,
      jsonb_build_object(
        'eyebrow', 'ACTIVE INGREDIENT INTELLIGENCE',
        'title', 'Bản đồ hoạt chất phục hồi da',
        'description', 'Khám phá cách các hoạt chất trong hệ sản phẩm VAVAW hỗ trợ phục hồi, cấp ẩm, làm dịu, tái tạo và bảo vệ làn da.',
        'logicTitle', 'Clinical Formula Logic',
        'logicDescription', 'Mỗi hoạt chất được đặt vào đúng vai trò trong routine: chuẩn bị da, hỗ trợ tái tạo, làm dịu, khóa ẩm và bảo vệ ban ngày.',
        'items', v_default_items
      ),
      NOW(),
      NOW()
    );
    RAISE NOTICE 'Created missing cosmetic-ingredients block with default items.';
    RETURN;
  END IF;

  -- Ensure header metadata exists
  IF (v_content->>'eyebrow') IS NULL THEN
    v_content := v_content || jsonb_build_object('eyebrow', 'ACTIVE INGREDIENT INTELLIGENCE');
  END IF;
  IF (v_content->>'title') IS NULL THEN
    v_content := v_content || jsonb_build_object('title', 'Bản đồ hoạt chất phục hồi da');
  END IF;
  IF (v_content->>'description') IS NULL THEN
    v_content := v_content || jsonb_build_object('description', 'Khám phá cách các hoạt chất trong hệ sản phẩm VAVAW hỗ trợ phục hồi, cấp ẩm, làm dịu, tái tạo và bảo vệ làn da.');
  END IF;
  IF (v_content->>'logicTitle') IS NULL THEN
    v_content := v_content || jsonb_build_object('logicTitle', 'Clinical Formula Logic');
  END IF;
  IF (v_content->>'logicDescription') IS NULL THEN
    v_content := v_content || jsonb_build_object('logicDescription', 'Mỗi hoạt chất được đặt vào đúng vai trò trong routine: chuẩn bị da, hỗ trợ tái tạo, làm dịu, khóa ẩm và bảo vệ ban ngày.');
  END IF;

  v_items := COALESCE(v_content->'items', '[]'::jsonb);

  -- If empty list, load defaults directly
  IF jsonb_array_length(v_items) = 0 THEN
    v_content := jsonb_set(v_content, '{items}', v_default_items);
  ELSE
    -- Enrich existing items non-destructively
    FOR v_i IN 0..jsonb_array_length(v_items) - 1 LOOP
      v_def_item := NULL;

      SELECT def_val INTO v_def_item
      FROM (
        SELECT jsonb_array_elements(v_default_items) AS def_val
      ) AS defs
      WHERE LOWER(def_val->>'name') = LOWER(v_items->v_i->>'name')
         OR LOWER(def_val->>'id') = LOWER(v_items->v_i->>'id')
      LIMIT 1;

      IF v_def_item IS NOT NULL THEN
        -- Merge: default_item || existing_item (existing CMS/admin fields win)
        v_new_items := v_new_items || jsonb_build_array(v_def_item || (v_items->v_i));
      ELSE
        v_new_items := v_new_items || jsonb_build_array(v_items->v_i);
      END IF;
    END LOOP;
    v_content := jsonb_set(v_content, '{items}', v_new_items);
  END IF;

  -- Update database record
  UPDATE public.content_blocks
  SET
    content = v_content,
    updated_at = NOW()
  WHERE id = v_block_id;

  RAISE NOTICE 'Successfully updated cosmetic-ingredients content block.';
END $$;

-- Verification query
select
  block_type,
  content->>'title' as title,
  jsonb_array_length(coalesce(content->'items', '[]'::jsonb)) as item_count,
  content->'items' as items
from public.content_blocks
where site_key = 'main'
  and page_path = '/cosmetic'
  and block_type = 'cosmetic-ingredients';
