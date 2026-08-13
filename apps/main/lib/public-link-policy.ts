// The definitive policy for public links across the main and cosmetic platforms.

export const APPROVED_PUBLIC_LINKS = new Set([
  '/',
  '/cosmetic',
  '/contact',
  '/go/cosmetic', // legacy fallback, prefer /cosmetic
  '/cosmetic/products/luminous-revitalization-sheer-set',
  '/cosmetic/products/cellurevive-ampoule',
  '/cosmetic/products/regenaglow-nourish-sheer-cream',
  '/cosmetic/products/calmiance-superior-sheer-gel',
  '/cosmetic/products/p30-boost-facial-hydrating-toner',
  '/cosmetic/products/gentle-activation-renew-ampoule',
  '/cosmetic/products/p30-boost-facial-moisturizer',
  '/cosmetic/products/lumiglow-rosy-sheer-sunscreen',
  '/system-update'
]);

export const APPROVED_EXTERNAL_DOMAINS = new Set([
  'vavaw.vn'
  // Note: beauty.vavaw.vn and franchise.vavaw.vn are temporarily marked as unfinished
]);

/**
 * Validates if an external URL is fully approved based on host domains.
 */
export function isApprovedExternalDomain(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Removing www. prefix for cleaner domain matching if it exists
    const host = parsed.hostname.replace(/^www\./, '');
    return APPROVED_EXTERNAL_DOMAINS.has(host);
  } catch (e) {
    return false;
  }
}
