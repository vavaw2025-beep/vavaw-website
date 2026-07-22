import { tables } from '../schema';
import { SeoSettingRecord } from '../types';

export type CreateSeoSettingInput = Omit<SeoSettingRecord, 'id' | 'created_at' | 'updated_at'>;
export type UpdateSeoSettingInput = Partial<CreateSeoSettingInput>;

export async function createSeoSetting(
  supabase: any,
  input: CreateSeoSettingInput
): Promise<{ data: SeoSettingRecord | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.seo_settings)
    .insert([input])
    .select()
    .single();

  return { data, error };
}

export async function updateSeoSetting(
  supabase: any,
  id: string,
  input: UpdateSeoSettingInput
): Promise<{ data: SeoSettingRecord | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.seo_settings)
    .update(input)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function deleteSeoSetting(
  supabase: any,
  id: string
): Promise<{ success: boolean; error: any }> {
  const { error } = await supabase
    .from(tables.seo_settings)
    .delete()
    .eq('id', id);

  return { success: !error, error };
}
