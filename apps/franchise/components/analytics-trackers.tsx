'use client';

import { trackEvent } from '@vavaw/analytics';

interface FranchiseCtaButtonProps {
  label: string;
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

export function FranchiseCtaButton({ label, href, className, children }: FranchiseCtaButtonProps) {
  const handleClick = () => {
    trackEvent('franchise_cta_click', {
      app: 'franchise',
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
