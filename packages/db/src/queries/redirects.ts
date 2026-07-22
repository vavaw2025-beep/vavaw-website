import { tables } from '../schema';
import { RedirectRecord } from '../types';

export async function getRedirects(supabase: any): Promise<{ data: RedirectRecord[] | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.redirects)
    .select('*')
    .order('source_path', { ascending: true });
  return { data, error };
}
