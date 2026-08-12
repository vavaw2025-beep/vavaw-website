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
  /** Luminous Set Hero Desktop Banner */
  luminousHeroDesktop?: string;
  /** Luminous Set Hero Mobile Banner */
  luminousHeroMobile?: string;
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
  /** Lumiglow Rosy Sheer Sunscreen product card */
  lumiglowSunscreen?: string;
  /** Daily Clinical Ritual panel image */
  ritualPanel?: string;
  /** Premium Program / Spa Clinic image */
  premiumProgramImage?: string;
  /** Premium Program / Spa Clinic video */
  premiumProgramSpaVideo?: string;
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
  /** CELLUREVIVE Ampoule in Luminous Set */
  setCellureviveAmpoule?: string;
  /** REGENAGLOW cream in Luminous Set */
  setRegenaglowSheerCream?: string;
  /** Video: Regenaglow Nourish Sheer Cream */
  videoRegenaglowCream?: string;
  /** Video: Calmiance Superior Sheer Gel */
  videoCalmianceGel?: string;
  /** Video: Gentle Activation Renew Ampoule */
  videoRenewAmpoule?: string;
  /** Video: P30 Boost Facial Moisturizer */
  videoP30Moisturizer?: string;
  /** Video: P30 Boost Facial Hydrating Toner */
  videoP30Toner?: string;
  /** Video: Lumiglow Rosy Sheer Sunscreen */
  videoLumiglowSunscreen?: string;
  /** Anti-Gravity Technology image for Luminous Set */
  antiGravity?: string;
  /** Anti-Gravity Technology desktop image for Luminous Set */
  antiGravityDesktop?: string;
  /** Anti-Gravity Technology mobile image for Luminous Set */
  antiGravityMobile?: string;
  /** Who Needs Sheer Set image for Luminous Set */
  whoForImage?: string;
  /** Who Needs Sheer Set desktop background for Luminous Set */
  whoForDesktop?: string;
  /** Who Needs Sheer Set mobile background for Luminous Set */
  whoForMobile?: string;
  /** Skin Barrier Science image for Luminous Set */
  barrierScience?: string;
  /** MG3-Plus Technology image for Luminous Set */
  mg3Plus?: string;
  /** Active Ingredients image for Luminous Set */
  activeIngredients?: string;
  /** Usage Guide main set image for Luminous Set */
  usageSet?: string;
  /** Ampoule Instruction diagram for Luminous Set */
  usageInstruction?: string;
  /** Offline Experience image for Luminous Set */
  offlineExperience?: string;
  /** Allow raw DB slot keys */
  [key: string]: string | undefined;
}

const SLOT_MAP: Record<string, keyof CosmeticPageMedia> = {
  'cosmetic-luminous-hero-desktop': 'luminousHeroDesktop',
  'cosmetic-luminous-hero-mobile': 'luminousHeroMobile',
  'cosmetic-luminous-offline-experience-image': 'offlineExperience',
  'cosmetic-luminous-usage-set-image': 'usageSet',
  'cosmetic-luminous-ampoule-instruction-image': 'usageInstruction',
  'cosmetic-luminous-active-ingredients-image': 'activeIngredients',
  'cosmetic-luminous-skin-barrier-image': 'barrierScience',
  'cosmetic-luminous-mg3-plus-image': 'mg3Plus',
  'cosmetic-luminous-who-for-image': 'whoForImage',
  'cosmetic-luminous-who-for-desktop': 'whoForDesktop',
  'cosmetic-luminous-who-for-mobile': 'whoForMobile',
  'cosmetic-luminous-anti-gravity-image': 'antiGravity',
  'cosmetic-luminous-anti-gravity-desktop': 'antiGravityDesktop',
  'cosmetic-luminous-anti-gravity-mobile': 'antiGravityMobile',
  'cosmetic-product-luminous-set':     'luminousSet',
  'cosmetic-product-regenaglow-cream': 'regenaglow',
  'cosmetic-product-calmiance-gel':    'calmiance',
  'cosmetic-product-renew-ampoule':    'renewAmpoule',
  'cosmetic-product-p30-moisturizer':  'p30Moisturizer',
  'cosmetic-product-p30-toner':        'p30Toner',
  'cosmetic-product-lumiglow-sunscreen': 'lumiglowSunscreen',
  'cosmetic-gallery-ritual-panel':     'ritualPanel',
  'cosmetic-premium-program-spa-video': 'premiumProgramSpaVideo',
  'cosmetic-premium-program':          'premiumProgramImage',
  'cosmetic-gallery-product-set':      'galleryProductSet',
  'cosmetic-gallery-texture':          'galleryTexture',
  'cosmetic-gallery-clinic':           'galleryClinic',
  'cosmetic-gallery-packaging':        'galleryPackaging',
  'cosmetic-gallery-skin':             'gallerySkin',
  'cosmetic-gallery-serum':            'gallerySerum',
  'cosmetic-set-cellurevive-ampoule':   'setCellureviveAmpoule',
  'cosmetic-set-regenaglow-sheer-cream': 'setRegenaglowSheerCream',
  // Video slots for Clinical Formula Lab
  'cosmetic-video-regenaglow-cream':  'videoRegenaglowCream',
  'cosmetic-video-calmiance-gel':     'videoCalmianceGel',
  'cosmetic-video-renew-ampoule':     'videoRenewAmpoule',
  'cosmetic-video-p30-moisturizer':   'videoP30Moisturizer',
  'cosmetic-video-p30-toner':         'videoP30Toner',
  'cosmetic-video-lumiglow-sunscreen': 'videoLumiglowSunscreen',
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
      .select('url, metadata, created_at, updated_at')
      .in('type', ['image', 'video'])
      .order('updated_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !assets) return {};

    const result: CosmeticPageMedia = {};

    // Walk assets newest-first. First valid match per slot wins.
    for (const asset of assets) {
      const purpose = asset.metadata?.purpose;
      const slot: string | undefined = asset.metadata?.slot;
      const archivedFromSlot = asset.metadata?.archivedFromSlot;

      if (archivedFromSlot) continue;
      if (purpose !== 'cosmetic-page-media' || !slot) continue;

      const key = SLOT_MAP[slot];
      if (!key) continue;
      if (result[key]) continue; // already filled — newest wins

      if (isValidUrl(asset.url)) {
        result[key] = asset.url;
        // Expose raw slot key as well for bulletproof lookup
        result[slot] = asset.url;
      }
    }

    return result;
  } catch {
    return {}; // Never break public rendering
  }
}
