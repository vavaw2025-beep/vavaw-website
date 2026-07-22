/**
 * Public redirect loader for apps/main.
 *
 * Resolves a redirect destination for a given slug from either:
 *   - @vavaw/brand-config (CMS_DATA_SOURCE=static, default)
 *   - Supabase public.business_entries (CMS_DATA_SOURCE=supabase)
 *
 * Always returns a normalized result — never throws.
 * The destination URL is validated by resolveSafeRedirectUrl before being returned.
 *
 * Manual testing checklist:
 *
 *   Static mode:
 *   - /go/cosmetic  → /cosmetic  (internal navigation)
 *   - /go/beauty    → NEXT_PUBLIC_BEAUTY_URL or https://beauty.vavaw.vn
 *   - /go/franchise → NEXT_PUBLIC_FRANCHISE_URL or https://franchise.vavaw.vn
 *   - /go/unknown   → not-found → caller redirects to /
 *
 *   Supabase mode:
 *   - /go/cosmetic resolves from business_entries where slug=cosmetic and status=active
 *   - /go/draft-brand → not found (draft/inactive entries not returned by RLS)
 *   - Supabase failure → fallback to static
 *   - Unsafe external URL stored in DB → rejected, not-found returned
 */

import { getBusinessBySlug } from '@vavaw/brand-config';
import { getCmsDataSource } from './cms-source';
import { getPublicSupabaseClient } from './supabase-public';
import { resolveSafeRedirectUrl } from './safe-redirect';

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

export interface PublicRedirectResult {
  /** Validated destination URL (internal path or trusted domain URL) */
  destinationUrl: string | null;
  source: 'static' | 'supabase';
  status: 'found' | 'not-found' | 'fallback';
  reason?: string;
}

// ---------------------------------------------------------------------------
// Static resolver
// ---------------------------------------------------------------------------

function resolveStaticRedirect(slug: string): PublicRedirectResult {
  const entry = getBusinessBySlug(slug);

  if (!entry) {
    return {
      destinationUrl: null,
      source: 'static',
      status: 'not-found',
      reason: `No static business entry for slug: ${slug}`,
    };
  }

  const raw = entry.href;
  const destination = resolveSafeRedirectUrl(raw);

  if (!destination) {
    return {
      destinationUrl: null,
      source: 'static',
      status: 'not-found',
      reason: `Static entry href for "${slug}" failed safety check: ${raw}`,
    };
  }

  return {
    destinationUrl: destination,
    source: 'static',
    status: 'found',
  };
}

// ---------------------------------------------------------------------------
// Supabase resolver
// ---------------------------------------------------------------------------

async function resolveSupabaseRedirect(slug: string): Promise<PublicRedirectResult> {
  const supabase = getPublicSupabaseClient();

  if (!supabase) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[cms-redirect] Supabase env vars not set for slug "${slug}" — falling back to static.`
      );
    }
    return {
      ...resolveStaticRedirect(slug),
      status: 'fallback',
      reason: 'Supabase env vars not configured — using static fallback.',
    };
  }

  try {
    const { data: rawData, error } = await supabase
      .from('business_entries')
      .select('id, slug, href, redirect_path, navigation_type, status')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle();

    // Cast to a known shape since the anon client has no generated types
    const data = rawData as {
      id: string;
      slug: string;
      href: string | null;
      redirect_path: string | null;
      navigation_type: string | null;
      status: string;
    } | null;

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[cms-redirect] Supabase query error for slug "${slug}": ${error.message} — falling back to static.`
        );
      }
      return {
        ...resolveStaticRedirect(slug),
        status: 'fallback',
        reason: `Supabase query error: ${error.message}`,
      };
    }

    if (!data) {
      if (process.env.NODE_ENV === 'development') {
        console.info(
          `[cms-redirect] No active business_entry for slug "${slug}" in Supabase — falling back to static.`
        );
      }
      // Fall back to static for this slug (may exist in static config)
      const fallback = resolveStaticRedirect(slug);
      return {
        ...fallback,
        status: fallback.status === 'found' ? 'fallback' : 'not-found',
        reason: `No active Supabase record for slug "${slug}" — tried static fallback.`,
      };
    }

    // Prefer href for the destination; fall back to redirect_path
    const rawUrl = data.href ?? data.redirect_path;

    if (!rawUrl) {
      return {
        destinationUrl: null,
        source: 'supabase',
        status: 'not-found',
        reason: `Business entry for "${slug}" has no href or redirect_path.`,
      };
    }

    const destination = resolveSafeRedirectUrl(rawUrl);

    if (!destination) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[cms-redirect] URL for slug "${slug}" failed safety check: "${rawUrl}" — not redirecting.`
        );
      }
      return {
        destinationUrl: null,
        source: 'supabase',
        status: 'not-found',
        reason: `Destination URL for "${slug}" failed safety validation: ${rawUrl}`,
      };
    }

    return {
      destinationUrl: destination,
      source: 'supabase',
      status: 'found',
    };
  } catch (err: any) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[cms-redirect] Unexpected error for slug "${slug}": ${err?.message} — falling back to static.`
      );
    }
    return {
      ...resolveStaticRedirect(slug),
      status: 'fallback',
      reason: `Unexpected error: ${err?.message ?? String(err)}`,
    };
  }
}

// ---------------------------------------------------------------------------
// Main public export
// ---------------------------------------------------------------------------

/**
 * Resolves a public redirect destination for a given slug.
 * Always returns a safe, validated result — never throws.
 */
export async function loadPublicRedirectBySlug(slug: string): Promise<PublicRedirectResult> {
  const source = getCmsDataSource();

  if (source === 'supabase') {
    return resolveSupabaseRedirect(slug);
  }

  return resolveStaticRedirect(slug);
}
