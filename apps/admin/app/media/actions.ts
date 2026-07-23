"use server";
import { captureError } from '@vavaw/monitoring';

import { revalidatePath } from 'next/cache';
import { canManageContent, canManageSettings } from '@vavaw/auth';
import { createMediaAsset, deleteMediaAsset } from '@vavaw/db';
import { getAdminDataSourceMode } from '../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../lib/admin-profile';
import { trackEvent } from '@vavaw/analytics';
import { triggerPublicRevalidation } from '../../lib/revalidate-public-apps';
import { writeAuditLog } from '../../lib/audit-log';

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const ALLOWED_VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

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
    return { success: false, error: 'Please select a valid file to upload.' };
  }

  const siteKey = (formData.get('site_key') as string) || 'main';
  const requestedType = (formData.get('type') as any) || 'image';
  const altText = (formData.get('alt_text') as string) || undefined;

  let isVideo = false;
  if (ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
    if (file.size > MAX_IMAGE_SIZE) {
      return { success: false, error: `Image file size exceeds maximum limit of 5MB.` };
    }
  } else if (ALLOWED_VIDEO_MIME_TYPES.includes(file.type)) {
    isVideo = true;
    if (file.size > MAX_VIDEO_SIZE) {
      return { success: false, error: `Video file size exceeds maximum limit of 50MB.` };
    }
  } else {
    return {
      success: false,
      error: `Invalid file type (${file.type}). Supported formats: JPG, PNG, WEBP, AVIF, MP4, WEBM, MOV.`,
    };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();

    const ext = file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg');
    const randomId = crypto.randomUUID();
    const folder = isVideo ? 'videos' : 'images';
    const storagePath = `${siteKey}/${folder}/${randomId}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('vavaw-media')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: 'Failed to upload file to Supabase Storage.' };
    }

    const { data: publicUrlData } = supabase.storage
      .from('vavaw-media')
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;

    const { data: record, error: dbError } = await createMediaAsset(supabase, {
      site_key: siteKey,
      type: requestedType,
      url: publicUrl,
      alt_text: altText,
      storage_provider: 'supabase',
      mime_type: file.type,
      size_bytes: file.size,
      metadata: {},
    });

    if (dbError) {
      return { success: false, error: dbError.message || 'Uploaded image to storage, but failed to register in media_assets database.' };
    }

    revalidatePath('/media');
    
    let targetApp: 'main' | 'beauty' | 'franchise' | 'all' = 'all';
    let targetPaths = ['/'];
    if (siteKey === 'main') {
      targetApp = 'main';
    } else if (siteKey === 'cosmetic') {
      targetApp = 'main';
      targetPaths = ['/cosmetic'];
    } else if (siteKey === 'beauty') {
      targetApp = 'beauty';
    } else if (siteKey === 'franchise') {
      targetApp = 'franchise';
    }
    
    triggerPublicRevalidation({
      app: targetApp,
      paths: targetPaths,
      reason: 'media_uploaded'
    }).catch(console.error);

    trackEvent(isVideo ? 'media_video_uploaded' : 'media_uploaded', {
      app: 'admin',
      entityType: 'media_asset',
      entityId: record?.id,
      metadata: { role: profile.role, siteKey, type: requestedType, mimeType: file.type },
    });
    await writeAuditLog({
      action: isVideo ? 'media_video_uploaded' : 'media_uploaded',
      entityType: 'media',
      entityId: record?.id,
      status: 'success',
      metadata: { media_type: isVideo ? 'video' : 'image', content_type: file.type }
    });
    return { success: true, data: record };
  } catch (err: any) {
    captureError(err, { app: 'admin', severity: 'error' });
    trackEvent(isVideo ? 'media_video_upload_failed' : 'media_upload_failed' as any, { app: 'admin' });
    await writeAuditLog({
      action: isVideo ? 'media_video_upload_failed' : 'media_upload_failed',
      entityType: 'media',
      status: 'failure',
      metadata: { media_type: isVideo ? 'video' : 'image', reason_code: 'exception' }
    });
    return { success: false, error: 'Unexpected server error during upload.' };
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
    
    // Fetch the asset first to determine its type for analytics
    const { data: asset } = await supabase.from('media_assets').select('type, mime_type').eq('id', id).single();
    const isVideo = asset?.type === 'video' || asset?.mime_type?.startsWith('video');

    const { success, error } = await deleteMediaAsset(supabase, id);

    if (error || !success) {
      return { success: false, error: error?.message || 'Failed to delete media asset record.' };
    }

    revalidatePath('/media');
    triggerPublicRevalidation({
      app: 'all',
      paths: ['/'],
      reason: 'media_deleted'
    }).catch(console.error);

    trackEvent(isVideo ? 'media_video_deleted' : 'media_deleted', {
      app: 'admin',
      entityType: 'media_asset',
      entityId: id,
      metadata: { role: profile.role },
    });
    await writeAuditLog({
      action: isVideo ? 'media_video_deleted' : 'media_deleted',
      entityType: 'media',
      entityId: id,
      status: 'success',
      metadata: { media_type: isVideo ? 'video' : 'image' }
    });
    return { success: true };
  } catch (err: any) {
    captureError(err, { app: 'admin', severity: 'error' });
    return { success: false, error: err?.message || 'Unexpected server error during deletion.' };
  }
}


