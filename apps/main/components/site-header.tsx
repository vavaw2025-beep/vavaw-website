'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isValidImageUrl } from '../lib/url-guards';
import { Menu, X } from 'lucide-react';

interface SiteHeaderProps {
  logoUrl?: string;
  logoDarkUrl?: string;
}

export function SiteHeader({ logoUrl, logoDarkUrl }: SiteHeaderProps) {
  const [logoError, setLogoError] = useState(false);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isLightMode = pathname === '/cosmetic';
  
  // Decide which logo to show based on mode
  const activeLogo = isLightMode && logoDarkUrl ? logoDarkUrl : logoUrl;
  const textColor = isLightMode ? 'text-[#050A5C]' : 'text-[#F8F7F2]';
  const textColorHover = isLightMode ? 'hover:text-[#050A5C]/70' : 'hover:opacity-100';
  const activeColor = isLightMode ? 'text-[#050A5C]' : 'text-white';
  const inactiveColor = isLightMode ? 'text-[#050A5C]/60' : 'text-[#F8F7F2] opacity-70';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 md:py-8 ${isLightMode ? 'bg-gradient-to-b from-white/80 via-white/40 to-transparent' : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'} pointer-events-none transition-colors duration-300`}>
      <div className="flex items-center pointer-events-auto h-8">
        <Link href="/" className="flex items-center" aria-label="VAVAW Ecosystem Home" onClick={() => setMobileMenuOpen(false)}>
          {!logoError && isValidImageUrl(activeLogo) ? (
            <img 
              src={activeLogo} 
              alt="VAVAW" 
              className="w-auto object-contain transition-opacity duration-300 hover:opacity-80 h-[22px] md:h-[26px] max-w-[150px]"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className={`${isLightMode ? 'text-[#050A5C]' : 'text-[#F8F7F2]'} font-semibold uppercase tracking-[0.28em] text-lg md:text-xl transition-opacity duration-300 hover:opacity-80`}>
              VAVAW
            </span>
          )}
        </Link>
      </div>
      <nav className="hidden md:flex items-center gap-10 pointer-events-auto drop-shadow-sm">
        <Link 
          href="/cosmetic" 
          className={`text-xs font-medium tracking-[0.15em] uppercase transition-colors ${pathname === '/cosmetic' ? activeColor : inactiveColor} ${textColorHover}`}
        >
          Cosmetic
        </Link>
        <Link 
          href="https://beauty.vavaw.vn" 
          prefetch={false} 
          className={`${inactiveColor} ${textColorHover} text-xs font-medium tracking-[0.15em] uppercase transition-colors`}
        >
          Beauty
        </Link>
        <Link 
          href="https://franchise.vavaw.vn" 
          prefetch={false} 
          className={`${inactiveColor} ${textColorHover} text-xs font-medium tracking-[0.15em] uppercase transition-colors`}
        >
          Franchise
        </Link>
        <Link 
          href="/contact" 
          className={`text-xs font-medium tracking-[0.15em] uppercase transition-colors ${pathname === '/contact' ? activeColor : inactiveColor} ${textColorHover}`}
        >
          Contact
        </Link>
      </nav>

      {/* Mobile Menu Toggle */}
      <button 
        className={`md:hidden pointer-events-auto ${textColor} p-3 -mr-3 flex items-center justify-center transition-colors`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Dropdown Nav */}
      {mobileMenuOpen && (
        <nav className="absolute top-full left-0 right-0 bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col gap-6 md:hidden pointer-events-auto shadow-2xl">
          <Link 
            href="/cosmetic" 
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center h-11 px-4 text-sm font-medium tracking-[0.2em] uppercase ${pathname === '/cosmetic' ? 'text-white bg-white/5' : 'text-[#F8F7F2]/70 hover:text-white hover:bg-white/5'}`}
          >
            Cosmetic
          </Link>
          <Link 
            href="https://beauty.vavaw.vn" 
            prefetch={false}
            onClick={() => setMobileMenuOpen(false)} 
            className="flex items-center h-11 px-4 text-[#F8F7F2]/70 hover:text-white hover:bg-white/5 text-sm font-medium tracking-[0.2em] uppercase"
          >
            Beauty
          </Link>
          <Link 
            href="https://franchise.vavaw.vn" 
            prefetch={false}
            onClick={() => setMobileMenuOpen(false)} 
            className="flex items-center h-11 px-4 text-[#F8F7F2]/70 hover:text-white hover:bg-white/5 text-sm font-medium tracking-[0.2em] uppercase"
          >
            Franchise
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center h-11 px-4 text-sm font-medium tracking-[0.2em] uppercase ${pathname === '/contact' ? 'text-white bg-white/5' : 'text-[#F8F7F2]/70 hover:text-white hover:bg-white/5'}`}
          >
            Contact
          </Link>
        </nav>
      )}
    </header>
  );
}
