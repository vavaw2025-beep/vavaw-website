-- Add Lumiglow Rosy Sheer Sunscreen to cosmetic-product-cards content blocks
-- This SQL appends the sunscreen product to the content JSON's items list non-destructively.

DO $$
DECLARE
  block_id UUID;
  current_content JSONB;
  has_sunscreen BOOLEAN;
BEGIN
  -- 1. Find the target block id and content
  SELECT id, content INTO block_id, current_content
  FROM content_blocks
  WHERE page_path = '/cosmetic' AND block_type = 'cosmetic-product-cards'
  LIMIT 1;

  IF block_id IS NOT NULL THEN
    -- 2. Check if the sunscreen already exists in the items array
    SELECT EXISTS (
      SELECT 1 
      FROM jsonb_array_elements(current_content->'items') AS item
      WHERE item->>'name' = 'LUMIGLOW ROSY SHEER SUNSCREEN SPF50+/PA+++'
    ) INTO has_sunscreen;

    IF NOT has_sunscreen THEN
      -- 3. Append the new sunscreen product object to the items array
      UPDATE content_blocks
      SET content = jsonb_set(
        current_content,
        '{items}',
        (current_content->'items') || '{
          "name": "LUMIGLOW ROSY SHEER SUNSCREEN SPF50+/PA+++",
          "type": "Kem chống nắng căng bóng dưỡng trắng",
          "volume": "50ml",
          "price": "850.000vnd",
          "mediaSlot": "cosmetic-product-lumiglow-sunscreen",
          "ingredients": "Hybrid UV Filter · Niacinamide 2% · Bakuchiol · Sodium Hyaluronate · Hệ dưỡng ẩm và làm dịu",
          "benefits": [
            "Chống nắng",
            "Nâng tone tự nhiên",
            "Dưỡng sáng da",
            "Chống lão hóa sớm",
            "Căng bóng",
            "Dưỡng trắng"
          ],
          "desc": "Sản phẩm kết hợp màng lọc chống nắng lai Hybrid UV Filter, sắc hồng hiệu chỉnh tông da Rosy Tone-Up, cùng các hoạt chất dưỡng da như Niacinamide, Bakuchiol và Sodium Hyaluronate, giúp bảo vệ da toàn diện trước tia UV đồng thời mang lại làn da sáng hồng tự nhiên, căng bóng và khỏe mạnh."
        }'::jsonb
      )
      WHERE id = block_id;
    END IF;
  END IF;
END $$;
