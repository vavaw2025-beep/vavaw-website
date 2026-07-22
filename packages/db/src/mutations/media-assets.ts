import { tables } from '../schema';
import { MediaAssetRecord } from '../types';

export type CreateMediaAssetInput = Omit<MediaAssetRecord, 'id' | 'created_at' | 'updated_at'>;
export type UpdateMediaAssetInput = Partial<CreateMediaAssetInput>;

export async function createMediaAsset(
  supabase: any,
  input: CreateMediaAssetInput
): Promise<{ data: MediaAssetRecord | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.media_assets)
    .insert([input])
    .select()
    .single();

  return { data, error };
}

export async function updateMediaAsset(
  supabase: any,
  id: string,
  input: UpdateMediaAssetInput
): Promise<{ data: MediaAssetRecord | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.media_assets)
    .update(input)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function deleteMediaAsset(
  supabase: any,
  id: string
): Promise<{ success: boolean; error: any }> {
  const { error } = await supabase
    .from(tables.media_assets)
    .delete()
    .eq('id', id);

  return { success: !error, error };
}
