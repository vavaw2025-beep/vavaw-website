import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const mode = process.env.NEXT_PUBLIC_ADMIN_AUTH_MODE || process.env.ADMIN_AUTH_MODE || 'mock';

  // If in mock mode, bypass all protection
  if (mode === 'mock') {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  // Bypass public paths explicitly if matched by mistake
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/public') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // If Supabase credentials are missing while mode is supabase, redirect to login
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('error', 'session-expired');
    return NextResponse.redirect(loginUrl);
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Fetch current session user securely from Supabase Auth server
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('error', 'session-expired');
    return NextResponse.redirect(loginUrl);
  }

  // Admin Profile Guard: Verify public.admin_profiles record
  const { data: profile, error: profileError } = await supabase
    .from('admin_profiles')
    .select('id, role, status')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('error', 'no-admin-profile');
    return NextResponse.redirect(loginUrl);
  }

  if (profile.status === 'disabled') {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('error', 'disabled');
    return NextResponse.redirect(loginUrl);
  }

  const validRoles = ['owner', 'admin', 'editor', 'viewer'];
  if (profile.status !== 'active' || !validRoles.includes(profile.role)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('error', 'no-admin-profile');
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - login route
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|login).*)',
  ],
};
