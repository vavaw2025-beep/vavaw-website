import { createBrowserClient } from '@supabase/ssr';

export function createBrowserSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Anon Key are required to create a Supabase client.');
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
