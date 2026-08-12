-- 046_audit_luminous_product_detail_form.sql
SELECT 
  page_path,
  block_type,
  jsonb_array_length(COALESCE(content->'productDetailForm'->'legalInfo', '[]'::jsonb)) as legal_info_count,
  jsonb_array_length(COALESCE(content->'productDetailForm'->'productItems', '[]'::jsonb)) as product_items_count,
  jsonb_array_length(COALESCE(content->'productDetailForm'->'cautions', '[]'::jsonb)) as cautions_count,
  content->'productDetailForm'->'legalInfo' as legal_info,
  content->'productDetailForm'->'productItems' as product_items,
  (content->'productDetailForm'->'legalInfo')::text ILIKE '%IRE Cosmetic%' as has_manufacturer,
  (content->'productDetailForm'->'legalInfo')::text ILIKE '%BRL Company%' as has_distributor,
  (content->'productDetailForm'->'legalInfo')::text ILIKE '%070-7633-0987%' as has_customer_service,
  (content->'productDetailForm'->'legalInfo')::text ILIKE '%MFDS%' as has_mfds,
  (content->'productDetailForm'->'productItems')::text ILIKE '%35 ml%' as has_regenaglow_35ml,
  (content->'productDetailForm'->'productItems')::text ILIKE '%and other cosmetic ingredients%' as has_generic_placeholder
FROM content_blocks
WHERE site_key = 'main'
  AND block_type = 'cosmetic-product-landing-luminous-set';
