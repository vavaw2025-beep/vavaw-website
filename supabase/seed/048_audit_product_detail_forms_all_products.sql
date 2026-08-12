-- 048_audit_product_detail_forms_all_products.sql
SELECT 
  page_path,
  block_type,
  (content->'productDetailForm' IS NOT NULL) as has_product_detail_form,
  jsonb_array_length(COALESCE(content->'productDetailForm'->'legalInfo', '[]'::jsonb)) as legal_info_count,
  jsonb_array_length(COALESCE(content->'productDetailForm'->'productItems', '[]'::jsonb)) as product_items_count,
  COALESCE((content->'productDetailForm'->>'showProductItems')::boolean, false) as show_product_items,
  COALESCE((content->'productDetailForm'->>'showIngredients')::boolean, false) as show_ingredients,
  COALESCE(content->'productDetailForm'->>'title', content->>'title') as title,
  ((content->'productDetailForm')::text ILIKE '%cập nhật%') as has_placeholder_text,
  ((content->'productDetailForm')::text ILIKE '%and other cosmetic ingredients%') as has_fake_ingredients
FROM content_blocks
WHERE site_key = 'main'
  AND block_type LIKE 'cosmetic-product-landing-%'
ORDER BY block_type;
