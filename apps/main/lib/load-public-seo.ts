/**
 * Public SEO metadata loader for apps/main.
 *
 * Returns normalized SEO metadata for a given page path from either:
 *   - Static @vavaw/brand-config (CMS_DATA_SOURCE=static, default)
 *   - Supabase public.seo_settings via anon client + RLS (CMS_DATA_SOURCE=supabase)
 *
 * Always returns a valid result — never throws.
 * Used in server-side generateMetadata() functions only.
 */

import { getBusinessBySlug, getSortedBusinessEntries } from '@vavaw/brand-config';
import { getCmsDataSource } from './cms-source';
import { getPublicSupabaseClient } from './supabase-public';

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

export interface PublicSeoData {
  title: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImageUrl?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  source: 'static' | 'supabase';
}

// ---------------------------------------------------------------------------
// Static path → SEO mapper
// ---------------------------------------------------------------------------

/**
 * Map a public URL path to static SEO data from @vavaw/brand-config.
 * Falls back to sensible defaults if no exact match is found.
 */
function loadStaticSeo(path: string): PublicSeoData {
  // /cosmetic -> slug = "cosmetic"
  const slug = path.replace(/^\//, '').split('/')[0] || '';

  if (slug) {
    const entry = getBusinessBySlug(slug);
    if (entry?.seo) {
      return {
        title: entry.seo.title || entry.title,
        description: entry.seo.description || entry.description,
        keywords: entry.seo.keywords,
        canonicalUrl: entry.seo.canonicalUrl,
        ogImageUrl: entry.media?.ogImage,
        robotsIndex: true,
        robotsFollow: true,
        source: 'static',
      };
    }
  }

  // Homepage fallback
  const allEntries = getSortedBusinessEntries();
  const firstEntry = allEntries[0];
  return {
    title: 'VAVAW | Brand Ecosystem',
    description: 'VAVAW is a premium multi-brand ecosystem spanning cosmetics, beauty & care, and franchise opportunities.',
    keywords: firstEntry?.seo?.keywords,
    robotsIndex: true,
    robotsFollow: true,
    source: 'static',
  };
}

// ---------------------------------------------------------------------------
// Supabase loader
// ---------------------------------------------------------------------------

async function loadSupabaseSeo(path: string): Promise<PublicSeoData> {
  const supabase = getPublicSupabaseClient();

  if (!supabase) {
    return loadStaticSeo(path);
  }

  try {
    const { data: rawData, error } = await supabase
      .from('seo_settings')
      .select('id, title, description, keywords, canonical_url, og_media_id, robots_index, robots_follow')
      .eq('site_key', 'main')
      .eq('path', path)
      .maybeSingle();

    const row = rawData as {
      id: string;
      title: string;
      description: string | null;
      keywords: string[] | null;
      canonical_url: string | null;
      og_media_id: string | null;
      robots_index: boolean;
      robots_follow: boolean;
    } | null;

    if (error || !row) {
      return loadStaticSeo(path);
    }

    // Validate boolean fields (guard against unexpected null from DB)
    if (typeof row.robots_index !== 'boolean' || typeof row.robots_follow !== 'boolean') {
      return loadStaticSeo(path);
    }

    // Resolve OG image URL from media_assets if og_media_id is set
    let ogImageUrl: string | undefined;
    if (row.og_media_id) {
      const { data: mediaRow } = await supabase
        .from('media_assets')
        .select('url')
        .eq('id', row.og_media_id)
        .maybeSingle();

      const mediaData = mediaRow as { url: string } | null;
      if (mediaData?.url) {
        ogImageUrl = mediaData.url;
      }
    }

    return {
      title: row.title,
      description: row.description ?? undefined,
      keywords: row.keywords ?? undefined,
      canonicalUrl: row.canonical_url ?? undefined,
      ogImageUrl,
      robotsIndex: row.robots_index,
      robotsFollow: row.robots_follow,
      source: 'supabase',
    };
  } catch {
    return loadStaticSeo(path);
  }
}

// ---------------------------------------------------------------------------
// Main public export
// ---------------------------------------------------------------------------

/**
 * Load public SEO metadata for a given path.
 * Always returns valid metadata — never throws.
 *
 * @param path - Public page path, e.g. "/" or "/cosmetic"
 */
export async function loadPublicSeo(path: string): Promise<PublicSeoData> {
  const source = getCmsDataSource();

  if (source === 'supabase') {
    return loadSupabaseSeo(path);
  }

  return loadStaticSeo(path);
}
