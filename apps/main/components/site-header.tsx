'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isValidImageUrl } from '../lib/url-guards';
import { Menu, X } from 'lucide-react';

interface SiteHeaderProps {
  logoUrl?: string;
}

export function SiteHeader({ logoUrl }: SiteHeaderProps) {
  const [logoError, setLogoError] = useState(false);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 md:py-8 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
      <div className="flex items-center pointer-events-auto h-8">
        <Link href="/" className="flex items-center" aria-label="VAVAW Ecosystem Home" onClick={() => setMobileMenuOpen(false)}>
          {!logoError && isValidImageUrl(logoUrl) ? (
            <img 
              src={logoUrl} 
              alt="VAVAW" 
              className="w-auto object-contain transition-opacity duration-300 hover:opacity-80 h-[22px] md:h-[26px] max-w-[150px]"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-[#F8F7F2] font-semibold uppercase tracking-[0.28em] text-lg md:text-xl transition-opacity duration-300 hover:opacity-80">
              VAVAW
            </span>
          )}
        </Link>
      </div>
      <nav className="hidden md:flex items-center gap-10 pointer-events-auto drop-shadow-sm">
        <Link 
          href="/cosmetic" 
          className={`text-xs font-medium tracking-[0.15em] uppercase transition-colors ${pathname === '/cosmetic' ? 'text-white opacity-100' : 'text-[#F8F7F2] opacity-70 hover:opacity-100'}`}
        >
          Cosmetic
        </Link>
        <Link 
          href="/go/beauty" 
          prefetch={false} 
          className="text-[#F8F7F2] opacity-70 hover:opacity-100 text-xs font-medium tracking-[0.15em] uppercase transition-colors"
        >
          Beauty
        </Link>
        <Link 
          href="/go/franchise" 
          prefetch={false} 
          className="text-[#F8F7F2] opacity-70 hover:opacity-100 text-xs font-medium tracking-[0.15em] uppercase transition-colors"
        >
          Franchise
        </Link>
        <Link 
          href="/contact" 
          className={`text-xs font-medium tracking-[0.15em] uppercase transition-colors ${pathname === '/contact' ? 'text-white opacity-100' : 'text-[#F8F7F2] opacity-70 hover:opacity-100'}`}
        >
          Contact
        </Link>
      </nav>

      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden pointer-events-auto text-[#F8F7F2] p-3 -mr-3 flex items-center justify-center"
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
            href="/go/beauty" 
            prefetch={false}
            onClick={() => setMobileMenuOpen(false)} 
            className="flex items-center h-11 px-4 text-[#F8F7F2]/70 hover:text-white hover:bg-white/5 text-sm font-medium tracking-[0.2em] uppercase"
          >
            Beauty
          </Link>
          <Link 
            href="/go/franchise" 
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
