import { getSystemUpdateUrl } from './get-system-update-url';
import { APPROVED_PUBLIC_LINKS, isApprovedExternalDomain } from './public-link-policy';

export function resolvePublicHref(
  href: string | undefined | null,
  sourcePath?: string,
  options?: {
    linkType?: 'cta' | 'nav' | 'footer' | 'product' | 'external';
  }
): string {
  const fallbackUrl = getSystemUpdateUrl('coming-soon', sourcePath || href || '/unfinished');

  if (!href || href.trim() === '' || href.trim() === '#') {
    return fallbackUrl;
  }

  let cleanHref = href.trim();

  // Fallback for unfinished Beauty and Franchise domains
  const beautyUrls = ['https://beauty.vavaw.vn', 'http://beauty.vavaw.vn', 'https://beauty.vavaw.vn/', '/go/beauty', 'https://vavaw.vn/go/beauty'];
  if (beautyUrls.includes(cleanHref)) {
    return getSystemUpdateUrl('coming-soon', 'https://beauty.vavaw.vn');
  }

  const franchiseUrls = ['https://franchise.vavaw.vn', 'http://franchise.vavaw.vn', 'https://franchise.vavaw.vn/', '/go/franchise', 'https://vavaw.vn/go/franchise'];
  if (franchiseUrls.includes(cleanHref)) {
    return getSystemUpdateUrl('coming-soon', 'https://franchise.vavaw.vn');
  }

  // Normalize legacy /go/* internal redirects
  if (cleanHref === '/go/cosmetic' || cleanHref === 'https://vavaw.vn/go/cosmetic') {
    cleanHref = '/cosmetic';
  }

  // Block obvious placeholders
  if (cleanHref === '/coming-soon' || cleanHref === '/placeholder' || cleanHref.includes('PASTE_')) {
    return fallbackUrl;
  }
  
  if (cleanHref.toLowerCase().startsWith('javascript:')) {
    return fallbackUrl;
  }

  // Handle external or absolute URLs
  if (cleanHref.startsWith('http://') || cleanHref.startsWith('https://')) {
    if (isApprovedExternalDomain(cleanHref)) {
      return cleanHref;
    }
    // Unapproved external links (like social, booking) go to system update
    return fallbackUrl;
  }

  // Handle internal URLs with query params (e.g., /contact?type=...)
  const [pathPart, queryPart] = cleanHref.split('?');
  
  // Hash anchors on the same page are allowed temporarily assuming they map to an ID.
  if (pathPart === '' && cleanHref.startsWith('#')) {
    return cleanHref;
  }

  // Explicit approval check
  if (
    APPROVED_PUBLIC_LINKS.has(pathPart) || 
    pathPart.startsWith('/go/') // All /go/* shortlinks are safe redirects
  ) {
    return cleanHref;
  }

  // Anything else not in the allowlist is blocked
  return fallbackUrl;
}

// Keep backward compatibility for the exact old import name in case it is deeply nested elsewhere
// and gradually migrate. We export both.
export const resolveUnfinishedHref = resolvePublicHref;

export const unfinishedLinks = {
  booking: getSystemUpdateUrl('coming-soon', '/booking'),
  blog: getSystemUpdateUrl('coming-soon', '/blog'),
  shop: getSystemUpdateUrl('coming-soon', '/shop'),
  privacy: getSystemUpdateUrl('coming-soon', '/privacy-policy'),
  terms: getSystemUpdateUrl('coming-soon', '/terms-of-service'),
};
