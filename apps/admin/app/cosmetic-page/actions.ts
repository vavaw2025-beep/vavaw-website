"use server";

import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../lib/admin-profile';
import { canManageContent } from '@vavaw/auth';
import { revalidatePath } from 'next/cache';
import { triggerPublicRevalidation } from '../../lib/revalidate-public-apps';

export async function removeCosmeticMediaSlot(slot: string) {
  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    return { success: false, error: 'Chưa đăng nhập hoặc tài khoản bị khóa.' };
  }

  if (!canManageContent(profile.role)) {
    return { success: false, error: 'Không có quyền thực hiện hành động này.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();

    // Tìm asset hiện tại cho slot này
    const { data: assets, error: selectError } = await supabase
      .from('media_assets')
      .select('*')
      .eq('metadata->>purpose', 'cosmetic-page-media')
      .eq('metadata->>slot', slot)
      .order('created_at', { ascending: false });

    if (selectError) {
      return { success: false, error: selectError.message };
    }

    if (!assets || assets.length === 0) {
      return { success: false, error: 'Không tìm thấy ảnh nào trong slot này.' };
    }

    // Cập nhật tất cả các assets đang active trong slot này thành archived
    const isoDate = new Date().toISOString();
    for (const asset of assets) {
      const oldMetadata = asset.metadata || {};
      const newMetadata = {
        ...oldMetadata,
        archivedFromSlot: slot,
        archivedAt: isoDate,
        purpose: "archived-cosmetic-page-media",
        slot: null
      };

      const { error: updateError } = await supabase
        .from('media_assets')
        .update({ metadata: newMetadata })
        .eq('id', asset.id);

      if (updateError) {
        return { success: false, error: `Lỗi khi lưu metadata cho asset ${asset.id}: ${updateError.message}` };
      }
    }

    revalidatePath('/cosmetic-page');
    revalidatePath('/media');
    
    await triggerPublicRevalidation({
      app: 'main',
      paths: ['/cosmetic'],
      reason: 'cosmetic_media_removed'
    }).catch(console.error);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi server không xác định.' };
  }
}

export async function assignMediaAssetToSlot(mediaAssetId: string, slot: string) {
  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    return { success: false, error: 'Chưa đăng nhập hoặc tài khoản bị khóa.' };
  }

  if (!canManageContent(profile.role)) {
    return { success: false, error: 'Không có quyền thực hiện hành động này.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();

    // Validate media asset exists and is an image
    const { data: asset, error: selectError } = await supabase
      .from('media_assets')
      .select('*')
      .eq('id', mediaAssetId)
      .single();

    if (selectError || !asset) {
      return { success: false, error: selectError?.message || 'Không tìm thấy file phương tiện.' };
    }

    const isVideoSlot = slot.startsWith('cosmetic-video-');
    if (isVideoSlot) {
      if (asset.type !== 'video' && !asset.mime_type?.startsWith('video')) {
        return { success: false, error: 'Chỉ có thể chọn file video cho slot này.' };
      }
    } else {
      if (asset.type !== 'image' && !asset.mime_type?.startsWith('image')) {
        return { success: false, error: 'Chỉ có thể chọn file ảnh cho slot này.' };
      }
    }

    // 1. Archive current active asset for that slot
    const { data: currentAssets } = await supabase
      .from('media_assets')
      .select('*')
      .eq('metadata->>purpose', 'cosmetic-page-media')
      .eq('metadata->>slot', slot);

    const isoDate = new Date().toISOString();
    if (currentAssets && currentAssets.length > 0) {
      for (const cur of currentAssets) {
        const oldMetadata = cur.metadata || {};
        const newMetadata = {
          ...oldMetadata,
          archivedFromSlot: slot,
          archivedAt: isoDate,
          purpose: "archived-cosmetic-page-media",
          slot: null
        };
        await supabase
          .from('media_assets')
          .update({ metadata: newMetadata })
          .eq('id', cur.id);
      }
    }

    // 2. Update selected asset metadata
    const oldMetadata = asset.metadata || {};
    const newMetadata = {
      ...oldMetadata,
      purpose: "cosmetic-page-media",
      slot,
      assignedAt: isoDate
    };
    delete newMetadata.archivedFromSlot;
    delete newMetadata.archivedAt;

    const { error: updateError } = await supabase
      .from('media_assets')
      .update({ 
        metadata: newMetadata,
        updated_at: isoDate
      })
      .eq('id', mediaAssetId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath('/cosmetic-page');
    revalidatePath('/media');
    
    await triggerPublicRevalidation({
      app: 'main',
      paths: ['/cosmetic'],
      reason: 'cosmetic_media_assigned'
    }).catch(console.error);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi server không xác định.' };
  }
}
