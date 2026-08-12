-- 047_add_product_detail_form_placeholders_for_remaining_products.sql

UPDATE content_blocks
SET content = jsonb_set(
  content,
  '{productDetailForm}',
  jsonb_build_object(
    'eyebrow', 'PRODUCT INFORMATION',
    'title', COALESCE(content->>'title', 'THÔNG TIN SẢN PHẨM'),
    'description', 'Thông tin sản phẩm sẽ được cập nhật chi tiết theo hồ sơ sản phẩm chính thức.',
    'showDescription', true,
    'showLegalInfo', true,
    'showProductItems', false,
    'showIngredients', false,
    'showCautions', true,
    'showStorage', true,
    'showQualityGuarantee', true,
    'legalInfo', jsonb_build_array(
      jsonb_build_object('label', 'Tên sản phẩm', 'value', COALESCE(content->>'title', 'Sản phẩm')),
      jsonb_build_object('label', 'Trạng thái nội dung', 'value', 'Đang cập nhật thông tin chi tiết')
    ),
    'productItems', '[]'::jsonb,
    'cautions', jsonb_build_array('Thông tin lưu ý sử dụng sẽ được cập nhật theo hồ sơ sản phẩm chính thức.'),
    'storage', 'Thông tin bảo quản sẽ được cập nhật.',
    'qualityGuarantee', 'Thông tin đảm bảo chất lượng sẽ được cập nhật.'
  ),
  true
)
WHERE site_key = 'main'
  AND block_type IN (
    'cosmetic-product-landing-cellurevive-ampoule',
    'cosmetic-product-landing-regenaglow-cream',
    'cosmetic-product-landing-calmiance-gel',
    'cosmetic-product-landing-p30-toner',
    'cosmetic-product-landing-renew-ampoule',
    'cosmetic-product-landing-p30-moisturizer',
    'cosmetic-product-landing-lumiglow-sunscreen'
  )
  AND (
    content->'productDetailForm' IS NULL
    OR content->'productDetailForm'->'legalInfo' IS NULL
    OR jsonb_array_length(COALESCE(content->'productDetailForm'->'legalInfo', '[]'::jsonb)) = 0
  );
