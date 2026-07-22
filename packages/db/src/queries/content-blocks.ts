import { tables } from '../schema';
import { ContentBlockRecord } from '../types';

export async function getContentBlocks(supabase: any): Promise<{ data: ContentBlockRecord[] | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.content_blocks)
    .select('*')
    .order('sort_order', { ascending: true });
  return { data, error };
}
