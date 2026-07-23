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
  | 'admin_user_deleted';

export interface AnalyticsEventPayload {
  app: 'main' | 'beauty' | 'franchise' | 'admin';
  path?: string;
  source?: string;
  target?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, string | number | boolean | null>;
}
