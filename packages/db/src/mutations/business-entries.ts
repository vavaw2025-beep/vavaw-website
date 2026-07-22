import { tables } from '../schema';
import { BusinessEntryRecord } from '../types';

export type CreateBusinessEntryInput = Omit<BusinessEntryRecord, 'id' | 'created_at' | 'updated_at'>;
export type UpdateBusinessEntryInput = Partial<CreateBusinessEntryInput>;

export async function createBusinessEntry(
  supabase: any,
  input: CreateBusinessEntryInput
): Promise<{ data: BusinessEntryRecord | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.business_entries)
    .insert([input])
    .select()
    .single();

  return { data, error };
}

export async function updateBusinessEntry(
  supabase: any,
  id: string,
  input: UpdateBusinessEntryInput
): Promise<{ data: BusinessEntryRecord | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.business_entries)
    .update(input)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function deleteBusinessEntry(
  supabase: any,
  id: string
): Promise<{ success: boolean; error: any }> {
  const { error } = await supabase
    .from(tables.business_entries)
    .delete()
    .eq('id', id);

  return { success: !error, error };
}
