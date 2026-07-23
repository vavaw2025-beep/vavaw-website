'use server';

import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { updateLeadStatus } from '@vavaw/db';
import { trackEvent } from '@vavaw/analytics';
import { writeAuditLog } from '../../lib/audit-log';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getCurrentAdminProfile } from '../../lib/admin-profile';

export async function updateLeadStatusAction(formData: FormData) {
  const leadId = formData.get('leadId') as string;
  const status = formData.get('status') as string;

  if (!leadId || !status) {
    return { success: false, error: 'Missing required fields' };
  }

  // Validate UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(leadId)) {
    return { success: false, error: 'Invalid lead ID format' };
  }

  // Validate status
  const validStatuses = ['new', 'contacted', 'qualified', 'closed', 'spam'];
  if (!validStatuses.includes(status)) {
    return { success: false, error: 'Invalid status' };
  }

  try {
    const profile = await getCurrentAdminProfile();
    
    if (!profile || profile.role === 'viewer') {
      return { success: false, error: 'Unauthorized to update lead status' };
    }

    const supabase = await getAdminServerSupabaseClient();
    
    // Fetch the current lead to get the old status
    const { data: currentLead, error: fetchError } = await supabase
      .from('leads')
      .select('status, source_app, lead_type')
      .eq('id', leadId)
      .single();

    if (fetchError || !currentLead) {
      return { success: false, error: 'Lead not found or inaccessible' };
    }

    const oldStatus = currentLead.status;

    const { error } = await updateLeadStatus(supabase, leadId, status as any);

    if (error) {
      console.warn("[leads] status update failed", {
        reason: error.message,
        leadId,
        status
      });
      return { success: false, error: 'Failed to update lead status' };
    }

    trackEvent('lead_status_updated', {
      app: 'admin',
      source_app: 'admin',
      status: status,
    });

    await writeAuditLog({
      action: 'lead_status_updated',
      entityType: 'lead',
      entityId: leadId,
      status: 'success',
      metadata: {
        status_before: oldStatus,
        status_after: status,
        source_app: currentLead.source_app,
        lead_type: currentLead.lead_type
      }
    });

    revalidatePath('/leads');
    revalidatePath(`/leads/${leadId}`);

  } catch (err: any) {
    console.warn("[leads] status update failed", {
      reason: err?.message || String(err),
      leadId,
      status
    });
    return { success: false, error: 'Server error updating lead status' };
  }

  // Redirect after success (can't do it inside try/catch block if it catches NextJS redirect error)
  redirect(`/leads/${leadId}`);
}
