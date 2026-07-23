'use server';

import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { updateLeadStatus } from '@vavaw/db';
import { trackEvent } from '@vavaw/analytics';
import { writeAuditLog } from '../../lib/audit-log';
import { revalidatePath } from 'next/cache';

export async function updateLeadStatusAction(leadId: string, newStatus: string, oldStatus: string) {
  try {
    const supabase = await getAdminServerSupabaseClient();
    const { error } = await updateLeadStatus(supabase, leadId, newStatus as any);

    if (error) {
      return { success: false, error: error.message || 'Failed to update lead status' };
    }

    trackEvent('lead_status_updated', {
      app: 'admin',
      source_app: 'admin',
      status: newStatus,
    });

    await writeAuditLog({
      action: 'lead_status_updated',
      entityType: 'lead',
      entityId: leadId,
      status: 'success',
      metadata: {
        status_before: oldStatus,
        status_after: newStatus
      }
    });

    revalidatePath('/leads');
    revalidatePath(`/leads/${leadId}`);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Server error updating lead status' };
  }
}
