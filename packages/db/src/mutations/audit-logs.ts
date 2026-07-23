import { SupabaseClient } from '@supabase/supabase-js';
import { AuditLogRecord, AuditStatus } from '../types/audit-log';

export interface CreateAuditLogInput {
  actor_id?: string | null;
  actor_role?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  status?: AuditStatus;
  metadata?: Record<string, any>;
  ip_address?: string | null;
  user_agent?: string | null;
}

export async function createAuditLog(
  supabase: SupabaseClient,
  input: CreateAuditLogInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      actor_id: input.actor_id || null,
      actor_role: input.actor_role || null,
      action: input.action,
      entity_type: input.entity_type,
      entity_id: input.entity_id || null,
      status: input.status || 'success',
      metadata: input.metadata || {},
      ip_address: input.ip_address || null,
      user_agent: input.user_agent || null,
    };

    const { error } = await supabase.from('audit_logs').insert([payload]);

    if (error) {
      console.error('[DB createAuditLog Error]', error);
      return { success: false, error: 'Failed to record audit log' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[DB createAuditLog Exception]', err);
    return { success: false, error: 'Exception recording audit log' };
  }
}
