'use client';

import React from 'react';
import Link from 'next/link';
import { resolvePublicHref } from '@/lib/unfinished-links';
import { shouldUseDocumentNavigation } from '@/lib/navigation-policy';

export type CrossAppLinkProps = {
  href: string;
  children?: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  sourcePath?: string;
  linkType?: "nav" | "cta" | "footer" | "product" | "external";
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export const CrossAppLink = React.forwardRef<HTMLAnchorElement, CrossAppLinkProps>(({
  href,
  children,
  className,
  target,
  rel,
  sourcePath,
  linkType,
  ariaLabel,
  onClick,
}, ref) => {
  // 1. Resolve href
  const resolvedHref = resolvePublicHref(href, sourcePath || '/');

  // 2. Detect link type
  const isInternal = resolvedHref.startsWith('/') && !resolvedHref.startsWith('//');
  const isHash = resolvedHref.startsWith('#');
  const isFallback = resolvedHref.includes('/system-update');

  const isExternalVavaw =
    resolvedHref.startsWith('https://beauty.vavaw.vn') ||
    resolvedHref.startsWith('https://franchise.vavaw.vn') ||
    resolvedHref.startsWith('https://vavaw.vn');

  let linkStatus = 'approved';
  if (isFallback) linkStatus = 'fallback';
  else if (isExternalVavaw) linkStatus = 'external-vavaw';

  const dataOriginalHref = href !== resolvedHref ? href : undefined;
  
  const useDocumentNavigation = shouldUseDocumentNavigation(resolvedHref);
  let navMode = 'external';
  
  if (useDocumentNavigation) {
    navMode = 'document';
  } else if (isInternal || isHash || isFallback) {
    navMode = 'next-link';
  }

  // 3 & 5. Internal links (that don't need document reload) use Next Link
  if (navMode === 'next-link') {
    return (
      <Link
        href={resolvedHref}
        className={className}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        onClick={onClick}
        data-link-status={linkStatus}
        data-original-href={dataOriginalHref}
        data-final-href={resolvedHref}
        data-navigation-mode={navMode}
        prefetch={false}
        ref={ref}
      >
        {children}
      </Link>
    );
  }

  // 4. External trusted VAVAW domains, CMS-heavy routes, and fallback pages use standard <a> tag.
  // We use document navigation (native <a> tag) for CMS-heavy routes to bypass Next.js 
  // SPA hydration and RSC state, ensuring the server-rendered HTML is immediately 
  // presented without stale client-side lags or rendering freezes.
  return (
    <a
      href={resolvedHref}
      className={className}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      onClick={onClick}
      data-link-status={linkStatus}
      data-original-href={dataOriginalHref}
      data-final-href={resolvedHref}
      data-navigation-mode={navMode}
      ref={ref}
    >
      {children}
    </a>
  );
});

CrossAppLink.displayName = 'CrossAppLink';
