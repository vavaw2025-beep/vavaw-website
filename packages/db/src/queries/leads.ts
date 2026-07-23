import { tables } from '../schema';
import { LeadRecord } from '../types';

export async function getLeads(
  supabase: any,
  options?: {
    status?: LeadRecord['status'];
    source_app?: LeadRecord['source_app'];
    limit?: number;
  }
): Promise<{ data: LeadRecord[] | null; error: any }> {
  let query = supabase
    .from(tables.leads)
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }
  if (options?.source_app) {
    query = query.eq('source_app', options.source_app);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  return { data, error };
}

export async function getLeadById(
  supabase: any,
  id: string
): Promise<{ data: LeadRecord | null; error: any }> {
  const { data, error } = await supabase
    .from(tables.leads)
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
}
