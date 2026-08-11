/**
 * cosmetic-slots.ts
 * Single source of truth for cosmetic product media slot keys.
 *
 * Admin saves these canonical values into content_blocks.content jsonb.
 * Public renderer resolves them via MEDIA_SLOT_TO_KEY map.
 *
 * RULE: Every mediaSlot value saved to DB must start with "cosmetic-product-".
 */

export interface CosmeticSlotDef {
  value: string;        // Canonical slot key (always starts with "cosmetic-product-")
  label: string;        // Vietnamese label for Admin UI
  aliases: string[];    // Legacy / short keys that map to this canonical value
  description?: string; // Optional description/guidelines for upload UI
}

export const COSMETIC_PRODUCT_MEDIA_SLOTS: CosmeticSlotDef[] = [
  {
    value: 'cosmetic-product-luminous-set',
    label: 'Bộ sản phẩm Luminous Set',
    aliases: ['luminous-set', 'luminous', 'featured-set'],
  },
  {
    value: 'cosmetic-product-regenaglow-cream',
    label: 'Kem dưỡng Regenaglow Cream',
    aliases: ['regenaglow-cream', 'regenaglow'],
  },
  {
    value: 'cosmetic-product-calmiance-gel',
    label: 'Gel phục hồi Calmiance Gel',
    aliases: ['calmiance-gel', 'calmiance'],
  },
  {
    value: 'cosmetic-product-renew-ampoule',
    label: 'Tinh chất Renew Ampoule',
    aliases: ['renew-ampoule', 'renew', 'ampoule'],
  },
  {
    value: 'cosmetic-product-p30-moisturizer',
    label: 'Kem dưỡng ẩm P30 Moisturizer',
    aliases: ['p30-moisturizer', 'moisturizer'],
  },
  {
    value: 'cosmetic-product-p30-toner',
    label: 'Toner cân bằng P30 Toner',
    aliases: ['p30-toner', 'toner'],
  },
  {
    value: 'cosmetic-product-lumiglow-sunscreen',
    label: 'Kem chống nắng Lumiglow Sunscreen',
    aliases: ['lumiglow-sunscreen', 'lumiglow', 'sunscreen'],
  },
  {
    value: 'cosmetic-set-cellurevive-ampoule',
    label: 'Ảnh chi tiết CELLUREVIVE Ampoule trong set',
    aliases: ['cellurevive-ampoule', 'cellurevive'],
  },
  {
    value: 'cosmetic-set-regenaglow-sheer-cream',
    label: 'Ảnh chi tiết REGENAGLOW NOURISH SHEER CREAM trong set',
    aliases: ['regenaglow-sheer-cream', 'regenaglow-set-cream'],
  },
  {
    value: 'cosmetic-luminous-anti-gravity-image',
    label: 'Luminous Set — Anti-Gravity Technology Image',
    aliases: ['anti-gravity', 'anti-gravity-image', 'anti-gravity-technology'],
  },
  {
    value: 'cosmetic-luminous-who-for-image',
    label: 'Luminous Set — Who It\'s For Image',
    aliases: ['who-for', 'who-needs', 'who-needs-set'],
  },
  {
    value: 'cosmetic-luminous-skin-barrier-image',
    label: 'Luminous Set — Skin Barrier Diagram',
    aliases: ['skin-barrier', 'barrier-diagram', 'skin-barrier-science'],
  },
  {
    value: 'cosmetic-luminous-mg3-plus-image',
    label: 'Luminous Set — MG3-Plus Technology Diagram',
    aliases: ['mg3-plus', 'mg3-technology', 'mg3-diagram'],
  },
  {
    value: 'cosmetic-luminous-active-ingredients-image',
    label: 'Luminous Set — Active Ingredients Image',
    aliases: ['active-ingredients', 'ingredients-image'],
  },
  {
    value: 'cosmetic-luminous-usage-set-image',
    label: 'Luminous Set — Usage Set Image',
    aliases: ['usage-set', 'how-to-use-set'],
  },
  {
    value: 'cosmetic-luminous-ampoule-instruction-image',
    label: 'Luminous Set — Ampoule Instruction Diagram',
    aliases: ['ampoule-instruction', 'instruction-diagram'],
  },
  {
    value: 'cosmetic-luminous-offline-experience-image',
    label: 'Luminous Set — Offline Experience Image',
    aliases: ['offline-experience', 'spa-experience'],
  },
];

/** Canonical video slot definitions for Clinical Formula Lab product videos */
export const COSMETIC_VIDEO_MEDIA_SLOTS: CosmeticSlotDef[] = [
  {
    value: 'cosmetic-video-regenaglow-cream',
    label: 'Video Regenaglow Nourish Sheer Cream',
    aliases: ['video-regenaglow-cream', 'video-regenaglow'],
  },
  {
    value: 'cosmetic-video-calmiance-gel',
    label: 'Video Calmiance Superior Sheer Gel',
    aliases: ['video-calmiance-gel', 'video-calmiance'],
  },
  {
    value: 'cosmetic-video-renew-ampoule',
    label: 'Video Gentle Activation Renew Ampoule',
    aliases: ['video-renew-ampoule', 'video-renew'],
  },
  {
    value: 'cosmetic-video-p30-moisturizer',
    label: 'Video P30 Boost Facial Moisturizer',
    aliases: ['video-p30-moisturizer'],
  },
  {
    value: 'cosmetic-video-p30-toner',
    label: 'Video P30 Boost Facial Hydrating Toner',
    aliases: ['video-p30-toner'],
  },
  {
    value: 'cosmetic-video-lumiglow-sunscreen',
    label: 'Video Lumiglow Rosy Sheer Sunscreen',
    aliases: ['video-lumiglow-sunscreen', 'video-lumiglow'],
  },
  {
    value: 'cosmetic-premium-program-spa-video',
    label: 'Video trải nghiệm VAVAW tại spa / clinic',
    aliases: ['premium-program-spa-video', 'spa-video'],
    description: 'Video spa/clinic dùng cho Professional Spa Program. Khuyến nghị: video dọc 9:16 hoặc 4:5, MP4/WebM, dưới 50MB.',
  },
];

/** All canonical slot key strings, for use as a simple string array */
export const SIG_MEDIA_SLOT_VALUES: string[] =
  COSMETIC_PRODUCT_MEDIA_SLOTS.map((s) => s.value);

/**
 * Normalize a media slot string to its canonical "cosmetic-product-*" value.
 *
 * - If value is already canonical → return as-is
 * - If value matches any alias → return canonical
 * - If value is empty/undefined → return undefined
 * - Unknown values → return undefined (do not invent a slot)
 *
 * Examples:
 *   normalizeCosmeticMediaSlot("regenaglow-cream")     → "cosmetic-product-regenaglow-cream"
 *   normalizeCosmeticMediaSlot("cosmetic-product-p30-toner") → "cosmetic-product-p30-toner"
 *   normalizeCosmeticMediaSlot("")                     → undefined
 */
export function normalizeCosmeticMediaSlot(value?: string): string | undefined {
  if (!value || !value.trim()) return undefined;
  const v = value.trim().toLowerCase();

  for (const slot of COSMETIC_PRODUCT_MEDIA_SLOTS) {
    // Exact canonical match
    if (v === slot.value) return slot.value;
    // Alias match
    if (slot.aliases.some((a) => a.toLowerCase() === v)) return slot.value;
  }

  // Check video slots
  for (const slot of COSMETIC_VIDEO_MEDIA_SLOTS) {
    if (v === slot.value) return slot.value;
    if (slot.aliases.some((a) => a.toLowerCase() === v)) return slot.value;
  }

  // Already starts with prefix but wasn't in our list (future-proofing)
  if (v.startsWith('cosmetic-product-') || v.startsWith('cosmetic-set-') || v.startsWith('cosmetic-video-')) return v;

  return undefined;
}

export function isCosmeticVideoMediaSlot(slot: string | null | undefined): boolean {
  if (!slot) return false;
  return (
    slot.startsWith('cosmetic-video-') ||
    slot === 'cosmetic-premium-program-spa-video'
  );
}

export interface CosmeticItemMetadata {
  step: string;
  role: string;
  usage: string;
  highlight: boolean;
}

/**
 * Provide suggested default metadata based on product name and array index.
 */
export function getDefaultCosmeticItemMetadata(name: string, index: number): CosmeticItemMetadata {
  const n = (name || '').toLowerCase();

  if (n.includes('calmiance') || n.includes('gel')) {
    return { step: '01', role: 'RECOVER', usage: 'AM · PM', highlight: false };
  }
  if (n.includes('toner')) {
    return { step: '02', role: 'PREPARE', usage: 'AM · PM', highlight: false };
  }
  if (n.includes('renew') || n.includes('ampoule')) {
    return { step: '03', role: 'TREAT', usage: 'PM', highlight: true };
  }
  if (n.includes('moisturizer')) {
    return { step: '04', role: 'SEAL', usage: 'AM · PM', highlight: false };
  }
  if (n.includes('regenaglow') || n.includes('cream')) {
    return { step: '05', role: 'NOURISH', usage: 'AM · PM', highlight: false };
  }
  if (n.includes('lumiglow') || n.includes('sunscreen')) {
    return { step: '06', role: 'PROTECT', usage: 'AM', highlight: false };
  }

  // Fallback
  return {
    step: String(index + 1).padStart(2, '0'),
    role: 'CARE',
    usage: 'AM · PM',
    highlight: false,
  };
}

