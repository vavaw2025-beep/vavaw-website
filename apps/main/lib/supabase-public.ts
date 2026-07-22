/**
 * Public Supabase client for apps/main.
 *
 * Uses the anon key only — no cookies, no auth session, no service role key.
 * This client is safe for server-side data fetching of publicly accessible
 * CMS data via RLS public read policies.
 *
 * Only instantiated when CMS_DATA_SOURCE=supabase.
 */

import { createClient } from '@supabase/supabase-js';

let _client: ReturnType<typeof createClient> | null = null;

/**
 * Returns a singleton Supabase anon client for public read access.
 * Returns null if required env vars are not set.
 */
export function getPublicSupabaseClient(): ReturnType<typeof createClient> | null {
  if (_client) return _client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  _client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return _client;
}
