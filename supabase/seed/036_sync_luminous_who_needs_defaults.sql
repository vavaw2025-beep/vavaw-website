UPDATE content_blocks
SET content = jsonb_set(
  content,
  '{whoNeedsSheerSet}',
  COALESCE(content->'whoNeedsSheerSet', '{}'::jsonb) || jsonb_build_object(
    'showNote', COALESCE(content->'whoNeedsSheerSet'->'showNote', 'true'::jsonb),
    'showDescription', COALESCE(content->'whoNeedsSheerSet'->'showDescription', 'true'::jsonb),
    'showImageCaption', COALESCE(content->'whoNeedsSheerSet'->'showImageCaption', 'true'::jsonb),
    'eyebrow', COALESCE(content->'whoNeedsSheerSet'->'eyebrow', '"WHO NEEDS SHEER SET"'::jsonb),
    'title', COALESCE(content->'whoNeedsSheerSet'->'title', '"Ai nên dùng Luminous Sheer Set?"'::jsonb),
    'note', COALESCE(content->'whoNeedsSheerSet'->'note', '"* Hiệu quả cảm nhận có thể khác nhau tùy theo tình trạng da và cách sử dụng."'::jsonb),
    'description', COALESCE(content->'whoNeedsSheerSet'->'description', '"Routine phục hồi phù hợp cho làn da cần được chăm sóc dịu nhẹ, bổ sung độ ẩm và hỗ trợ hàng rào bảo vệ sau các bước chăm sóc chuyên sâu."'::jsonb),
    'imageCaption', COALESCE(content->'whoNeedsSheerSet'->'imageCaption', '"Dễ dàng duy trì routine phục hồi tại nhà."'::jsonb)
  )
)
WHERE block_type = 'cosmetic-product-landing-luminous-set';
