# Final Launch Checklist - VAVAW Platform

## Pre-Launch Verification (T-24 Hours)

### Brand & UI (Phase 48 & Phase 50)
- [x] Visual polish completed across all apps (`vavaw-main`, `vavaw-beauty`, `vavaw-franchise`, `vavaw-admin`).
- [x] Responsive layouts checked on Mobile (360px), Tablet, Desktop.
- [x] Brand tokens applied without modifying backend logic.
- [x] Phase 50 — VAVAW Brand System Foundation completed (SiteFooter & docs).
- [x] Phase 56M: Clean hero image warnings and external redirect prefetch CORS completed.
- [x] Phase 56N: Production Env Sync & Vercel Preview Verification completed.

### Domain Launch Preparation & Execution (Phase 49 & Phase 52)
- [x] Visual QA and responsive QA completed.
- [x] Simple favicons added.
- [x] Production core flow smoke test passed.
- [x] `docs/domain-launch-checklist.md` created and updated with environment variables.
- [x] `docs/post-domain-smoke-test.md` created.
- [x] Supabase Auth callback configuration verified in docs.

### Admin Feature Map (Phase 50A)
- [x] Admin Feature Map documentation page added.
- [x] `docs/admin-feature-map.md` created.

### Admin QA & Documentation (Phase 51)
- [x] Admin operating workflows (media, leads, audit logs) verified.
- [x] `docs/admin-operating-guide.md` created.

### Main & Cosmetic Final Content (Phase 54 & Phase 56)
- [x] Main homepage layout and copy polished.
- [x] Cosmetic content finalized and optimized.
- [x] `docs/main-cosmetic-final-content-plan.md` created.
- [x] Phase 56: Launch Content Media Upload prepared.
- [x] Phase 56B: Attach Launch Media and Verify Main/Cosmetic Visual QA completed.
- [x] Phase 56C: Cosmetic Blue Clinical Luxury CSS Direction applied.
- [x] Phase 56D: Main Banner / Hero Experience Polish completed.
- [x] Phase 56E: Connect Uploaded Hero Images to Main Public Homepage completed.
- [x] Phase 56F: Fix Public Main Hero Media Rendering With Actual Production Schema completed.
- [x] Phase 56G: Trace and Fix BrandHero Image Prop Rendering completed.
- [x] Phase 56H: Fix Missing Supabase Image Requests in BrandHero completed.
- [x] Phase 56J: Remove runtime placeholder image source (`PASTE_ACTUAL_PUBLIC_URL`) from `packages/brand-config/src/index.ts` completed.
- [x] Phase 56K: Verify CMS source environment for Main hero images completed. (`CMS_DATA_SOURCE=supabase` confirmed required; debug badge updated to show static vs supabase status.)
- [x] Phase 56O: Main Hero Visual Contrast Polish — reduced overlay darkness, refined typography, CTA improvements.
- [x] Phase 56P: Simplify Main Hero Composition — blur/desaturate background, gradient text-safe zone, max 2 preview cards, hide cards on mobile, calm animations.
- [x] Phase 56Q: Final Main Hero Production Cleanup — `NEXT_PUBLIC_SHOW_CMS_DEBUG` confirmed temporary; documented as dev-only; must be `false` or absent before production launch. Vercel Analytics 404 (`/_vercel/insights/script.js`) is non-blocking: only loads in production when Vercel Analytics is enabled on project settings.
- [x] Phase 60E: Cosmetic hero image rendering fixed — Supabase CMS source env confirmed; Vercel Analytics 404 removed.
- [x] Phase 60F: Cosmetic lower page editorial layout redesigned with 9 premium sections based on VAVAW brochure content and Korean luxury minimalism design language.
- [x] Phase 60G: Cosmetic real media population infrastructure — `load-public-cosmetic-media.ts` loader, 14 named slots, `EditorialImage` component, graceful gradient fallbacks.
- [x] Phase 60H: Final Vercel smoke test — automated HTML analysis: all PASS. No blocking issues. Manual browser QA + product photography upload pending before Phase 61.
- [x] Phase 62: Cosmetic Page CMS Management — Created Admin Cosmetic Page manager to edit `content_blocks` and upload media for cosmetic slots. Upgraded `/cosmetic` public page to fetch CMS blocks dynamically, with safe fallback to hardcoded content.
- [x] Phase 62D: Cosmetic CMS end-to-end verified.
- [x] Phase 63: Cosmetic Page Admin UX Studio — Redesigned Admin `/cosmetic-page` with user-friendly tabs, Vietnamese translations, and specialized product, ingredient, and ritual editors. Built media slots manager with library picker and metadata-based slot removals.
- [x] Phase 63B: Cosmetic Admin Studio Production QA — Verified tab layout, editors, and slot assignment/unassignment behaviors on production.
- [x] Phase 63C: Cosmetic Media Upload and Replace UX Polish — Implemented contextual Cosmetic Slot upload mode, live preview of chosen files, current slot asset visual, and success actions.
- [x] Phase 63D: Cosmetic Media Population Final Pass — Successfully populated the minimum required media assets (Luminous set, premium program, daily ritual panel).
- [x] Phase 63E: Render Cosmetic Product Media on Public Page — Wired the public product card images to product slot keys and fixed the admin preview media count logic.
- [x] Phase 63F: Add Missing Cosmetic Sunscreen Product — Added Lumiglow Rosy Sheer Sunscreen product card and `cosmetic-product-lumiglow-sunscreen` media slot.
- [x] Phase 63F-2: Sync Lumiglow Sunscreen Into Missing Cosmetic Blocks Only — Synchronized sunscreen product across cosmetic-signature-collection and daily ritual.
- [x] Phase 64: Dynamic Brand / Business Philosophy Studio for /cosmetic — Visual repeater editor, custom subtitle inputs, whitelist dropdown picker mapping 16 premium clinical Lucide icons, and modern card animations.
- [ ] Phase 61: Custom Domain DNS Switchover — Domains connected to Vercel, SSL verified, Supabase Auth redirect URLs updated, post-domain smoke test passed.


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
H e r o   v i s u a l   c o n t i n u i t y   c o m p l e t e  
 D e s t i n a t i o n   m e d i a   c o n t i n u i t y   c o m p l e t e  
 -   [ x ]   P h a s e   5 9 :   M a i n   a n d   C o s m e t i c   M o b i l e   Q A   c o m p l e t e d .  
 -   [ x ]   P h a s e   6 0 :   V e r c e l   p r o d u c t i o n   e n v   a n d   d e b u g   c l e a n u p   r e a d y .  
 
- [x] Phase 62 — Cosmetic CMS Management: Production-ready after Vercel verification.
