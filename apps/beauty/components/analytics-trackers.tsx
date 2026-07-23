'use client';

import { trackEvent } from '@vavaw/analytics';

interface BeautyCtaButtonProps {
  label: string;
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export function BeautyCtaButton({ label, href, className, children }: BeautyCtaButtonProps) {
  const handleClick = () => {
    trackEvent('beauty_cta_click', {
      app: 'beauty',
      path: '/',
      target: href,
      metadata: { label },
    });
    if (href) window.location.href = href;
  };

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      {children ?? label}
    </button>
  );
}
