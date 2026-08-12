UPDATE content_blocks
SET content = jsonb_set(
  content,
  '{whoNeedsSheerSet}',
  '{
    "eyebrow": "WHO NEEDS SHEER SET",
    "title": "Ai nên dùng Luminous Sheer Set?",
    "note": "* Hiệu quả cảm nhận có thể khác nhau tùy theo tình trạng da và cách sử dụng.",
    "description": "Routine phục hồi phù hợp cho làn da cần được chăm sóc dịu nhẹ, bổ sung độ ẩm và hỗ trợ hàng rào bảo vệ sau các bước chăm sóc chuyên sâu.",
    "imageCaption": "Dễ dàng duy trì routine phục hồi tại nhà.",
    "mediaSlot": "cosmetic-luminous-who-for-image",
    "desktopMediaSlot": "cosmetic-luminous-who-for-desktop",
    "mobileMediaSlot": "cosmetic-luminous-who-for-mobile",
    "desktopImageMode": "cover",
    "desktopObjectPosition": "center center",
    "mobileObjectPosition": "center top",
    "items": [
      {
        "text": "Da bị tác động sau treatment hoặc chăm sóc chuyên sâu",
        "description": "Phù hợp khi da cần routine dịu nhẹ để ổn định lại cảm giác bề mặt."
      },
      {
        "text": "Da cần bổ sung độ ẩm và cảm giác dễ chịu",
        "description": "Hỗ trợ cảm giác da mềm, ẩm và ít khô căng hơn."
      },
      {
        "text": "Da khô, thô ráp, cần chăm sóc phục hồi",
        "description": "Giúp routine dưỡng da tại nhà trở nên gọn gàng và dễ duy trì."
      },
      {
        "text": "Da cần hỗ trợ hàng rào bảo vệ",
        "description": "Tập trung vào cảm giác cân bằng, mềm mại và ổn định hơn."
      },
      {
        "text": "Người muốn routine phục hồi tại nhà sau spa",
        "description": "Kết nối trải nghiệm chăm sóc chuyên sâu với home-care hằng ngày."
      }
    ]
  }'::jsonb || COALESCE(content->'whoNeedsSheerSet', '{}'::jsonb)
)
WHERE block_type = 'cosmetic-product-landing-luminous-set'
  AND site_key = 'main';
