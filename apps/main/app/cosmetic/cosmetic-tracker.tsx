'use client';

import { trackEvent } from '@vavaw/analytics';

interface CosmeticCtaButtonProps {
  label: string;
  href: string;
  className?: string;
  children?: React.ReactNode;
}

import { CrossAppLink } from '@/components/cross-app-link';
import { resolvePublicHref } from '@/lib/unfinished-links';

export function CosmeticCtaTracker({ label, href, className, children }: CosmeticCtaButtonProps) {
  const resolvedHref = resolvePublicHref(href, '/cosmetic');
  
  const handleClick = () => {
    trackEvent('cosmetic_cta_click', {
      app: 'main',
      path: '/cosmetic',
      target: resolvedHref,
      metadata: { label, originalHref: href },
    });
  };

  return (
    <CrossAppLink
      href={href}
      sourcePath="/cosmetic"
      onClick={handleClick}
      className={className}
      linkType="cta"
    >
      {children ?? label}
    </CrossAppLink>
  );
}
