import { NextRequest, NextResponse } from 'next/server';
import { loadPublicRedirectBySlug } from '@/lib/load-public-redirect';

/**
 * GET /go/[slug]
 *
 * Resolves and performs a redirect for a given business slug.
 *
 * Data source:
 *   - CMS_DATA_SOURCE=static  → @vavaw/brand-config (default)
 *   - CMS_DATA_SOURCE=supabase → public.business_entries + safe fallback
 *
 * Security: all destination URLs are validated via isSafeRedirectUrl()
 * before the redirect is issued. Unsafe URLs are rejected and the user
 * is sent to "/" instead.
 *
 * This route is always dynamic (no static generation) since it may
 * serve real-time CMS data in supabase mode.
 */
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const result = await loadPublicRedirectBySlug(slug);

  if (result.destinationUrl) {
    // Internal path: resolve against current request URL
    if (result.destinationUrl.startsWith('/')) {
      return NextResponse.redirect(new URL(result.destinationUrl, request.url), {
        status: 302,
      });
    }

    // Trusted external URL: redirect directly
    return NextResponse.redirect(result.destinationUrl, { status: 302 });
  }

  // Not found or unsafe — redirect home safely
  return NextResponse.redirect(new URL('/', request.url), { status: 302 });
}
