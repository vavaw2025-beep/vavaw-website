import React from 'react';

export type SiteFooterVariant = 'main' | 'cosmetic' | 'beauty' | 'franchise';

export interface SiteFooterProps {
  variant?: SiteFooterVariant;
  className?: string;
  links?: {
    cosmetic?: string;
    beauty?: string;
    franchise?: string;
    contact?: string;
  };
}

export function SiteFooter({ variant = 'main', className = '', links = {} }: SiteFooterProps) {
  // Default links
  const defaultLinks = {
    cosmetic: '/cosmetic',
    beauty: 'https://beauty.vavaw.vn',
    franchise: 'https://franchise.vavaw.vn',
    contact: '/contact',
    ...links
  };

  // Determine styling based on variant
  let containerStyle = '';
  let logoStyle = '';
  let linkStyle = '';
  let dividerStyle = '';
  let textStyle = '';

  switch (variant) {
    case 'main':
      containerStyle = 'bg-black text-[#f9f7f4]';
      logoStyle = 'text-white tracking-[0.25em]';
      linkStyle = 'text-[#c0c0c0] hover:text-white'; // silver to white
      dividerStyle = 'border-white/10';
      textStyle = 'text-[#c0c0c0]';
      break;
    case 'cosmetic':
      containerStyle = 'bg-[#fdfcfb] text-[#5c544d]'; // ivory
      logoStyle = 'text-[#332f2b] tracking-[0.25em]';
      linkStyle = 'text-[#8b837b] hover:text-[#332f2b]'; // taupe to dark beige
      dividerStyle = 'border-[#5c544d]/10';
      textStyle = 'text-[#8b837b]';
      break;
    case 'beauty':
      containerStyle = 'bg-[#fffaf5] text-[#4a3f35]'; // warm ivory
      logoStyle = 'text-[#3d2b1f] tracking-[0.25em]'; // espresso
      linkStyle = 'text-[#b78c85] hover:text-[#3d2b1f]'; // blush rose to espresso
      dividerStyle = 'border-[#3d2b1f]/10';
      textStyle = 'text-[#8c7a6b]';
      break;
    case 'franchise':
      containerStyle = 'bg-black text-[#f9f7f4]';
      logoStyle = 'text-white tracking-[0.25em]';
      linkStyle = 'text-[#f6e2b3] hover:text-white'; // champagne gold to white
      dividerStyle = 'border-white/10';
      textStyle = 'text-[#c69c6d]'; // amber
      break;
  }

  return (
    <footer className={`${containerStyle} py-12 md:py-20 px-6 md:px-12 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <a href="/" className={`text-2xl md:text-3xl font-semibold uppercase ${logoStyle} mb-6 block`}>
          VAVAW
        </a>
        <p className={`max-w-md mx-auto text-sm md:text-base leading-relaxed ${textStyle} mb-12`}>
          A premium multi-brand ecosystem spanning cosmetics, beauty & care, and franchise opportunities.
        </p>

        <nav className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12">
          <a href={defaultLinks.cosmetic} className={`text-xs md:text-sm font-medium tracking-widest uppercase transition-colors ${linkStyle}`}>
            Cosmetic
          </a>
          <a href={defaultLinks.beauty} className={`text-xs md:text-sm font-medium tracking-widest uppercase transition-colors ${linkStyle}`}>
            Beauty
          </a>
          <a href={defaultLinks.franchise} className={`text-xs md:text-sm font-medium tracking-widest uppercase transition-colors ${linkStyle}`}>
            Franchise
          </a>
          <a href={defaultLinks.contact} className={`text-xs md:text-sm font-medium tracking-widest uppercase transition-colors ${linkStyle}`}>
            Contact
          </a>
        </nav>

        <div className={`w-full max-w-2xl border-t ${dividerStyle} pt-8 flex flex-col md:flex-row justify-between items-center gap-4`}>
          <p className={`text-xs ${textStyle}`}>
            &copy; {new Date().getFullYear()} VAVAW. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className={`text-xs ${textStyle} hover:underline`}>Privacy Policy</a>
            <a href="#" className={`text-xs ${textStyle} hover:underline`}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
