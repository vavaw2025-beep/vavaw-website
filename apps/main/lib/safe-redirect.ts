/**
 * Safe redirect URL validator for apps/main public routes.
 *
 * Prevents open-redirect vulnerabilities by only allowing:
 *   - Internal paths starting with "/"
 *   - Trusted configured domains from env or the known VAVAW domain set
 *
 * Never allows: javascript:, data:, malformed URLs, unknown external domains.
 */

/** Canonical list of trusted VAVAW domains (always allowed) */
const TRUSTED_DOMAINS = new Set([
  'vavaw.vn',
  'www.vavaw.vn',
  'beauty.vavaw.vn',
  'franchise.vavaw.vn',
  'admin.vavaw.vn',
]);

/**
 * Collects all allowed origins from env variables at call-time.
 * Reads NEXT_PUBLIC_BEAUTY_URL and NEXT_PUBLIC_FRANCHISE_URL dynamically
 * so the set is always fresh (useful in tests and Edge environments).
 */
function getTrustedOrigins(): Set<string> {
  const origins = new Set<string>(TRUSTED_DOMAINS);

  const beautyUrl = process.env.NEXT_PUBLIC_BEAUTY_URL;
  const franchiseUrl = process.env.NEXT_PUBLIC_FRANCHISE_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  for (const raw of [beautyUrl, franchiseUrl, siteUrl]) {
    if (!raw) continue;
    try {
      const { hostname } = new URL(raw);
      if (hostname) origins.add(hostname);
    } catch {
      // ignore malformed env values
    }
  }

  return origins;
}

/**
 * Returns true if the URL is safe to redirect to.
 *
 * Safe URLs are:
 *   - Relative internal paths: must start with "/" and not "//"
 *     (double-slash would be parsed as protocol-relative by browsers)
 *   - Absolute URLs on a trusted VAVAW domain (http or https only)
 *
 * Unsafe URLs include:
 *   - javascript:, data:, vbscript:, etc.
 *   - Protocol-relative URLs starting with "//"
 *   - Any external domain not in the trusted set
 *   - Malformed URLs that throw on parse
 */
export function isSafeRedirectUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  const trimmed = url.trim();
  if (trimmed.length === 0) return false;

  // Reject protocol-relative URLs (//evil.com)
  if (trimmed.startsWith('//')) return false;

  // Allow clean internal paths (/cosmetic, /go/slug, etc.)
  if (trimmed.startsWith('/')) return true;

  // For absolute URLs, parse and validate scheme + hostname
  try {
    const parsed = new URL(trimmed);

    // Only http and https are allowed
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;

    const trustedOrigins = getTrustedOrigins();
    return trustedOrigins.has(parsed.hostname);
  } catch {
    // Malformed URL
    return false;
  }
}

/**
 * Returns the URL if it is safe, or null if it should be rejected.
 * Convenience wrapper for route handlers.
 */
export function resolveSafeRedirectUrl(url: string): string | null {
  return isSafeRedirectUrl(url) ? url : null;
}
