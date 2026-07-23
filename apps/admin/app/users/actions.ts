"use server";
import { captureError } from '@vavaw/monitoring';

import { revalidatePath } from 'next/cache';
import { trackEvent } from '@vavaw/analytics';
import { writeAuditLog } from '../../lib/audit-log';
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
    await writeAuditLog({
      action: 'admin_user_created',
      entityType: 'user',
      entityId: data?.id,
      status: 'success',
      metadata: { role: input.role }
    });
    return { success: true, data };
  } catch (err: any) {
    captureError(err, { app: 'admin', severity: 'error' });
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
    await writeAuditLog({
      action: 'admin_user_updated',
      entityType: 'user',
      entityId: id,
      status: 'success',
      metadata: { role: data?.role, status_after: data?.status }
    });
    return { success: true, data };
  } catch (err: any) {
    captureError(err, { app: 'admin', severity: 'error' });
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
    await writeAuditLog({
      action: 'admin_user_disabled',
      entityType: 'user',
      entityId: id,
      status: 'success',
      metadata: { role: targetProfile?.role }
    });
    return { success: true };
  } catch (err: any) {
    captureError(err, { app: 'admin', severity: 'error' });
    return { success: false, error: err?.message || 'Unexpected server error.' };
  }
}

export async function inviteAdminUserAction(input: {
  email: string;
  display_name: string;
  role: string;
  confirm_owner_invite?: boolean;
}) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'User management requires Supabase mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active' || profile.role !== 'owner') {
    return { success: false, error: 'Insufficient permissions. Active owner role required.' };
  }

  if (!input.email || !input.email.includes('@')) {
    return { success: false, error: 'Invalid email address.' };
  }

  if (!input.display_name || input.display_name.trim().length === 0 || input.display_name.length > 120) {
    return { success: false, error: 'Display name is required (max 120 chars).' };
  }

  const allowedRoles = ['owner', 'admin', 'editor', 'viewer'];
  if (!allowedRoles.includes(input.role)) {
    return { success: false, error: 'Unknown role.' };
  }

  if (input.role === 'owner' && !input.confirm_owner_invite) {
    return { success: false, error: 'Explicit confirmation is required to invite an owner.' };
  }

  try {
    const { createAdminClient } = await import('../../lib/supabase-admin');
    const supabaseAdmin = createAdminClient();
    
    if (!supabaseAdmin) {
      return { success: false, error: 'Automated invites are not configured. Missing Service Role Key.' };
    }

    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3002';
    
    // 1. Send invite
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(input.email.trim(), {
      data: {
        display_name: input.display_name.trim(),
        invited_role: input.role,
      },
      redirectTo: `${adminUrl}/login?invited=true`,
    });

    if (inviteError) {
      if (inviteError.message.includes('already exists')) {
        return { success: false, error: 'A user with this email already exists. Please use Manual UID Entry to connect them.' };
      }
      throw inviteError;
    }

    if (!inviteData.user?.id) {
      throw new Error('No user ID returned from invite.');
    }

    const invitedUserId = inviteData.user.id;

    // 2. Create profile using standard client
    const supabase = await getAdminServerSupabaseClient();
    const { error: profileError } = await createAdminProfile(supabase, {
      id: invitedUserId,
      email: input.email.trim(),
      full_name: input.display_name.trim(),
      role: input.role as any,
      status: 'active',
    });

    if (profileError) {
      // Invite succeeded, but profile creation failed
      captureError(profileError, { app: 'admin', feature: 'admin_user_invite', severity: 'error', metadata: { role: input.role, status: 'active' } });
      await writeAuditLog({
        action: 'admin_user_invite_failed',
        entityType: 'user',
        entityId: invitedUserId,
        status: 'failure',
        metadata: { role: input.role, reason_code: 'profile_creation_failed' }
      });
      return { 
        success: false, 
        error: 'Invite was sent, but profile creation failed. Please reconcile manually using Manual UID Entry.' 
      };
    }

    revalidatePath('/users');
    trackEvent('admin_user_invited', {
      app: 'admin',
      entityType: 'admin_profile',
      entityId: invitedUserId,
      metadata: { role: input.role, status: 'active' },
    });
    await writeAuditLog({
      action: 'admin_user_invited',
      entityType: 'user',
      entityId: invitedUserId,
      status: 'success',
      metadata: { role: input.role }
    });

    return { success: true, data: { id: invitedUserId } };
  } catch (err: any) {
    captureError(err, { app: 'admin', feature: 'admin_user_invite', severity: 'error', metadata: { role: input.role, status: 'active' } });
    trackEvent('admin_user_invite_failed', {
      app: 'admin',
      metadata: { role: input.role, status: 'active' },
    });
    await writeAuditLog({
      action: 'admin_user_invite_failed',
      entityType: 'user',
      status: 'failure',
      metadata: { role: input.role, reason_code: 'exception' }
    });
    return { success: false, error: 'Failed to send invite. Please try again or use manual fallback.' };
  }
}
