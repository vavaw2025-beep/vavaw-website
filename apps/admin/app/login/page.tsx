"use client";

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { createBrowserSupabaseClient } from '@vavaw/auth';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'no-admin-profile':
        return 'Your account does not have an active admin profile assigned. Please contact an administrator.';
      case 'disabled':
        return 'Your admin account has been disabled. Access denied.';
      case 'session-expired':
        return 'Your session has expired or is invalid. Please sign in again.';
      default:
        return null;
    }
  };

  const errorMessage = authError || getErrorMessage(errorParam);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (process.env.NEXT_PUBLIC_ADMIN_AUTH_MODE === 'mock') {
      import('@vavaw/analytics').then(({ trackEvent }) => {
        trackEvent('admin_login_success', {
          app: 'admin',
          metadata: { role: 'mock_bypass' }
        });
      });
      router.push('/');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
        setIsLoading(false);
        return;
      }

      if (data.session) {
        import('@vavaw/analytics').then(({ trackEvent }) => {
          trackEvent('admin_login_success', {
            app: 'admin',
            metadata: { method: 'password' }
          });
        });
        // Hard refresh to ensure middleware catches the new session cookies
        window.location.href = '/';
      }
    } catch (err: any) {
      setAuthError(err.message || 'An unexpected error occurred during login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">VAVAW Admin</h1>
          <p className="mt-2 text-sm text-slate-400">Internal dashboard access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Error Alert from Middleware or Auth */}
          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200 text-xs leading-relaxed">
              <XCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vavaw.vn"
                  className="block w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-lg shadow-lg shadow-blue-600/25 transition-all text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Mock / Production Notice */}
          <div className="mt-6">
            {process.env.NEXT_PUBLIC_ADMIN_AUTH_MODE === 'mock' && process.env.NODE_ENV === 'production' ? (
              <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-200/90 leading-relaxed font-semibold">
                  SECURITY WARNING: Mock Auth Mode is enabled in a production environment. 
                  This is insecure and bypasses all route protection. Switch ADMIN_AUTH_MODE to supabase immediately.
                </p>
              </div>
            ) : null}
          </div>

          {/* Back to dashboard */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
            >
              <ArrowRight className="h-3 w-3 rotate-180" />
              Back to dashboard
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} VAVAW Platform &middot; Internal use only
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-sm">
        Loading...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
