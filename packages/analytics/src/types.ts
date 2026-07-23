export type AnalyticsProvider = 'noop' | 'console' | 'vercel' | 'custom';

export type AnalyticsEventName =
  | 'page_view'
  | 'hero_cta_click'
  | 'business_card_click'
  | 'redirect_click'
  | 'cosmetic_cta_click'
  | 'beauty_cta_click'
  | 'franchise_cta_click'
  | 'admin_login_success'
  | 'admin_logout'
  | 'business_created'
  | 'business_updated'
  | 'business_deleted'
  | 'hero_created'
  | 'hero_updated'
  | 'hero_deleted'
  | 'media_uploaded'
  | 'media_deleted'
  | 'seo_created'
  | 'seo_updated'
  | 'seo_deleted'
  | 'content_block_created'
  | 'content_block_updated'
  | 'content_block_deleted'
  | 'admin_user_created'
  | 'admin_user_updated'
  | 'admin_user_disabled'
  | 'admin_user_deleted'
  | 'admin_user_invited'
  | 'admin_user_invite_failed'
  | 'cms_revalidation_triggered'
  | 'cms_revalidation_failed'
  | 'lead_submitted'
  | 'lead_status_updated'
  | 'lead_notification_sent'
  | 'lead_notification_failed'
  | 'leads_exported'
  | 'leads_export_failed'
  | 'media_video_uploaded'
  | 'media_video_upload_failed'
  | 'media_video_deleted'
  | 'preview_link_generated'
  | 'preview_link_generation_failed'
  | 'public_preview_opened'
  | 'public_preview_denied'
  | 'public_preview_exited';

export interface AnalyticsEventPayload {
  app: 'main' | 'beauty' | 'franchise' | 'admin';
  path?: string;
  source?: string;
  target?: string;
  entityType?: string;
  entityId?: string;
  source_app?: string;
  lead_type?: string;
  status?: string;
  provider?: string;
  metadata?: Record<string, string | number | boolean | null>;
}
