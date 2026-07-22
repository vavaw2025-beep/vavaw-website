import { tables } from '../schema';
import { MediaAssetRecord } from '../types';

export async function getMediaAssets(supabase: any): Promise<{ data: MediaAssetRecord[] | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.media_assets)
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}
