"use server";

import { revalidatePath } from 'next/cache';
import { canManageContent, canManageSettings } from '@vavaw/auth';
import { createMediaAsset, deleteMediaAsset } from '@vavaw/db';
import { getAdminDataSourceMode } from '../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../lib/admin-profile';
import { trackEvent } from '@vavaw/analytics';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function uploadMediaAction(formData: FormData) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'Media uploads are disabled in mock mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    return { success: false, error: 'Unauthorized or disabled profile.' };
  }

  if (!canManageContent(profile.role)) {
    return { success: false, error: 'Insufficient permissions to upload media.' };
  }

  const file = formData.get('file') as File | null;
  if (!file || file.size === 0) {
    return { success: false, error: 'Please select a valid image file to upload.' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      success: false,
      error: `Invalid file type (${file.type}). Only JPG, PNG, WEBP, and AVIF are supported.`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File size exceeds maximum limit of 5MB (${(file.size / (1024 * 1024)).toFixed(2)}MB).`,
    };
  }

  const siteKey = (formData.get('site_key') as string) || 'main';
  const type = (formData.get('type') as any) || 'image';
  const folder = (formData.get('folder') as string) || 'main/hero';
  const altText = (formData.get('alt_text') as string) || undefined;

  try {
    const supabase = await getAdminServerSupabaseClient();

    const ext = file.name.split('.').pop() || 'jpg';
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomId = crypto.randomUUID().slice(0, 8);
    const storagePath = `${folder}/${dateStr}-${randomId}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('vavaw-media')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message || 'Failed to upload image to Supabase Storage.' };
    }

    const { data: publicUrlData } = supabase.storage
      .from('vavaw-media')
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;

    const { data: record, error: dbError } = await createMediaAsset(supabase, {
      site_key: siteKey,
      type: type,
      url: publicUrl,
      alt_text: altText,
      storage_provider: 'supabase',
    });

    if (dbError) {
      return { success: false, error: dbError.message || 'Uploaded image to storage, but failed to register in media_assets database.' };
    }

    revalidatePath('/media');
    trackEvent('media_uploaded', {
      app: 'admin',
      entityType: 'media_asset',
      entityId: record?.id,
      metadata: { role: profile.role, siteKey, type },
    });
    return { success: true, data: record };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unexpected server error during upload.' };
  }
}

export async function deleteMediaAssetAction(id: string) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'Media deletion is disabled in mock mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    return { success: false, error: 'Unauthorized or disabled profile.' };
  }

  if (!canManageSettings(profile.role)) {
    return { success: false, error: 'Only owners and admins can delete media assets.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();
    const { success, error } = await deleteMediaAsset(supabase, id);

    if (error || !success) {
      return { success: false, error: error?.message || 'Failed to delete media asset record.' };
    }

    revalidatePath('/media');
    trackEvent('media_deleted', {
      app: 'admin',
      entityType: 'media_asset',
      entityId: id,
      metadata: { role: profile.role },
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unexpected server error during deletion.' };
  }
}
