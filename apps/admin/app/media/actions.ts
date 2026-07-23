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
    console.warn("[media] upload failed", { stage: 'missing_admin_profile', reason: 'Unauthorized or disabled profile' });
    return { success: false, error: 'Unauthorized or disabled profile.' };
  }

  if (!canManageContent(profile.role)) {
    console.warn("[media] upload failed", { stage: 'missing_admin_profile', reason: 'Insufficient permissions' });
    return { success: false, error: 'Insufficient permissions to upload media.' };
  }

  const file = formData.get('file') as File | null;
  const siteKey = (formData.get('site_key') as string) || 'main';
  const requestedType = (formData.get('type') as any) || 'image';
  const altText = (formData.get('alt_text') as string) || undefined;

  if (!file || file.size === 0) {
    console.warn("[media] upload failed", { stage: 'missing_file', reason: 'No file provided', siteKey, assetType: requestedType });
    return { success: false, error: 'Please select a valid file to upload.' };
  }

  const isImageMime = ALLOWED_IMAGE_MIME_TYPES.includes(file.type);
  const isVideoMime = ALLOWED_VIDEO_MIME_TYPES.includes(file.type);

  if (!isImageMime && !isVideoMime) {
    console.warn("[media] upload failed", { stage: 'invalid_mime_type', reason: 'Unsupported MIME', siteKey, assetType: requestedType, mimeType: file.type, fileSize: file.size });
    return { success: false, error: `File type is not allowed (${file.type}). Supported formats: JPG, PNG, WEBP, AVIF, MP4, WEBM, MOV.` };
  }

  if (requestedType === 'video' && !isVideoMime) {
    console.warn("[media] upload failed", { stage: 'invalid_file_type', reason: 'Expected video, got image', siteKey, assetType: requestedType, mimeType: file.type, fileSize: file.size });
    return { success: false, error: 'File type is not allowed. Expected a video file.' };
  }

  if (requestedType !== 'video' && !isImageMime) {
    console.warn("[media] upload failed", { stage: 'invalid_file_type', reason: 'Expected image, got video', siteKey, assetType: requestedType, mimeType: file.type, fileSize: file.size });
    return { success: false, error: 'File type is not allowed. Expected an image file.' };
  }

  const isVideo = isVideoMime;
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  const maxMb = isVideo ? 50 : 5;

  if (file.size > maxSize) {
    console.warn("[media] upload failed", { stage: 'file_too_large', reason: `Size exceeds ${maxMb}MB`, siteKey, assetType: requestedType, mimeType: file.type, fileSize: file.size });
    return { success: false, error: `File is too large. Size exceeds maximum limit of ${maxMb}MB.` };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();

    // Sanitize extension and generate safe path
    const originalExt = (file.name.split('.').pop() || '').toLowerCase();
    const safeExt = /^[a-z0-9]+$/.test(originalExt) ? originalExt : (isVideo ? 'mp4' : 'jpg');
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const folder = isVideo ? 'videos' : 'images';
    const storagePath = `media/${siteKey}/${folder}/${timestamp}-${random}.${safeExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('vavaw-media')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.warn("[media] upload failed", { stage: 'storage_upload_failed', reason: uploadError.message, siteKey, assetType: requestedType, mimeType: file.type, fileSize: file.size });
      if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('row-level security')) {
        return { success: false, error: 'Storage bucket is not configured or accessible.' };
      }
      return { success: false, error: 'Failed to upload file to Supabase Storage.' };
    }

    const { data: publicUrlData } = supabase.storage
      .from('vavaw-media')
      .getPublicUrl(storagePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      console.warn("[media] upload failed", { stage: 'public_url_failed', reason: 'Public URL returned empty', siteKey, assetType: requestedType, mimeType: file.type, fileSize: file.size });
      return { success: false, error: 'Failed to create public media URL.' };
    }

    const publicUrl = publicUrlData.publicUrl;

    const { error: dbError } = await createMediaAsset(supabase, {
      site_key: siteKey,
      type: requestedType,
      url: publicUrl,
      alt_text: altText,
      storage_provider: 'supabase',
      mime_type: file.type,
      size_bytes: file.size,
      metadata: { bucket: 'vavaw-media', path: storagePath },
    });

    if (dbError) {
      console.warn("[media] upload failed", { stage: 'media_asset_insert_failed', reason: dbError.message, siteKey, assetType: requestedType, mimeType: file.type, fileSize: file.size });
      return { success: false, error: 'Failed to save media asset to database.' };
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
      metadata: { role: profile.role, siteKey, type: requestedType, mimeType: file.type },
    });
    await writeAuditLog({
      action: isVideo ? 'media_video_uploaded' : 'media_uploaded',
      entityType: 'media',
      status: 'success',
      metadata: { media_type: isVideo ? 'video' : 'image', content_type: file.type }
    });
    return { success: true };
  } catch (err: any) {
    console.warn("[media] upload failed", { stage: 'unknown_error', reason: err.message, siteKey, assetType: requestedType, mimeType: file.type, fileSize: file.size });
    captureError(err, { app: 'admin', severity: 'error' });
    trackEvent(isVideo ? 'media_video_upload_failed' : 'media_upload_failed' as any, { app: 'admin' });
    await writeAuditLog({
      action: isVideo ? 'media_video_upload_failed' : 'media_upload_failed',
      entityType: 'media',
      status: 'failure',
      metadata: { media_type: isVideo ? 'video' : 'image', reason_code: 'exception' }
    });
    return { success: false, error: 'Failed to upload file due to an unexpected server error.' };
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


