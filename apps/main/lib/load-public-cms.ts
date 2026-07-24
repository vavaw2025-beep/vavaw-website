/**
 * Public CMS data loader for apps/main.
 *
 * Provides a unified interface for loading homepage CMS data from either:
 *   - Static @vavaw/brand-config (default, always safe)
 *   - Supabase public tables via anon client + RLS (when CMS_DATA_SOURCE=supabase)
 *
 * In supabase mode, falls back to static if:
 *   - NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing
 *   - Any Supabase query errors
 *   - business_entries result is empty
 */

import { getSortedBusinessEntries } from '@vavaw/brand-config';
import { getCmsDataSource } from './cms-source';
import { getPublicSupabaseClient } from './supabase-public';

// ---------------------------------------------------------------------------
// Normalized types — decoupled from both brand-config and db record shapes
// ---------------------------------------------------------------------------

export interface NormalizedBusinessEntry {
  id: string;
  slug: string;
  name: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  redirectPath: string;
  status: string;
  sortOrder: number;
  ctaLabel: string;
  /** Resolved background image URL */
  backgroundImage: string;
  /** Resolved preview card image URL */
  previewImage: string;
}

export interface NormalizedHeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  redirectPath: string;
  status: string;
  sortOrder: number;
  backgroundMediaId?: string;
  previewMediaId?: string;
  /** Resolved from media_assets or fallback */
  backgroundImage: string;
  /** Resolved from media_assets or fallback */
  previewImage: string;
  businessEntryId?: string;
}

export interface NormalizedMediaAsset {
  id: string;
  url: string;
  type: string;
  altText?: string;
}

export interface PublicCmsData {
  businessEntries: NormalizedBusinessEntry[];
  heroSlides: NormalizedHeroSlide[];
  mediaAssets: NormalizedMediaAsset[];
  source: 'static' | 'supabase';
  error?: string;
}

// ---------------------------------------------------------------------------
// Static fallback mapper
// ---------------------------------------------------------------------------

function loadStaticCmsData(): PublicCmsData {
  const entries = getSortedBusinessEntries();

  const businessEntries: NormalizedBusinessEntry[] = entries.map((e) => ({
    id: e.id,
    slug: e.slug,
    name: e.name,
    category: e.category,
    title: e.title,
    subtitle: e.subtitle,
    description: e.description,
    redirectPath: e.redirectPath,
    status: e.status,
    sortOrder: e.sortOrder,
    ctaLabel: e.ctaLabel,
    backgroundImage: e.media.backgroundImage,
    previewImage: e.media.previewImage,
  }));

  // Derive hero slides from business entries (static mode)
  const heroSlides: NormalizedHeroSlide[] = entries.map((e) => ({
    id: `static-${e.id}`,
    title: e.title,
    subtitle: e.subtitle,
    description: e.description,
    ctaLabel: e.ctaLabel,
    redirectPath: e.redirectPath,
    status: e.status,
    sortOrder: e.sortOrder,
    backgroundImage: e.media.backgroundImage,
    previewImage: e.media.previewImage,
  }));

  return {
    businessEntries,
    heroSlides,
    mediaAssets: [],
    source: 'static',
  };
}

// ---------------------------------------------------------------------------
// Supabase loader
// ---------------------------------------------------------------------------

async function loadSupabaseCmsData(isPreview = false): Promise<PublicCmsData> {
  let supabase;
  if (isPreview) {
    const { getPreviewSupabaseClient } = await import('./supabase-preview');
    supabase = getPreviewSupabaseClient();
  } else {
    supabase = getPublicSupabaseClient();
  }

  if (!supabase) {
    const fallback = loadStaticCmsData();
    return {
      ...fallback,
      error: 'Supabase env vars not set — using static fallback.',
    };
  }

  try {
    const entriesQuery = supabase
      .from('business_entries')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (!isPreview) {
      entriesQuery.eq('status', 'active');
    }

    const slidesQuery = supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!isPreview) {
      slidesQuery.eq('status', 'active');
    }

    const [entriesResult, slidesResult, mediaResult] = await Promise.all([
      entriesQuery,
      slidesQuery,
      supabase
        .from('media_assets')
        .select('id, url, type, alt_text'),
    ]);

    // Fallback on query error
    if (entriesResult.error) {
      const fallback = loadStaticCmsData();
      return {
        ...fallback,
        error: `Supabase error: ${entriesResult.error.message}`,
      };
    }

    const entries = entriesResult.data ?? [];
    const slides = slidesResult.data ?? [];
    const media = mediaResult.data ?? [];

    // Fallback if Supabase returned no data
    if (entries.length === 0) {
      const fallback = loadStaticCmsData();
      return {
        ...fallback,
        error: 'No active business_entries in Supabase — using static fallback.',
      };
    }

    // Build a fast media ID → URL map
    const mediaMap = new Map<string, string>(media.map((m: any) => [m.id, m.url]));

    const businessEntries: NormalizedBusinessEntry[] = entries.map((e: any) => {
      const mediaRecord = e.media ?? {};
      return {
        id: e.id,
        slug: e.slug,
        name: e.name,
        category: e.category ?? '',
        title: e.title,
        subtitle: e.subtitle ?? '',
        description: e.description ?? '',
        redirectPath: e.redirect_path ?? `/go/${e.slug}`,
        status: e.status,
        sortOrder: e.sort_order,
        ctaLabel: e.cta_label ?? 'Learn More',
        backgroundImage: mediaRecord.backgroundImage ?? '',
        previewImage: mediaRecord.previewImage ?? '',
      };
    });

    // Build a business entry map for hero slide linking
    const entryMap = new Map<string, NormalizedBusinessEntry>(
      businessEntries.map((e) => [e.id, e])
    );

    const heroSlides: NormalizedHeroSlide[] = slides.length > 0
      ? slides.map((s: any) => {
          const linkedEntry = s.business_entry_id ? entryMap.get(s.business_entry_id) : undefined;

          const resolveMedia = (val?: string, fallback?: string) => {
            if (!val) return fallback ?? '';
            if (val.startsWith('http') || val.startsWith('/')) return val; // Directly pasted URL
            return mediaMap.get(val) ?? fallback ?? '';
          };

          // Resolve background image: URL → media asset ID → entry fallback → empty
          const bgUrl = resolveMedia(s.background_media_id, linkedEntry?.backgroundImage);

          // Resolve preview image: URL → media asset ID → entry fallback → empty
          const prevUrl = resolveMedia(s.preview_media_id, linkedEntry?.previewImage);

          return {
            id: s.id,
            title: s.title,
            subtitle: s.subtitle ?? '',
            description: s.description ?? '',
            ctaLabel: s.cta_label ?? linkedEntry?.ctaLabel ?? 'Learn More',
            redirectPath: s.redirect_path ?? linkedEntry?.redirectPath ?? '/',
            status: s.status,
            sortOrder: s.sort_order,
            backgroundMediaId: s.background_media_id ?? undefined,
            previewMediaId: s.preview_media_id ?? undefined,
            backgroundImage: bgUrl,
            previewImage: prevUrl,
            businessEntryId: s.business_entry_id ?? undefined,
          };
        })
      : // No hero_slides in DB yet — derive from business entries
        businessEntries.map((e) => ({
          id: `derived-${e.id}`,
          title: e.title,
          subtitle: e.subtitle,
          description: e.description,
          ctaLabel: e.ctaLabel,
          redirectPath: e.redirectPath,
          status: e.status,
          sortOrder: e.sortOrder,
          backgroundImage: e.backgroundImage,
          previewImage: e.previewImage,
          businessEntryId: e.id,
        }));

    const mediaAssets: NormalizedMediaAsset[] = media.map((m: any) => ({
      id: m.id,
      url: m.url,
      type: m.type,
      altText: m.alt_text ?? undefined,
    }));

    return {
      businessEntries,
      heroSlides,
      mediaAssets,
      source: 'supabase',
    };
  } catch (err: any) {
    const fallback = loadStaticCmsData();
    return {
      ...fallback,
      error: `Unexpected error: ${err?.message ?? String(err)}`,
    };
  }
}

// ---------------------------------------------------------------------------
// Main public export
// ---------------------------------------------------------------------------

/**
 * Loads public homepage CMS data from the configured source.
 * Always returns a valid result — never throws.
 */
export async function loadPublicHomeCms(isPreview = false): Promise<PublicCmsData> {
  const source = getCmsDataSource();

  // If preview mode is requested, force Supabase source
  if (isPreview || source === 'supabase') {
    return loadSupabaseCmsData(isPreview);
  }

  return loadStaticCmsData();
}
