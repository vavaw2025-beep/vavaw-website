import { getSystemUpdateUrl } from './get-system-update-url';

export function resolveUnfinishedHref(
  href: string | undefined | null,
  fromPath?: string,
  reason: string = 'coming-soon'
): string {
  if (!href || href === '#' || href === '' || href.trim() === '#' || href === '/coming-soon' || href === '/placeholder' || href.includes('PASTE_')) {
    return getSystemUpdateUrl(reason, fromPath || href || '/unfinished');
  }
  return href;
}

export const unfinishedLinks = {
  booking: getSystemUpdateUrl('coming-soon', '/booking'),
  blog: getSystemUpdateUrl('coming-soon', '/blog'),
  shop: getSystemUpdateUrl('coming-soon', '/shop'),
  privacy: getSystemUpdateUrl('coming-soon', '/privacy-policy'),
  terms: getSystemUpdateUrl('coming-soon', '/terms-of-service'),
};
