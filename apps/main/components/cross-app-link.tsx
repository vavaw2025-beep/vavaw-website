'use client';

import React from 'react';
import Link from 'next/link';
import { resolvePublicHref } from '@/lib/unfinished-links';

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

  // 3 & 5. Internal links and fallbacks use Next Link
  if (isInternal || isHash || isFallback) {
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
        prefetch={false}
        ref={ref}
      >
        {children}
      </Link>
    );
  }

  // 4. External trusted VAVAW domains use standard <a> tag
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
      ref={ref}
    >
      {children}
    </a>
  );
});

CrossAppLink.displayName = 'CrossAppLink';
