/**
 * Load cosmetic page media assets from Supabase media_assets table.
 *
 * Reads assets where metadata.purpose = "cosmetic-page-media"
 * and maps them to named slots for use in /cosmetic lower sections.
 *
 * Falls back to empty object safely — never throws.
 */
import { getCmsDataSource } from './cms-source';
import { getPublicSupabaseClient } from './supabase-public';

// ─── Slot map ────────────────────────────────────────────────────────────────
// These match the metadata.slot values assigned when uploading via Admin Media.
// Admin upload metadata guide:
//   purpose: "cosmetic-page-media"
//   slot:    one of the keys below

export interface CosmeticPageMedia {
  /** Hero Product Feature — Luminous Revitalization Sheer Set */
  luminousSet?: string;
  /** Regenaglow Nourish Sheer Cream product card */
  regenaglow?: string;
  /** Calmiance Superior Sheer Gel product card */
  calmiance?: string;
  /** Gentle Activation Renew Ampoule product card */
  renewAmpoule?: string;
  /** P30 Boost Facial Moisturizer product card */
  p30Moisturizer?: string;
  /** P30 Boost Facial Hydrating Toner product card */
  p30Toner?: string;
  /** Daily Clinical Ritual panel image */
  ritualPanel?: string;
  /** Premium Program / Spa Clinic visual */
  premiumProgram?: string;
  /** Gallery slot 1 — product set overview */
  galleryProductSet?: string;
  /** Gallery slot 2 — texture / formula close-up */
  galleryTexture?: string;
  /** Gallery slot 3 — clinic / treatment scene */
  galleryClinic?: string;
  /** Gallery slot 4 — packaging editorial */
  galleryPackaging?: string;
  /** Gallery slot 5 — model / skin close-up */
  gallerySkin?: string;
  /** Gallery slot 6 — serum / ampoule close-up */
  gallerySerum?: string;
}

// Slot name → CosmeticPageMedia key mapping
const SLOT_MAP: Record<string, keyof CosmeticPageMedia> = {
  'cosmetic-product-luminous-set':     'luminousSet',
  'cosmetic-product-regenaglow-cream': 'regenaglow',
  'cosmetic-product-calmiance-gel':    'calmiance',
  'cosmetic-product-renew-ampoule':    'renewAmpoule',
  'cosmetic-product-p30-moisturizer':  'p30Moisturizer',
  'cosmetic-product-p30-toner':        'p30Toner',
  'cosmetic-gallery-ritual-panel':     'ritualPanel',
  'cosmetic-premium-program':          'premiumProgram',
  'cosmetic-gallery-product-set':      'galleryProductSet',
  'cosmetic-gallery-texture':          'galleryTexture',
  'cosmetic-gallery-clinic':           'galleryClinic',
  'cosmetic-gallery-packaging':        'galleryPackaging',
  'cosmetic-gallery-skin':             'gallerySkin',
  'cosmetic-gallery-serum':            'gallerySerum',
};

function isValidUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const t = value.trim();
  if (!t || t === '-') return false;
  if (t.includes('PASTE_')) return false;
  if (t.startsWith('javascript:') || t.startsWith('data:')) return false;
  return t.startsWith('https://') || t.startsWith('http://');
}

export async function loadPublicCosmeticMedia(
  isPreview = false,
): Promise<CosmeticPageMedia> {
  const source = getCmsDataSource();

  // In static mode there are no Supabase assets — return empty safely
  if (!isPreview && source !== 'supabase') {
    return {};
  }

  let supabase;
  try {
    if (isPreview) {
      const { getPreviewSupabaseClient } = await import('./supabase-preview');
      supabase = getPreviewSupabaseClient();
    } else {
      supabase = getPublicSupabaseClient();
    }
  } catch {
    return {};
  }

  if (!supabase) return {};

  try {
    const { data: assets, error } = await supabase
      .from('media_assets')
      .select('url, metadata, created_at')
      .eq('type', 'image')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !assets) return {};

    const result: CosmeticPageMedia = {};

    // Walk assets newest-first. First valid match per slot wins.
    for (const asset of assets) {
      const purpose = asset.metadata?.purpose;
      const slot: string | undefined = asset.metadata?.slot;

      if (purpose !== 'cosmetic-page-media' || !slot) continue;

      const key = SLOT_MAP[slot];
      if (!key) continue;
      if (result[key]) continue; // already filled — newest wins

      if (isValidUrl(asset.url)) {
        result[key] = asset.url;
      }
    }

    return result;
  } catch {
    return {}; // Never break public rendering
  }
}
