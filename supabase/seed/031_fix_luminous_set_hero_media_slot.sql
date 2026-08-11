update public.content_blocks
set content =
  jsonb_set(
    jsonb_set(
      jsonb_set(
        content,
        '{heroMediaSlot}',
        '"cosmetic-product-luminous-set"'::jsonb,
        true
      ),
      '{heroDesktopMediaSlot}',
      '"cosmetic-luminous-hero-desktop"'::jsonb,
      true
    ),
    '{heroMobileMediaSlot}',
    '"cosmetic-luminous-hero-mobile"'::jsonb,
    true
  ),
  updated_at = now()
where site_key = 'main'
  and page_path = '/cosmetic/products/luminous-revitalization-sheer-set'
  and block_type = 'cosmetic-product-landing-luminous-set';
