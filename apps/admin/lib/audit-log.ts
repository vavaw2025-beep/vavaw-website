import { getAdminServerSupabaseClient } from './supabase-server';
import { getCurrentAdminProfile } from './admin-profile';
import { createAuditLog } from '@vavaw/db';
import { AuditLogAction, AuditEntityType, AuditStatus } from '@vavaw/db';
import { trackEvent } from '@vavaw/analytics';
import { captureError } from '@vavaw/monitoring';

const DENYLIST_PATTERNS = [
  'email',
  'phone',
  'password',
  'token',
  'secret',
  'key',
  'message',
  'full_name',
  'fullname',
  'company_name',
  'companyname',
  'csv',
  'url',
  'raw',
  'body',
  'request',
  'response',
  'cookie',
  'authorization',
];

const ALLOWLIST_KEYS = new Set([
  'role',
  'target',
  'source_app',
  'lead_type',
  'media_type',
  'content_type',
  'status_before',
  'status_after',
  'size_bucket',
  'result',
  'reason_code',
  'count',
  'row_count',
  'status_filter',
  'source_app_filter',
  'lead_type_filter',
  'date_range_present',
  'target_app',
  'error_type',
  'file_type',
]);

/**
 * Sanitizes metadata using denylist and allowlist rules.
 */
export function sanitizeAuditMetadata(rawMetadata: Record<string, any> = {}): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(rawMetadata)) {
    const lowerKey = key.toLowerCase();

    // 1. Denylist check
    const containsDeniedPattern = DENYLIST_PATTERNS.some((pattern) => lowerKey.includes(pattern));
    if (containsDeniedPattern) {
      continue; // Drop key
    }

    // 2. Allowlist check
    if (ALLOWLIST_KEYS.has(lowerKey)) {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export interface WriteAuditLogParams {
  action: AuditLogAction | string;
  entityType: AuditEntityType | string;
  entityId?: string | null;
  status?: AuditStatus;
  metadata?: Record<string, any>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Writes an append-only audit log entry.
 * Never throws an exception to the caller to avoid disrupting business logic.
 */
export async function writeAuditLog(params: WriteAuditLogParams): Promise<void> {
  try {
    const supabase = await getAdminServerSupabaseClient();
    const profile = await getCurrentAdminProfile();

    const sanitizedMeta = sanitizeAuditMetadata(params.metadata || {});

    const status = params.status || 'success';

    const result = await createAuditLog(supabase, {
      actor_id: profile?.id || null,
      actor_role: profile?.role || 'anonymous',
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId || null,
      status: status,
      metadata: sanitizedMeta,
      ip_address: params.ipAddress || null,
      user_agent: params.userAgent || null,
    });

    if (result.success) {
      // Optional minimal analytics
      await trackEvent('audit_log_created', {
        app: 'admin',
        entityType: params.entityType,
        status: status,
        metadata: { action: params.action }
      });
    } else {
      await trackEvent('audit_log_failed', {
        app: 'admin',
        entityType: params.entityType,
        status: 'failure',
        metadata: { action: params.action }
      });

      captureError(new Error('Audit log creation failed'), {
        app: 'admin',
        feature: 'audit_log',
        metadata: {
          action: params.action,
          entity_type: params.entityType,
          status: 'failure',
        },
      });
    }
  } catch (err: any) {
    console.error('[writeAuditLog Exception]', err);
    console.warn("[audit] failed to write audit log", {
      action: params.action,
      entity_type: params.entityType,
      status: 'exception',
      reason: err.message
    });
    captureError(err, {
      app: 'admin',
      feature: 'audit_log',
      metadata: {
        action: params.action,
        entity_type: params.entityType,
        status: 'exception',
      },
    });
  }
}
