'use server';

import { createPreviewToken, PreviewTokenPayload } from '@vavaw/auth/server';
import { canGeneratePreviewLink } from '@vavaw/auth';
import { getCurrentAdminProfile } from '../../lib/admin-profile';
import { trackEvent } from '@vavaw/analytics';
import { captureError } from '@vavaw/monitoring';
import { writeAuditLog } from '../../lib/audit-log';

export async function generateSignedPreviewLinkAction(
  app: 'main' | 'beauty' | 'franchise',
  target: 'home' | 'cosmetic' | 'beauty' | 'franchise',
  path: string
) {
  try {
    const profile = await getCurrentAdminProfile();
    
    if (!profile || profile.status !== 'active' || !canGeneratePreviewLink(profile.role)) {
      await trackEvent('preview_link_generation_failed', { 
        app: 'admin', target, path, 
        status: 'unauthorized',
        metadata: { role: profile?.role ?? 'anonymous' }
      });
      await writeAuditLog({
        action: 'preview_link_generation_failed',
        entityType: 'preview',
        status: 'failure',
        metadata: { role: profile?.role ?? 'anonymous', target_app: app, target, reason_code: 'unauthorized' }
      });
      return { success: false, error: 'Unauthorized to generate preview links.' };
    }

    const secret = process.env.CMS_PREVIEW_SECRET;
    if (!secret) {
      await trackEvent('preview_link_generation_failed', { 
        app: 'admin', target, path, 
        status: 'missing_secret',
        metadata: { role: profile.role }
      });
      await writeAuditLog({
        action: 'preview_link_generation_failed',
        entityType: 'preview',
        status: 'failure',
        metadata: { role: profile.role, target_app: app, target, reason_code: 'missing_secret' }
      });
      return { success: false, error: 'Preview secret is not configured on the server.' };
    }

    const ttl = parseInt(process.env.CMS_PREVIEW_TOKEN_TTL_SECONDS || '900', 10);
    const token = createPreviewToken({ app, target, path }, secret, ttl);

    let baseUrl = '';
    switch (app) {
      case 'main': baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; break;
      case 'beauty': baseUrl = process.env.NEXT_PUBLIC_BEAUTY_URL || 'http://localhost:3001'; break;
      case 'franchise': baseUrl = process.env.NEXT_PUBLIC_FRANCHISE_URL || 'http://localhost:3002'; break;
    }

    const previewUrl = `${baseUrl}/api/preview?token=${token}&path=${encodeURIComponent(path)}`;

    await trackEvent('preview_link_generated', {
      app: 'admin',
      target,
      path,
      status: 'success',
      metadata: { role: profile.role, target_app: app }
    });

    await writeAuditLog({
      action: 'preview_link_generated',
      entityType: 'preview',
      status: 'success',
      metadata: { role: profile.role, target_app: app, target }
    });

    return { success: true, previewUrl, ttl };
  } catch (error: any) {
    captureError(error, {
      feature: 'signed_preview',
      app: 'admin', path,
      metadata: { target, status: 'error', target_app: app }
    });
    await writeAuditLog({
      action: 'preview_link_generation_failed',
      entityType: 'preview',
      status: 'failure',
      metadata: { target_app: app, target, reason_code: 'exception' }
    });
    return { success: false, error: 'An unexpected error occurred while generating the preview link.' };
  }
}
