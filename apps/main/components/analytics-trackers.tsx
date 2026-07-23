'use client';

import { trackEvent } from '@vavaw/analytics';

interface HeroCtaButtonProps {
  label: string;
  redirectPath: string;
  slideTitle: string;
}

export function HeroCtaButton({ label, redirectPath, slideTitle }: HeroCtaButtonProps) {
  const handleClick = () => {
    trackEvent('hero_cta_click', {
      app: 'main',
      path: '/',
      target: redirectPath,
      metadata: { slideTitle },
    });
    window.location.href = redirectPath;
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Go to ${slideTitle}`}
      className="mt-4 w-fit px-10 py-4 bg-white/90 backdrop-blur-sm text-black font-medium text-sm tracking-[0.1em] uppercase rounded-none hover:bg-white transition-colors"
    >
      {label}
    </button>
  );
}

interface BusinessCardClickProps {
  slideTitle: string;
  slideIndex: number;
  realIndex: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick: () => void;
  ariaLabel?: string;
}

export function BusinessCardClickTracker({
  slideTitle,
  slideIndex,
  realIndex,
  children,
  className,
  style,
  onClick,
  ariaLabel,
}: BusinessCardClickProps) {
  const handleClick = () => {
    trackEvent('business_card_click', {
      app: 'main',
      path: '/',
      target: slideTitle,
      metadata: { slideIndex, realIndex },
    });
    onClick();
  };

  return (
    <div
      className={className}
      style={style}
      onClick={handleClick}
      aria-label={ariaLabel}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
    >
      {children}
    </div>
  );
}
