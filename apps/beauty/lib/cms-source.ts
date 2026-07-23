/**
 * CMS data source resolver for apps/main.
 *
 * Reads the CMS_DATA_SOURCE environment variable to determine whether
 * the public homepage should fetch data from Supabase or use the static
 * @vavaw/brand-config fallback.
 *
 * Allowed values:
 *   - "static"   → use @vavaw/brand-config only (default, always safe)
 *   - "supabase" → try Supabase first, fallback to static on error/empty
 */

export type CmsDataSource = 'static' | 'supabase';

export function getCmsDataSource(): CmsDataSource {
  const value = process.env.CMS_DATA_SOURCE;
  if (value === 'supabase') {
    return 'supabase';
  }
  return 'static';
}
