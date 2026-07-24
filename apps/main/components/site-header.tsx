import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-8 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none">
      <div className="flex items-center pointer-events-auto">
        <Link href="/" className="text-white text-2xl font-semibold tracking-[0.25em] uppercase drop-shadow-md" aria-label="VAVAW Ecosystem Home">
          VAVAW
        </Link>
      </div>
      <nav className="hidden md:flex items-center gap-10 pointer-events-auto drop-shadow-sm">
        <Link href="/cosmetic" className="text-white/80 hover:text-white text-xs font-medium tracking-[0.15em] uppercase transition-colors">
          Cosmetic
        </Link>
        <Link href="/go/beauty" className="text-white/80 hover:text-white text-xs font-medium tracking-[0.15em] uppercase transition-colors">
          Beauty
        </Link>
        <Link href="/go/franchise" className="text-white/80 hover:text-white text-xs font-medium tracking-[0.15em] uppercase transition-colors">
          Franchise
        </Link>
        <Link href="/contact" className="text-white/80 hover:text-white text-xs font-medium tracking-[0.15em] uppercase transition-colors">
          Contact
        </Link>
      </nav>
      {/* Mobile nav could be added here, but keeping it minimal for cinematic hero */}
    </header>
  );
}
