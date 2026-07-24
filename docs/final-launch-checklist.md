# Final Launch Checklist - VAVAW Platform

## Pre-Launch Verification (T-24 Hours)

### Brand & UI (Phase 48 & Phase 50)
- [x] Visual polish completed across all apps (`vavaw-main`, `vavaw-beauty`, `vavaw-franchise`, `vavaw-admin`).
- [x] Responsive layouts checked on Mobile (360px), Tablet, Desktop.
- [x] Brand tokens applied without modifying backend logic.
- [x] Phase 50 — VAVAW Brand System Foundation completed (SiteFooter & docs).

### Domain Launch Preparation (Phase 49)
- [x] Visual QA and responsive QA completed.
- [x] Simple favicons added.
- [x] Production core flow smoke test passed.
- [x] `docs/domain-launch-checklist.md` created.

### Admin Feature Map (Phase 50A)
- [x] Admin Feature Map documentation page added.
- [x] `docs/admin-feature-map.md` created.

### Admin QA & Documentation (Phase 51)
- [x] Admin operating workflows (media, leads, audit logs) verified.
- [x] `docs/admin-operating-guide.md` created.

### Security & Authentication
- [ ] Production Admin is configured with `ADMIN_AUTH_MODE=supabase` and `NEXT_PUBLIC_ADMIN_AUTH_MODE=supabase`.
- [ ] `ADMIN_AUTH_MODE=mock` is completely disabled in production environment variables.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_SECRET_KEY` is present only in `vavaw-admin` and has **NO** `NEXT_PUBLIC_` prefix.
- [ ] `CMS_PREVIEW_SECRET` is set across all 4 apps and has **NO** `NEXT_PUBLIC_` prefix.
- [ ] `REVALIDATION_SECRET` is set across all 4 apps and has **NO** `NEXT_PUBLIC_` prefix.
- [ ] Initial Owner profile created and verified in Supabase RLS.
- [ ] `apps/admin/app/robots.ts` returns `Disallow: /` and meta tags enforce `noindex, nofollow`.

### Database & Storage
- [ ] Migrations `001_initial_cms_schema.sql` through `006_audit_logs.sql` applied cleanly.
- [ ] Storage bucket `vavaw-media` created and set to Public with RLS policies active.
- [ ] RLS smoke tests verified (Anon cannot read leads, audit logs, or admin profiles).

---

## Launch Day Checklist

- [ ] Deploy `vavaw-main`, `vavaw-beauty`, `vavaw-franchise` with `CMS_DATA_SOURCE=static`.
- [ ] Deploy `vavaw-admin` in Supabase Auth Mode.
- [ ] Verify Owner login on `admin.vavaw.vn`.
- [ ] Verify test lead submissions from all 3 public apps.
- [ ] Verify Signed Preview generation and exit preview functionality.
- [ ] Switch `CMS_DATA_SOURCE=supabase` on public applications one by one after verifying database queries.
- [ ] Enable `CMS_REVALIDATION_ENABLED=true` for instant cache purge.

---

## Post-Launch & Monitoring

- [ ] Check Sentry / Console monitoring for unhandled client or server exceptions.
- [ ] Confirm audit log table (`public.audit_logs`) records user actions properly.
- [ ] Verify SSL certificates and canonical domain redirects (`www.vavaw.vn` -> `vavaw.vn`).

---

## Deferred Features & Known Limitations

The following features were intentionally deferred for future platform iterations:

1. **Phase 45: CRM Integration Foundation**
   - Lead exports currently remain simple, secure CSV downloads from the Admin Dashboard. No third-party CRM syncing yet.
2. **Phase 46: Video Optimization Pipeline**
   - Direct HTML5 video upload (up to 50MB) is supported. Automated transcoding, adaptive HLS streaming, and external video hosting pipelines are deferred.
3. **Automated Audit Log Retention**
   - Audit logs are append-only. Automated archiving/deletion policies are managed manually for now.
4. **One-Time-Use Preview Tokens**
   - Signed preview tokens are HMAC time-based signatures valid for a configurable TTL (default 15 mins). Single-use token invalidation is deferred.
