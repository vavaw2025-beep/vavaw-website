export type AuditStatus = 'success' | 'failure';

export type AuditLogAction =
  | 'admin_user_created'
  | 'admin_user_invited'
  | 'admin_user_updated'
  | 'admin_user_disabled'
  | 'admin_user_invite_failed'
  | 'lead_status_updated'
  | 'lead_exported'
  | 'lead_export_failed'
  | 'media_uploaded'
  | 'media_video_uploaded'
  | 'media_deleted'
  | 'media_video_deleted'
  | 'media_upload_failed'
  | 'media_video_upload_failed'
  | 'business_created'
  | 'business_updated'
  | 'business_deleted'
  | 'hero_created'
  | 'hero_updated'
  | 'hero_deleted'
  | 'seo_created'
  | 'seo_updated'
  | 'seo_deleted'
  | 'content_block_created'
  | 'content_block_updated'
  | 'content_block_deleted'
  | 'preview_link_generated'
  | 'preview_link_generation_failed'
  | 'cms_revalidation_triggered'
  | 'cms_revalidation_failed';

export type AuditEntityType =
  | 'user'
  | 'lead'
  | 'media'
  | 'business'
  | 'hero'
  | 'seo'
  | 'content_block'
  | 'preview'
  | 'revalidation';

export interface AuditLogRecord {
  id: string;
  actor_id: string | null;
  actor_role: string | null;
  action: AuditLogAction | string;
  entity_type: AuditEntityType | string;
  entity_id: string | null;
  status: AuditStatus;
  metadata: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  // Optional join helper for listing actor info
  actor_email?: string | null;
}

export interface AuditLogFilters {
  action?: string;
  entity_type?: string;
  status?: AuditStatus;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}
