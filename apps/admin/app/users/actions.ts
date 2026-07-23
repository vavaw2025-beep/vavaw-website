"use server";

import { revalidatePath } from 'next/cache';
import { trackEvent } from '@vavaw/analytics';
import {
  createAdminProfile,
  updateAdminProfile,
  disableAdminProfile,
  getAdminProfileById,
  countActiveOwners,
  CreateAdminProfileInput,
  UpdateAdminProfileInput,
} from '@vavaw/db';
import { getAdminDataSourceMode } from '../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../lib/admin-profile';

// Validate UUID format
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function createAdminProfileAction(input: CreateAdminProfileInput) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'User management requires Supabase mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active' || profile.role !== 'owner') {
    return { success: false, error: 'Insufficient permissions. Owner role required.' };
  }

  if (!input.id || !UUID_REGEX.test(input.id)) {
    return { success: false, error: 'Invalid Supabase Auth UID provided.' };
  }
  
  if (!input.email || !input.email.includes('@')) {
    return { success: false, error: 'Invalid email address.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();
    const { data, error } = await createAdminProfile(supabase, {
      ...input,
      status: input.status || 'active',
    });

    if (error) {
      return { success: false, error: error.message || 'Failed to create admin profile.' };
    }

    revalidatePath('/users');
    trackEvent('admin_user_created', {
      app: 'admin',
      entityType: 'admin_profile',
      entityId: data?.id,
      metadata: { role: input.role, status: input.status || 'active' },
    });
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unexpected server error.' };
  }
}

export async function updateAdminProfileAction(id: string, input: UpdateAdminProfileInput) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'User management requires Supabase mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active' || profile.role !== 'owner') {
    return { success: false, error: 'Insufficient permissions. Owner role required.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();
    
    // Self-mutation protections
    if (id === profile.id) {
      if (input.status === 'disabled') {
        return { success: false, error: 'You cannot disable your own profile.' };
      }
      if (input.role && input.role !== 'owner') {
        return { success: false, error: 'You cannot downgrade your own role from owner.' };
      }
    }

    // Last active owner protections
    const { data: targetProfile } = await getAdminProfileById(supabase, id);
    if (targetProfile && targetProfile.role === 'owner' && targetProfile.status === 'active') {
      if (input.status === 'disabled' || (input.role && input.role !== 'owner')) {
        const { count } = await countActiveOwners(supabase);
        if (count <= 1) {
          return { success: false, error: 'Cannot downgrade or disable the last active owner.' };
        }
      }
    }

    const { data, error } = await updateAdminProfile(supabase, id, input);

    if (error) {
      return { success: false, error: error.message || 'Failed to update admin profile.' };
    }

    revalidatePath('/users');
    trackEvent('admin_user_updated', {
      app: 'admin',
      entityType: 'admin_profile',
      entityId: id,
      metadata: { role: data?.role || 'unknown', status: data?.status || 'unknown' },
    });
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unexpected server error.' };
  }
}

export async function disableAdminProfileAction(id: string) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'User management requires Supabase mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active' || profile.role !== 'owner') {
    return { success: false, error: 'Insufficient permissions. Owner role required.' };
  }

  if (id === profile.id) {
    return { success: false, error: 'You cannot disable your own profile.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();

    // Last active owner protection
    const { data: targetProfile } = await getAdminProfileById(supabase, id);
    if (targetProfile && targetProfile.role === 'owner' && targetProfile.status === 'active') {
      const { count } = await countActiveOwners(supabase);
      if (count <= 1) {
        return { success: false, error: 'Cannot disable the last active owner.' };
      }
    }

    const { success, error } = await disableAdminProfile(supabase, id);

    if (error || !success) {
      return { success: false, error: error?.message || 'Failed to disable admin profile.' };
    }

    revalidatePath('/users');
    trackEvent('admin_user_disabled', {
      app: 'admin',
      entityType: 'admin_profile',
      entityId: id,
      metadata: { role: targetProfile?.role || 'unknown' },
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unexpected server error.' };
  }
}
