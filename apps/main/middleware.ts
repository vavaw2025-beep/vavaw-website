import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase();

  // 1. WWW -> Apex Redirect: www.vavaw.vn -> vavaw.vn
  // Preserves pathname and query string parameters, uses 301 Permanent Redirect
  if (host === 'www.vavaw.vn' || host.startsWith('www.vavaw.vn:')) {
    const url = request.nextUrl.clone();
    url.host = 'vavaw.vn';
    url.port = '';
    url.protocol = 'https';
    return NextResponse.redirect(url, { status: 301 });
  }

  const response = NextResponse.next();

  // 2. Vercel Preview / vercel.app Noindex Protection
  // Adds header only — does NOT issue a redirect
  if (host.includes('vercel.app')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
