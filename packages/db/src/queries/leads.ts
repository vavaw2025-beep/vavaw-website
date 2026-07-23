import { tables } from '../schema';
import { LeadRecord } from '../types';

export async function getLeads(
  supabase: any,
  options?: {
    status?: LeadRecord['status'];
    source_app?: LeadRecord['source_app'];
    lead_type?: LeadRecord['lead_type'];
    date_from?: string; // ISO 8601
    date_to?: string;   // ISO 8601
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
  if (options?.lead_type) {
    query = query.eq('lead_type', options.lead_type);
  }
  if (options?.date_from) {
    query = query.gte('created_at', options.date_from);
  }
  if (options?.date_to) {
    query = query.lte('created_at', options.date_to);
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
