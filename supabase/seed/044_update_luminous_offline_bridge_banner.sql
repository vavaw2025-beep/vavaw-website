UPDATE public.content_blocks
SET content = jsonb_set(
  content,
  '{productDetailForm}',
  (content->'productDetailForm') || '{
    "offlineShow": true,
    "offlineDesktopMediaSlot": "cosmetic-luminous-offline-experience-image",
    "offlineMobileMediaSlot": "cosmetic-luminous-offline-experience-mobile",
    "offlineDesktopImageMode": "cover",
    "offlineMobileImageMode": "cover",
    "offlineDesktopObjectPosition": "center center",
    "offlineMobileObjectPosition": "center center",
    "offlineTextAlign": "left",
    "offlineOverlayStrength": "medium"
  }'::jsonb
)
WHERE block_type = 'cosmetic-product-landing-luminous-set'
  AND site_key = 'main'
  AND content->'productDetailForm' IS NOT NULL
  AND NOT (content->'productDetailForm' ? 'offlineShow');
