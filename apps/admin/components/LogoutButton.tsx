"use client";

import { LogOut } from 'lucide-react';
import { createBrowserSupabaseClient } from '@vavaw/auth';
import { trackEvent } from '@vavaw/analytics';

export function LogoutButton() {
  const handleLogout = async () => {
    const authMode = process.env.NEXT_PUBLIC_ADMIN_AUTH_MODE || 'mock';

    if (authMode === 'supabase') {
      try {
        const supabase = createBrowserSupabaseClient();
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Logout error:', err);
      }
    }

    // Track logout event — no PII, no user identity
    trackEvent('admin_logout', {
      app: 'admin',
      path: window.location.pathname,
    });

    // Force full page navigation to /login to ensure session state is completely cleared
    window.location.href = '/login';
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
      title="Sign out"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span>Sign out</span>
    </button>
  );
}
