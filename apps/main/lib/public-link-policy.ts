// The definitive policy for public links across the main and cosmetic platforms.

export const APPROVED_PUBLIC_LINKS = new Set([
  '/',
  '/cosmetic',
  '/contact',
  '/go/cosmetic',
  '/go/beauty',
  '/go/franchise',
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
  'vavaw.vn',
  'beauty.vavaw.vn',
  'franchise.vavaw.vn'
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
