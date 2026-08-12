SELECT 
  content->'skinBarrierMg3Plus'->'skinBarrier'->>'desktopMediaSlot' as skin_barrier_desktop_slot,
  content->'skinBarrierMg3Plus'->'skinBarrier'->>'mobileMediaSlot' as skin_barrier_mobile_slot,
  content->'skinBarrierMg3Plus'->'mg3Plus'->>'desktopMediaSlot' as mg3_plus_desktop_slot,
  content->'skinBarrierMg3Plus'->'mg3Plus'->>'mobileMediaSlot' as mg3_plus_mobile_slot
FROM content_blocks
WHERE content->'skinBarrierMg3Plus' IS NOT NULL;

SELECT
  metadata->>'slot' as slot,
  type,
  mime_type,
  metadata->>'width' as width,
  metadata->>'height' as height,
  url,
  created_at
FROM media_assets
WHERE metadata->>'slot' IN (
  'cosmetic-luminous-skin-barrier-image',
  'cosmetic-luminous-skin-barrier-desktop',
  'cosmetic-luminous-skin-barrier-mobile',
  'cosmetic-luminous-mg3-plus-image',
  'cosmetic-luminous-mg3-plus-desktop',
  'cosmetic-luminous-mg3-plus-mobile'
)
AND metadata->>'archivedFromSlot' IS NULL
ORDER BY created_at DESC;
