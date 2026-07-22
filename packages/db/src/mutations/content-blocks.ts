import { tables } from '../schema';
import { ContentBlockRecord } from '../types';

export type CreateContentBlockInput = Omit<ContentBlockRecord, 'id' | 'created_at' | 'updated_at'>;
export type UpdateContentBlockInput = Partial<CreateContentBlockInput>;

export async function createContentBlock(
  supabase: any,
  input: CreateContentBlockInput
): Promise<{ data: ContentBlockRecord | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.content_blocks)
    .insert([input])
    .select()
    .single();

  return { data, error };
}

export async function updateContentBlock(
  supabase: any,
  id: string,
  input: UpdateContentBlockInput
): Promise<{ data: ContentBlockRecord | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.content_blocks)
    .update(input)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function deleteContentBlock(
  supabase: any,
  id: string
): Promise<{ success: boolean; error: any }> {
  const { error } = await supabase
    .from(tables.content_blocks)
    .delete()
    .eq('id', id);

  return { success: !error, error };
}
