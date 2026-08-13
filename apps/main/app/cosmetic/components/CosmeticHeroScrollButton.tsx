'use client';

import { ChevronDown } from 'lucide-react';

export function CosmeticHeroScrollButton() {
  function handleScroll() {
    const target = document.getElementById('cosmetic-content-start');

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }

    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  }

  return (
    <button
      type="button"
      aria-label="Scroll to next section"
      onClick={handleScroll}
      className="group absolute left-1/2 bottom-5 z-20 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-[#050A5C]/20 bg-white/45 text-[#050A5C] shadow-[0_18px_45px_rgba(5,10,92,0.12)] backdrop-blur-md transition-all duration-300 hover:-translate-x-1/2 hover:-translate-y-1 hover:border-[#050A5C]/35 hover:bg-white/70 hover:text-[#050A5C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#050A5C]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-white/30 md:bottom-8 md:h-12 md:w-12 xl:bottom-10"
    >
      <ChevronDown
        className="cosmetic-scroll-arrow-icon h-5 w-5 md:h-6 md:w-6"
        aria-hidden="true"
      />
    </button>
  );
}
