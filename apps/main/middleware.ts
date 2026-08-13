import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // 1. Apex Domain Redirect: www.vavaw.vn -> vavaw.vn
  if (host.startsWith('www.vavaw.vn')) {
    url.host = 'vavaw.vn';
    url.port = '';
    url.protocol = 'https';
    return NextResponse.redirect(url, { status: 301 });
  }

  const response = NextResponse.next();

  // 2. Vercel Preview / vercel.app Noindex Protection
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
