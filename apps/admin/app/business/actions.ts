"use server";

import { revalidatePath } from 'next/cache';
import { canManageBusiness, canDeleteBusiness } from '@vavaw/auth';
import {
  createBusinessEntry,
  updateBusinessEntry,
  deleteBusinessEntry,
  CreateBusinessEntryInput,
  UpdateBusinessEntryInput,
} from '@vavaw/db';
import { getAdminDataSourceMode } from '../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../lib/admin-profile';
import { trackEvent } from '@vavaw/analytics';

export async function createBusinessEntryAction(input: CreateBusinessEntryInput) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'CRUD operations are disabled in mock mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    return { success: false, error: 'Unauthorized or disabled profile.' };
  }

  if (!canManageBusiness(profile.role)) {
    return { success: false, error: 'Insufficient permissions to create business entries.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();
    const { data, error } = await createBusinessEntry(supabase, input);

    if (error) {
      return { success: false, error: error.message || 'Failed to create business entry.' };
    }

    revalidatePath('/business');
    trackEvent('business_created', {
      app: 'admin',
      entityType: 'business',
      entityId: data?.id,
      metadata: { role: profile.role },
    });
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unexpected server error.' };
  }
}

export async function updateBusinessEntryAction(id: string, input: UpdateBusinessEntryInput) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'CRUD operations are disabled in mock mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    return { success: false, error: 'Unauthorized or disabled profile.' };
  }

  if (!canManageBusiness(profile.role)) {
    return { success: false, error: 'Insufficient permissions to update business entries.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();
    const { data, error } = await updateBusinessEntry(supabase, id, input);

    if (error) {
      return { success: false, error: error.message || 'Failed to update business entry.' };
    }

    revalidatePath('/business');
    trackEvent('business_updated', {
      app: 'admin',
      entityType: 'business',
      entityId: id,
      metadata: { role: profile.role },
    });
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unexpected server error.' };
  }
}

export async function deleteBusinessEntryAction(id: string) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'CRUD operations are disabled in mock mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    return { success: false, error: 'Unauthorized or disabled profile.' };
  }

  if (!canDeleteBusiness(profile.role)) {
    return { success: false, error: 'Insufficient permissions to delete business entries.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();
    const { success, error } = await deleteBusinessEntry(supabase, id);

    if (error || !success) {
      return { success: false, error: error?.message || 'Failed to delete business entry.' };
    }

    revalidatePath('/business');
    trackEvent('business_deleted', {
      app: 'admin',
      entityType: 'business',
      entityId: id,
      metadata: { role: profile.role },
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unexpected server error.' };
  }
}
