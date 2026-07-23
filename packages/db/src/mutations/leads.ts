import { tables } from '../schema';
import { LeadRecord } from '../types';

export type CreateLeadInput = Omit<LeadRecord, 'id' | 'created_at' | 'updated_at' | 'status'> & {
  status?: LeadRecord['status'];
};

export async function createLead(
  supabase: any,
  input: CreateLeadInput
): Promise<{ data: LeadRecord | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.leads)
    .insert([input])
    .select()
    .single();

  return { data, error };
}

export async function createPublicLead(
  supabase: any,
  input: CreateLeadInput
): Promise<{ success: boolean; error: any }> {
  const { error } = await supabase
    .from(tables.leads)
    .insert([input]);

  return { success: !error, error };
}

export async function updateLeadStatus(
  supabase: any,
  id: string,
  status: LeadRecord['status']
): Promise<{ data: LeadRecord | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.leads)
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}
