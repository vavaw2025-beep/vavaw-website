"use server";
import { captureError } from '@vavaw/monitoring';

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
import { trackEvent } from '@vavaw/analytics';
import { triggerPublicRevalidation } from '../../lib/revalidate-public-apps';

function revalidateSeo(siteKey: string, path: string, reason: string) {
  let targetApp: 'main' | 'beauty' | 'franchise' | 'all' = 'all';
  let targetPaths = [path];
  
  if (siteKey === 'main') {
    targetApp = 'main';
  } else if (siteKey === 'cosmetic') {
    targetApp = 'main';
    targetPaths = ['/cosmetic'];
  } else if (siteKey === 'beauty') {
    targetApp = 'beauty';
    targetPaths = ['/'];
  } else if (siteKey === 'franchise') {
    targetApp = 'franchise';
    targetPaths = ['/'];
  }

  triggerPublicRevalidation({
    app: targetApp,
    paths: targetPaths,
    reason,
  }).catch(console.error);
}

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
    revalidateSeo(input.site_key, input.path, 'seo_created');

    trackEvent('seo_created', {
      app: 'admin',
      entityType: 'seo_setting',
      entityId: data?.id,
      metadata: { role: profile.role },
    });
    return { success: true, data };
  } catch (err: any) {
    captureError(err, { app: 'admin', severity: 'error' });
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
    if (input.site_key && input.path) {
      revalidateSeo(input.site_key, input.path, 'seo_updated');
    }

    trackEvent('seo_updated', {
      app: 'admin',
      entityType: 'seo_setting',
      entityId: id,
      metadata: { role: profile.role },
    });
    return { success: true, data };
  } catch (err: any) {
    captureError(err, { app: 'admin', severity: 'error' });
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
    // On delete, we don't easily know the site_key and path without fetching first.
    // We can fallback to revalidating all known apps/paths for safety.
    triggerPublicRevalidation({
      app: 'all',
      paths: ['/', '/cosmetic'],
      reason: 'seo_deleted'
    }).catch(console.error);

    trackEvent('seo_deleted', {
      app: 'admin',
      entityType: 'seo_setting',
      entityId: id,
      metadata: { role: profile.role },
    });
    return { success: true };
  } catch (err: any) {
    captureError(err, { app: 'admin', severity: 'error' });
    return { success: false, error: err?.message || 'Unexpected server error.' };
  }
}


