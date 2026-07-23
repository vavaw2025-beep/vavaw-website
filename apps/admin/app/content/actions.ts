"use server";

import { revalidatePath } from 'next/cache';
import { canManageContentBlocks, canDeleteContentBlocks } from '@vavaw/auth';
import {
  createContentBlock,
  updateContentBlock,
  deleteContentBlock,
  CreateContentBlockInput,
  UpdateContentBlockInput,
} from '@vavaw/db';
import { getAdminDataSourceMode } from '../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../lib/admin-profile';
import { trackEvent } from '@vavaw/analytics';
import { triggerPublicRevalidation } from '../../lib/revalidate-public-apps';

function revalidateContent(siteKey: string, pagePath: string, reason: string) {
  let targetApp: 'main' | 'beauty' | 'franchise' | 'all' = 'all';
  let targetPaths = [pagePath];
  
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

export async function createContentBlockAction(input: CreateContentBlockInput) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'Content management requires Supabase mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    return { success: false, error: 'Unauthorized or disabled profile.' };
  }

  if (!canManageContentBlocks(profile.role)) {
    return { success: false, error: 'Insufficient permissions to create content blocks.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();
    const { data, error } = await createContentBlock(supabase, input);

    if (error) {
      return { success: false, error: error.message || 'Failed to create content block.' };
    }

    revalidatePath('/content');
    revalidateContent(input.site_key, input.page_path, 'content_created');

    trackEvent('content_block_created', {
      app: 'admin',
      entityType: 'content_block',
      entityId: data?.id,
      metadata: { role: profile.role },
    });
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unexpected server error.' };
  }
}

export async function updateContentBlockAction(id: string, input: UpdateContentBlockInput) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'Content management requires Supabase mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    return { success: false, error: 'Unauthorized or disabled profile.' };
  }

  if (!canManageContentBlocks(profile.role)) {
    return { success: false, error: 'Insufficient permissions to update content blocks.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();
    const { data, error } = await updateContentBlock(supabase, id, input);

    if (error) {
      return { success: false, error: error.message || 'Failed to update content block.' };
    }

    revalidatePath('/content');
    if (input.site_key && input.page_path) {
      revalidateContent(input.site_key, input.page_path, 'content_updated');
    }

    trackEvent('content_block_updated', {
      app: 'admin',
      entityType: 'content_block',
      entityId: id,
      metadata: { role: profile.role },
    });
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unexpected server error.' };
  }
}

export async function deleteContentBlockAction(id: string) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'Content management requires Supabase mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    return { success: false, error: 'Unauthorized or disabled profile.' };
  }

  if (!canDeleteContentBlocks(profile.role)) {
    return { success: false, error: 'Insufficient permissions to delete content blocks.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();
    const { success, error } = await deleteContentBlock(supabase, id);

    if (error || !success) {
      return { success: false, error: error?.message || 'Failed to delete content block.' };
    }

    revalidatePath('/content');
    triggerPublicRevalidation({
      app: 'all',
      paths: ['/', '/cosmetic'],
      reason: 'content_deleted'
    }).catch(console.error);

    trackEvent('content_block_deleted', {
      app: 'admin',
      entityType: 'content_block',
      entityId: id,
      metadata: { role: profile.role },
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unexpected server error.' };
  }
}
