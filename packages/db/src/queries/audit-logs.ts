import { SupabaseClient } from '@supabase/supabase-js';
import { AuditLogFilters, AuditLogRecord } from '../types/audit-log';

export async function getAuditLogs(
  supabase: SupabaseClient,
  filters: AuditLogFilters = {}
): Promise<{ data: AuditLogRecord[]; count: number; error?: any }> {
  try {
    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' });

    if (filters.action) {
      query = query.eq('action', filters.action);
    }

    if (filters.entity_type) {
      query = query.eq('entity_type', filters.entity_type);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    const limit = filters.limit ?? 100;
    const offset = filters.offset ?? 0;

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('[DB AuditLog Query Error]', error);
      return { data: [], count: 0, error };
    }

    const formattedData: AuditLogRecord[] = (data || []).map((row: any) => ({
      id: row.id,
      actor_id: row.actor_id,
      actor_role: row.actor_role,
      action: row.action,
      entity_type: row.entity_type,
      entity_id: row.entity_id,
      status: row.status,
      metadata: row.metadata || {},
      ip_address: row.ip_address,
      user_agent: row.user_agent,
      created_at: row.created_at,
      actor_email: null,
    }));

    return { data: formattedData, count: count ?? formattedData.length };
  } catch (err) {
    console.error('[DB AuditLog Query Exception]', err);
    return { data: [], count: 0, error: err };
  }
}

export async function getAuditLogById(
  supabase: SupabaseClient,
  id: string
): Promise<AuditLogRecord | null> {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      actor_id: data.actor_id,
      actor_role: data.actor_role,
      action: data.action,
      entity_type: data.entity_type,
      entity_id: data.entity_id,
      status: data.status,
      metadata: data.metadata || {},
      ip_address: data.ip_address,
      user_agent: data.user_agent,
      created_at: data.created_at,
      actor_email: null,
    };
  } catch (err) {
    console.error('[DB AuditLogById Exception]', err);
    return null;
  }
}
