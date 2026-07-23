import 'server-only';
import { createClient } from '@supabase/supabase-js';

export function getPreviewSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  const keyToUse = secretKey || serviceKey;

  if (!supabaseUrl || !keyToUse) {
    throw new Error('Missing Supabase URL or Secret/Service Role Key for preview client');
  }

  // Prevent accidental usage of public anon key for privileged access
  if (keyToUse === process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Cannot use anon key as preview secret key');
  }

  return createClient(supabaseUrl, keyToUse, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
}
