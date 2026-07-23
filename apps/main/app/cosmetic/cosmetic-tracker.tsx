'use client';

import { trackEvent } from '@vavaw/analytics';

interface CosmeticCtaButtonProps {
  label: string;
  href: string;
  className?: string;
  children?: React.ReactNode;
}

export function CosmeticCtaTracker({ label, href, className, children }: CosmeticCtaButtonProps) {
  const handleClick = () => {
    trackEvent('cosmetic_cta_click', {
      app: 'main',
      path: '/cosmetic',
      target: href,
      metadata: { label },
    });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
    >
      {children ?? label}
    </a>
  );
}
