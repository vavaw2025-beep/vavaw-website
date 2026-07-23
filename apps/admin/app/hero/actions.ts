"use server";
import { captureError } from '@vavaw/monitoring';

import { revalidatePath } from 'next/cache';
import { canManageHero, canDeleteHero } from '@vavaw/auth';
import {
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  CreateHeroSlideInput,
  UpdateHeroSlideInput,
} from '@vavaw/db';
import { getAdminDataSourceMode } from '../../lib/data-source';
import { getAdminServerSupabaseClient } from '../../lib/supabase-server';
import { getCurrentAdminProfile } from '../../lib/admin-profile';
import { trackEvent } from '@vavaw/analytics';
import { triggerPublicRevalidation } from '../../lib/revalidate-public-apps';

export async function createHeroSlideAction(input: CreateHeroSlideInput) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'CRUD operations are disabled in mock mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    return { success: false, error: 'Unauthorized or disabled profile.' };
  }

  if (!canManageHero(profile.role)) {
    return { success: false, error: 'Insufficient permissions to create hero slides.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();
    const { data, error } = await createHeroSlide(supabase, input);

    if (error) {
      return { success: false, error: error.message || 'Failed to create hero slide.' };
    }

    revalidatePath('/hero');
    triggerPublicRevalidation({
      app: 'main',
      paths: ['/'],
      reason: 'hero_created'
    }).catch(console.error);

    trackEvent('hero_created', {
      app: 'admin',
      entityType: 'hero_slide',
      entityId: data?.id,
      metadata: { role: profile.role },
    });
    return { success: true, data };
  } catch (err: any) {
    captureError(err, { app: 'admin', severity: 'error' });
    return { success: false, error: err?.message || 'Unexpected server error.' };
  }
}

export async function updateHeroSlideAction(id: string, input: UpdateHeroSlideInput) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'CRUD operations are disabled in mock mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    return { success: false, error: 'Unauthorized or disabled profile.' };
  }

  if (!canManageHero(profile.role)) {
    return { success: false, error: 'Insufficient permissions to update hero slides.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();
    const { data, error } = await updateHeroSlide(supabase, id, input);

    if (error) {
      return { success: false, error: error.message || 'Failed to update hero slide.' };
    }

    revalidatePath('/hero');
    triggerPublicRevalidation({
      app: 'main',
      paths: ['/'],
      reason: 'hero_updated'
    }).catch(console.error);

    trackEvent('hero_updated', {
      app: 'admin',
      entityType: 'hero_slide',
      entityId: id,
      metadata: { role: profile.role },
    });
    return { success: true, data };
  } catch (err: any) {
    captureError(err, { app: 'admin', severity: 'error' });
    return { success: false, error: err?.message || 'Unexpected server error.' };
  }
}

export async function deleteHeroSlideAction(id: string) {
  const mode = getAdminDataSourceMode();
  if (mode !== 'supabase') {
    return { success: false, error: 'CRUD operations are disabled in mock mode.' };
  }

  const profile = await getCurrentAdminProfile();
  if (!profile || profile.status !== 'active') {
    return { success: false, error: 'Unauthorized or disabled profile.' };
  }

  if (!canDeleteHero(profile.role)) {
    return { success: false, error: 'Insufficient permissions to delete hero slides.' };
  }

  try {
    const supabase = await getAdminServerSupabaseClient();
    const { success, error } = await deleteHeroSlide(supabase, id);

    if (error || !success) {
      return { success: false, error: error?.message || 'Failed to delete hero slide.' };
    }

    revalidatePath('/hero');
    triggerPublicRevalidation({
      app: 'main',
      paths: ['/'],
      reason: 'hero_deleted'
    }).catch(console.error);

    trackEvent('hero_deleted', {
      app: 'admin',
      entityType: 'hero_slide',
      entityId: id,
      metadata: { role: profile.role },
    });
    return { success: true };
  } catch (err: any) {
    captureError(err, { app: 'admin', severity: 'error' });
    return { success: false, error: err?.message || 'Unexpected server error.' };
  }
}


