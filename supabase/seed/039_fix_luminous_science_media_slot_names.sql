-- Fix skinBarrier.desktopMediaSlot incorrectly set to mobile
UPDATE content_blocks
SET content = jsonb_set(content, '{skinBarrierMg3Plus,skinBarrier,desktopMediaSlot}', '"cosmetic-luminous-skin-barrier-desktop"')
WHERE content->'skinBarrierMg3Plus'->'skinBarrier'->>'desktopMediaSlot' = 'cosmetic-luminous-skin-barrier-mobile';

-- Fix skinBarrier.mobileMediaSlot incorrectly set to desktop
UPDATE content_blocks
SET content = jsonb_set(content, '{skinBarrierMg3Plus,skinBarrier,mobileMediaSlot}', '"cosmetic-luminous-skin-barrier-mobile"')
WHERE content->'skinBarrierMg3Plus'->'skinBarrier'->>'mobileMediaSlot' = 'cosmetic-luminous-skin-barrier-desktop';

-- Fix mg3Plus.desktopMediaSlot incorrectly set to mobile
UPDATE content_blocks
SET content = jsonb_set(content, '{skinBarrierMg3Plus,mg3Plus,desktopMediaSlot}', '"cosmetic-luminous-mg3-plus-desktop"')
WHERE content->'skinBarrierMg3Plus'->'mg3Plus'->>'desktopMediaSlot' = 'cosmetic-luminous-mg3-plus-mobile';

-- Fix mg3Plus.mobileMediaSlot incorrectly set to desktop
UPDATE content_blocks
SET content = jsonb_set(content, '{skinBarrierMg3Plus,mg3Plus,mobileMediaSlot}', '"cosmetic-luminous-mg3-plus-mobile"')
WHERE content->'skinBarrierMg3Plus'->'mg3Plus'->>'mobileMediaSlot' = 'cosmetic-luminous-mg3-plus-desktop';
