import { tables } from '../schema';
import { AdminProfileRecord } from '../types';

export type CreateAdminProfileInput = Omit<AdminProfileRecord, 'created_at' | 'updated_at'>;
// id is required for create, email, role, status. 
export type UpdateAdminProfileInput = Partial<Omit<AdminProfileRecord, 'id' | 'created_at' | 'updated_at'>>;

export async function createAdminProfile(
  supabase: any,
  input: CreateAdminProfileInput
): Promise<{ data: AdminProfileRecord | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.admin_profiles)
    .insert([input])
    .select()
    .single();

  return { data, error };
}

export async function updateAdminProfile(
  supabase: any,
  id: string,
  input: UpdateAdminProfileInput
): Promise<{ data: AdminProfileRecord | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.admin_profiles)
    .update(input)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function disableAdminProfile(
  supabase: any,
  id: string
): Promise<{ success: boolean; error: any }> {
  const { error } = await supabase
    .from(tables.admin_profiles)
    .update({ status: 'disabled' })
    .eq('id', id);

  return { success: !error, error };
}
