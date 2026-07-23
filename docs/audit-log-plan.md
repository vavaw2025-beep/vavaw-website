# Phase 44: Role Activity Audit Log Plan

## 1. Overview
The Role Activity Audit Log system provides append-only, tamper-resistant logging of privileged actions performed within the VAVAW Admin Dashboard. It enforces strict data privacy rules to prevent sensitive information (PII, secrets, raw tokens, or full message payloads) from reaching the audit storage.

## 2. Table Schema (`public.audit_logs`)
- `id` (uuid, primary key): Unique identifier (`gen_random_uuid()`).
- `actor_id` (uuid, nullable): References `public.admin_profiles(id)` on delete set null.
- `actor_role` (text): Role of the actor when performing the action (`owner`, `admin`, `editor`).
- `action` (text, non-null): Standardized event string (e.g. `lead_exported`, `admin_user_invited`).
- `entity_type` (text, non-null): Category of entity operated upon (`user`, `lead`, `media`, `business`, `hero`, `seo`, `content_block`, `preview`).
- `entity_id` (text, nullable): ID of the affected record.
- `status` (text, non-null): Event outcome (`success` or `failure`).
- `metadata` (jsonb, non-null): Sanitized contextual details.
- `ip_address` (text, nullable): Origin IP address.
- `user_agent` (text, nullable): Origin User-Agent string.
- `created_at` (timestamptz, non-null): Timestamp of entry creation (`now()`).

## 3. RLS Access Rules
- **SELECT**: Restricted to active `owner` and `admin` profiles.
- **INSERT**: Allowed for active `owner`, `admin`, and `editor` profiles via server operations.
- **UPDATE**: **NO POLICY** (Strictly append-only).
- **DELETE**: **NO POLICY** (Strictly append-only).

## 4. Metadata Sanitization Rules
Before persisting metadata to `public.audit_logs`, the `sanitizeAuditMetadata` utility evaluates all keys against a strict combined **denylist** and **allowlist** filter:

### Denylist (Keys containing any of these are immediately dropped)
`email`, `phone`, `password`, `token`, `secret`, `key`, `message`, `full_name`, `fullname`, `company_name`, `companyname`, `csv`, `url`, `raw`, `body`, `request`, `response`, `cookie`, `authorization`.

### Allowlist (Only matching safe key names are retained)
`role`, `target`, `source_app`, `lead_type`, `media_type`, `content_type`, `status_before`, `status_after`, `size_bucket`, `result`, `reason_code`, `count`, `row_count`, `status_filter`, `source_app_filter`, `lead_type_filter`, `date_range_present`, `target_app`, `error_type`, `file_type`.

## 5. Tracked Actions
- **User Management**: `admin_user_created`, `admin_user_invited`, `admin_user_updated`, `admin_user_disabled`, `admin_user_invite_failed`
- **Leads**: `lead_status_updated`, `lead_exported`, `lead_export_failed`
- **Media**: `media_uploaded`, `media_video_uploaded`, `media_deleted`, `media_video_deleted`, `media_upload_failed`, `media_video_upload_failed`
- **CMS Content**: `business_created`, `business_updated`, `business_deleted`, `hero_created`, `hero_updated`, `hero_deleted`, `seo_created`, `seo_updated`, `seo_deleted`, `content_block_created`, `content_block_updated`, `content_block_deleted`
- **Preview & Revalidation**: `preview_link_generated`, `preview_link_generation_failed`, `cms_revalidation_triggered`, `cms_revalidation_failed`

## 6. Non-blocking Failure Behavior
If audit log insertion fails (e.g. database network error or schema mismatch), the error is caught, logged to `@vavaw/monitoring`, and execution continues gracefully without aborting the main business transaction.

## 7. Future Enhancements
- Audit log retention policy & automated archiving.
- CSV/JSON export of audit log history for compliance audits.
- Real-time admin security alerts on unusual volumes of failed actions.
