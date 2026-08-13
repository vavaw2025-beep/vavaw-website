'use client';

import { trackEvent } from '@vavaw/analytics';

interface CosmeticCtaButtonProps {
  label: string;
  href: string;
  className?: string;
  children?: React.ReactNode;
}

import { resolvePublicHref } from '@/lib/unfinished-links';

export function CosmeticCtaTracker({ label, href, className, children }: CosmeticCtaButtonProps) {
  const resolvedHref = resolvePublicHref(href, '/cosmetic');
  const isFallback = resolvedHref.includes('/system-update');

  const handleClick = () => {
    trackEvent('cosmetic_cta_click', {
      app: 'main',
      path: '/cosmetic',
      target: resolvedHref,
      metadata: { label, originalHref: href },
    });
  };

  return (
    <a
      href={resolvedHref}
      onClick={handleClick}
      className={className}
      data-link-status={isFallback ? 'fallback' : 'approved'}
      data-original-href={isFallback ? href : undefined}
    >
      {children ?? label}
    </a>
  );
}
