import { tables } from '../schema';
import { SeoSettingRecord } from '../types';

export async function getSeoSettings(supabase: any): Promise<{ data: SeoSettingRecord[] | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.seo_settings)
    .select('*')
    .order('site_key', { ascending: true });
  return { data, error };
}
