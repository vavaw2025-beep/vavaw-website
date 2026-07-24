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

export interface PublicHeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaLabel?: string;
  redirectPath?: string;
  status: string;
  sortOrder: number;
  backgroundMediaId?: string;
  previewMediaId?: string;
  /** Resolved from media_assets or fallback */
  backgroundImageUrl?: string;
  /** Resolved from media_assets or fallback */
  previewImageUrl?: string;
  backgroundAlt?: string;
  previewAlt?: string;
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
  heroSlides: PublicHeroSlide[];
  mediaAssets: NormalizedMediaAsset[];
  source: 'static' | 'supabase';
  error?: string;
  /** True when Supabase had no active hero_slides and slides were derived from business_entries */
  fallbackUsed?: boolean;
  /** Human-readable reason why fallback was used */
  fallbackReason?: string;
  /** Number of raw rows returned from hero_slides query (before normalization) */
  rawHeroRowsCount?: number;
  /** Number of rows that matched status = active */
  activeHeroRowsCount?: number;
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
  const heroSlides: PublicHeroSlide[] = entries.map((e) => ({
    id: `static-${e.id}`,
    title: e.title,
    subtitle: e.subtitle,
    description: e.description,
    ctaLabel: e.ctaLabel,
    redirectPath: e.redirectPath,
    status: e.status,
    sortOrder: e.sortOrder,
    backgroundImageUrl: e.media.backgroundImage,
    previewImageUrl: e.media.previewImage,
  }));

  return {
    businessEntries,
    heroSlides,
    mediaAssets: [],
    source: 'static',
    fallbackUsed: false,
    rawHeroRowsCount: 0,
    activeHeroRowsCount: 0,
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
    // Build queries — IMPORTANT: .eq() returns a new builder, must be reassigned
    let entriesQuery = supabase
      .from('business_entries')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!isPreview) {
      entriesQuery = entriesQuery.eq('status', 'active');
    }

    let slidesQuery = supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!isPreview) {
      slidesQuery = slidesQuery.eq('status', 'active');
    }

    const [entriesResult, slidesResult] = await Promise.all([
      entriesQuery,
      slidesQuery,
    ]);

    // Fallback only on hard query error
    if (entriesResult.error) {
      const fallback = loadStaticCmsData();
      return {
        ...fallback,
        source: 'supabase',
        fallbackUsed: true,
        fallbackReason: `Query error (entries): ${entriesResult.error.message}`,
        error: `Supabase error (entries): ${entriesResult.error.message}`,
      };
    }
    if (slidesResult.error) {
      const fallback = loadStaticCmsData();
      return {
        ...fallback,
        source: 'supabase',
        fallbackUsed: true,
        fallbackReason: `Query error (slides): ${slidesResult.error.message}`,
        error: `Supabase error (slides): ${slidesResult.error.message}`,
      };
    }

    const entries = entriesResult.data ?? [];
    const rawSlides = slidesResult.data ?? [];

    // Dev diagnostic: if no active slides found, fetch all slides (any status) to reveal what's in DB
    const isDiagMode = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_SHOW_CMS_DEBUG === 'true';
    if (isDiagMode && rawSlides.length === 0) {
      const allSlidesResult = await supabase
        .from('hero_slides')
        .select('id, title, status, sort_order')
        .order('sort_order', { ascending: true });
      console.warn('[main cms hero_slides STATUS AUDIT]', {
        message: 'hero_slides query returned 0 active rows. Showing all rows regardless of status:',
        allSlides: allSlidesResult.data?.map((r: any) => ({ title: r.title, status: r.status })) ?? [],
        hint: 'Set status = "active" in Admin → Hero for slides to appear on the public homepage.',
      });
    }

    // Diagnostics: raw DB counts
    if (isDiagMode) {
      console.info('[main cms raw hero rows]', {
        rawHeroCount: rawSlides.length,
        rawHeroTitles: rawSlides.map((r: any) => `${r.title} (${r.status})`),
        rawEntriesCount: entries.length,
      });
    }

    // Only fall back to static if BOTH entries and slides are empty
    if (entries.length === 0 && rawSlides.length === 0) {
      const fallback = loadStaticCmsData();
      return {
        ...fallback,
        source: 'supabase',
        fallbackUsed: true,
        fallbackReason: 'No active hero_slides or business_entries found in Supabase',
        rawHeroRowsCount: 0,
        activeHeroRowsCount: 0,
        error: 'No active data in Supabase — using static fallback.',
      };
    }

    // ---------------------------------------------------------------------------
    // Resolve media assets — collect all UUIDs, batch-fetch URLs
    // ---------------------------------------------------------------------------
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    const mediaIds = new Set<string>();
    rawSlides.forEach((s: any) => {
      const bg = s.background_media_id;
      const prev = s.preview_media_id;
      // Only add UUID-shaped IDs — not direct URLs or empty values
      if (bg && uuidPattern.test(bg)) mediaIds.add(bg);
      if (prev && uuidPattern.test(prev)) mediaIds.add(prev);
    });

    let media: any[] = [];
    if (mediaIds.size > 0) {
      const mediaResult = await supabase
        .from('media_assets')
        .select('id, url, type, alt_text')
        .in('id', Array.from(mediaIds));

      if (isDiagMode) {
        console.info('[main cms media fetch]', {
          requestedIds: mediaIds.size,
          resolvedCount: mediaResult.data?.length ?? 0,
          error: mediaResult.error?.message ?? null,
        });
      }

      if (!mediaResult.error) {
        media = mediaResult.data ?? [];
      }
    }

    // Build a fast media ID → full asset map
    const mediaMap = new Map<string, { url: string; altText?: string }>(
      media.map((m: any) => [m.id, { url: m.url, altText: m.alt_text ?? undefined }])
    );

    // ---------------------------------------------------------------------------
    // Normalize business entries
    // ---------------------------------------------------------------------------
    const businessEntries: NormalizedBusinessEntry[] = entries.map((e: any) => ({
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
      backgroundImage: '',  // not used in supabase mode — images come from media_assets
      previewImage: '',
    }));

    const entryMap = new Map<string, NormalizedBusinessEntry>(
      businessEntries.map((e) => [e.id, e])
    );

    // ---------------------------------------------------------------------------
    // Resolve hero slides from DB rows
    // ---------------------------------------------------------------------------
    const heroSlides: PublicHeroSlide[] = rawSlides.length > 0
      ? rawSlides.map((s: any) => {
          const linkedEntry = s.business_entry_id ? entryMap.get(s.business_entry_id) : undefined;

          // Resolve media URL: UUID → mediaMap → undefined (never fall back to static strings)
          const resolveMediaUrl = (id?: string | null): string | undefined => {
            if (!id) return undefined;
            if (uuidPattern.test(id)) return mediaMap.get(id)?.url ?? undefined;
            // If it's already a full http/https URL, use it directly
            if (id.startsWith('https://') || id.startsWith('http://')) return id;
            // Anything else (local path, "-", etc.) → reject
            return undefined;
          };

          const backgroundImageUrl = resolveMediaUrl(s.background_media_id) ?? undefined;
          const previewImageUrl = resolveMediaUrl(s.preview_media_id) ?? undefined;

          // Resolve redirect path
          let redirectPath = s.redirect_path;
          if (!redirectPath || redirectPath === '-') redirectPath = linkedEntry?.redirectPath;
          if (!redirectPath || redirectPath === '-') {
            const t = (s.title ?? '').toLowerCase();
            if (t.includes('cosmetic')) redirectPath = '/go/cosmetic';
            else if (t.includes('beauty')) redirectPath = '/go/beauty';
            else if (t.includes('franchise')) redirectPath = '/go/franchise';
            else redirectPath = '/';
          }

          if (isDiagMode) {
            console.info('[main cms slide normalized]', {
              title: s.title,
              bgId: s.background_media_id,
              prevId: s.preview_media_id,
              bgResolved: Boolean(backgroundImageUrl),
              prevResolved: Boolean(previewImageUrl),
            });
          }

          return {
            id: s.id,
            title: s.title,
            subtitle: s.subtitle ?? '',
            description: s.description ?? '',
            ctaLabel: s.cta_label ?? linkedEntry?.ctaLabel ?? 'Learn More',
            redirectPath,
            status: s.status,
            sortOrder: s.sort_order,
            backgroundMediaId: s.background_media_id ?? undefined,
            previewMediaId: s.preview_media_id ?? undefined,
            backgroundImageUrl,
            previewImageUrl,
            backgroundAlt: undefined,
            previewAlt: undefined,
            businessEntryId: s.business_entry_id ?? undefined,
          };
        })
      : // No hero_slides in DB yet — derive from business entries (text only, no images)
        businessEntries.map((e) => ({
          id: `derived-${e.id}`,
          title: e.title,
          subtitle: e.subtitle,
          description: e.description,
          ctaLabel: e.ctaLabel,
          redirectPath: e.redirectPath,
          status: e.status,
          sortOrder: e.sortOrder,
          backgroundImageUrl: undefined,
          previewImageUrl: undefined,
          businessEntryId: e.id,
        }));

    // Track whether we used real hero_slides or fell back to derived-from-entries
    const usedDerivedFallback = rawSlides.length === 0;

    if (isDiagMode) {
      console.info('[main cms normalized slides]', {
        normalizedCount: heroSlides.length,
        usingDerivedFallback: usedDerivedFallback,
        normalizedTitles: heroSlides.map(s => ({
          title: s.title,
          bgResolved: Boolean(s.backgroundImageUrl),
          prevResolved: Boolean(s.previewImageUrl),
          isDerived: s.id.startsWith('derived-'),
        })),
      });
    }

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
      fallbackUsed: usedDerivedFallback,
      fallbackReason: usedDerivedFallback
        ? 'hero_slides table is empty — slides derived from business_entries (no images)'
        : undefined,
      rawHeroRowsCount: rawSlides.length,
      activeHeroRowsCount: rawSlides.length,
    };
  } catch (err: any) {
    const fallback = loadStaticCmsData();
    return {
      ...fallback,
      source: 'supabase',
      fallbackUsed: true,
      fallbackReason: `Unexpected error: ${err?.message ?? String(err)}`,
      rawHeroRowsCount: 0,
      activeHeroRowsCount: 0,
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
