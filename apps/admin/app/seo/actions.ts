"use server";

import { revalidatePath } from 'next/cache';
import { canManageSeo, canDeleteSeo } from '@vavaw/auth';
import {
  createSeoSetting,
  updateSeoSetting,
  deleteSeoSetting,
  CreateSeoSettingInput,
  UpdateSeoSettingInput,
} from '@vavaw/db';
import { getAdminDataSourceMode } from '../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../lib/admin-profile';

export async function createSeoSettingAction(input: CreateSeoSettingInput) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'SEO management requires Supabase mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    return { success: false, error: 'Unauthorized or disabled profile.' };
  }

  if (!canManageSeo(profile.role)) {
    return { success: false, error: 'Insufficient permissions to create SEO settings.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();
    const { data, error } = await createSeoSetting(supabase, input);

    if (error) {
      return { success: false, error: error.message || 'Failed to create SEO setting.' };
    }

    revalidatePath('/seo');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unexpected server error.' };
  }
}

export async function updateSeoSettingAction(id: string, input: UpdateSeoSettingInput) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'SEO management requires Supabase mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    return { success: false, error: 'Unauthorized or disabled profile.' };
  }

  if (!canManageSeo(profile.role)) {
    return { success: false, error: 'Insufficient permissions to update SEO settings.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();
    const { data, error } = await updateSeoSetting(supabase, id, input);

    if (error) {
      return { success: false, error: error.message || 'Failed to update SEO setting.' };
    }

    revalidatePath('/seo');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unexpected server error.' };
  }
}

export async function deleteSeoSettingAction(id: string) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'SEO management requires Supabase mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    return { success: false, error: 'Unauthorized or disabled profile.' };
  }

  if (!canDeleteSeo(profile.role)) {
    return { success: false, error: 'Insufficient permissions to delete SEO settings.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();
    const { success, error } = await deleteSeoSetting(supabase, id);

    if (error || !success) {
      return { success: false, error: error?.message || 'Failed to delete SEO setting.' };
    }

    revalidatePath('/seo');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unexpected server error.' };
  }
}
