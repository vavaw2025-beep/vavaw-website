import { tables } from '../schema';
import { AdminProfileRecord } from '../types';

export async function getAdminProfiles(
  supabase: any
): Promise<{ data: AdminProfileRecord[] | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.admin_profiles)
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function getAdminProfileById(
  supabase: any,
  id: string
): Promise<{ data: AdminProfileRecord | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.admin_profiles)
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
}

export async function countActiveOwners(
  supabase: any
): Promise<{ count: number; error: any }> {
  const { count, error } = await supabase
    .from(tables.admin_profiles)
    .select('*', { count: 'exact', head: true })
    .eq('role', 'owner')
    .eq('status', 'active');

  return { count: count || 0, error };
}
