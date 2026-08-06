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

  // Already starts with prefix but wasn't in our list (future-proofing)
  if (v.startsWith('cosmetic-product-')) return v;

  return undefined;
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

