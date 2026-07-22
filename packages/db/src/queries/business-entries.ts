import { tables } from '../schema';
import { BusinessEntryRecord } from '../types';

export async function getBusinessEntries(supabase: any): Promise<{ data: BusinessEntryRecord[] | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.business_entries)
    .select('*')
    .order('sort_order', { ascending: true });
  return { data, error };
}
