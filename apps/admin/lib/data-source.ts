export type AdminDataSourceMode = 'static' | 'supabase';

export function getAdminDataSourceMode(): AdminDataSourceMode {
  const mode = process.env.NEXT_PUBLIC_ADMIN_AUTH_MODE || process.env.ADMIN_AUTH_MODE;
  if (mode === 'supabase') {
    return 'supabase';
  }
  return 'static';
}
