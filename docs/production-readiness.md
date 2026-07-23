# Production Readiness Checklist

This document tracks the readiness state of the VAVAW monorepo for production deployment.

## Frontend Infrastructure
- [x] **Build Status:** All apps (`apps/main`, `apps/beauty`, `apps/franchise`, `apps/admin`) build successfully using Turborepo and `pnpm build`.
- [x] **SEO Status:** Metadata (Title, Description, OpenGraph, Twitter Cards) is configured using `@vavaw/brand-config`.
- [x] **Robots/Sitemap Status:** Public apps have auto-generated `robots.txt` and `sitemap.xml`. Admin app is strictly set to `noindex, nofollow` in both metadata and `robots.ts`.
- [x] **Media Asset Status:** Static placeholder media is currently used. Dynamic media (e.g., Cloudinary/AWS) is pending.

## Backend Infrastructure
- [x] **Admin Auth & Middleware Protection:** Enabled. Supabase Auth integration, Next.js Middleware route protection (`apps/admin/middleware.ts`), and RLS role guards (`owner`, `admin`, `editor`, `viewer`) implemented.
- [x] **Database & CRUD Status:** Defined schema (`001_initial_cms_schema.sql`), `@vavaw/db` typed queries/mutations, and Server Actions for Business Entries and Hero Slides CRUD.
- [x] **Storage Status:** Storage policies (`002_storage_policies.sql`) and image file uploads to Supabase Storage bucket `vavaw-media` (max 5MB, JPG/PNG/WEBP/AVIF) implemented. Video upload pending.
- [x] **Public CMS Read (`apps/main`):** `CMS_DATA_SOURCE` env var controls data source. Default is `static` (@vavaw/brand-config). Set to `supabase` for live CMS data via anon client + RLS. Automatic fallback to static on error/empty. Never uses service role key in public apps.
- [x] **Public Redirects Safety (`/go/[slug]`):** All redirect destinations validated via `isSafeRedirectUrl()`. Only internal paths and trusted VAVAW domains allowed. Protects against open-redirect attacks from arbitrary CMS data.
- [x] **ISR Caching:** Homepage uses `export const revalidate = 60` (static constant, Next.js requirement). Prevents stale permanent build-time CMS data in supabase mode. Static mode pre-renders at build time with no revalidation overhead. To change the interval, update the constant in `apps/main/app/page.tsx` and redeploy.
- [x] **SEO CRUD (admin):** `seo_settings` table fully managed from `/seo` admin page. Create/update: owner/admin/editor. Delete: owner/admin. Viewer read-only. Mock mode read-only with notice.
- [x] **Public SEO Metadata (apps/main):** `generateMetadata()` on `/` and `/cosmetic` pages reads from Supabase `seo_settings` when `CMS_DATA_SOURCE=supabase`. Robots directives (`index`/`follow`) controlled per-page from CMS. Full static fallback. `apps/beauty` and `apps/franchise` remain static.
- [x] **OG Image from Media:** Admin SEO form supports selecting `og_media_id` from uploaded `media_assets`. URL resolved at load time for public pages.
- [ ] **SEO Seed (002):** `supabase/seed/002_seed_seo_settings.sql` is optional and should not be re-run after production data exists (overwrites manual edits).
- [x] **Content Blocks CRUD (admin):** `content_blocks` table fully managed from `/content` admin page. Create/update: owner/admin/editor. Delete: owner/admin. Viewer read-only.
- [ ] **Content Blocks Seed (003):** `supabase/seed/003_seed_content_blocks.sql` is optional and non-destructive but will duplicate rows if run multiple times.
- [x] **Content Blocks Rendering:** Connected to `apps/main` /cosmetic page via `ContentBlockRenderer`. Full static fallback (`CosmeticContent`) handles DB errors or empty states gracefully. `apps/beauty` and `apps/franchise` remain static.
- [x] **Admin Users Management:** `owner` role can manage `admin_profiles` (create, edit, disable). Manual Supabase Auth creation required. Delete operation disabled. Strict safety guards prevent accidental owner lockouts.

## Quality & Monitoring
- [x] **Analytics Status:** `@vavaw/analytics` workspace package integrated.
  - Analytics are strictly **disabled by default** via `NEXT_PUBLIC_ANALYTICS_ENABLED=false`.
  - Privacy compliance: **No PII** (no emails, tokens, or sensitive passwords) is ever tracked.
  - Provider configurable via `NEXT_PUBLIC_ANALYTICS_PROVIDER` (`noop`, `console`, `vercel`, `custom`).
  - Validation: Requires starting the app with enabled flags to verify event payloads locally.
- [ ] **Security Status:** 
  - Admin app requires route protection.
  - API routes require authentication verification.
  - CORS policies need defining.
- [ ] **Performance Status:** 
  - Core web vitals baseline needed.
  - Image optimization (Next.js `<Image>`) to be reviewed across all apps.

## Phase 30: Production Hardening
Phase 30 audited environments, RLS policies, safe redirects, CMS fallbacks, SEO logic, and Analytics privacy. 
- Validation helpers and security warnings were added to the admin app.
- Documentation for RLS (`security-rls-audit.md`) and deployment (`production-launch-checklist.md`) were created.
- The repository is now structurally ready for secure Vercel deployment with Supabase.

## Phase 31: First Production Deployment Test (Current)
Phase 31 finalizes the preparation for the first live deployment test on Vercel and Supabase.

### Recommended Rollout Strategy
To ensure maximum stability, deploy components progressively:
1. **Step 1:** Deploy all public apps (`apps/main`, `apps/beauty`, `apps/franchise`) with `CMS_DATA_SOURCE=static`.
2. **Step 2:** Verify public UI, domain routing, and static fallbacks.
3. **Step 3:** Deploy the admin dashboard (`apps/admin`) with `NEXT_PUBLIC_ADMIN_AUTH_MODE=supabase`.
4. **Step 4:** Verify admin login, middleware protection, and ensure RLS is actively blocking unauthorized reads/writes.
5. **Step 5:** Switch `apps/main` to `CMS_DATA_SOURCE=supabase` and redeploy.
6. **Step 6:** Verify homepage content blocks, `/cosmetic`, and `/go/[slug]` live data.
7. **Step 7:** Switch `apps/beauty` and `apps/franchise` to `CMS_DATA_SOURCE=supabase` and redeploy.
8. **Step 8:** Run the full `docs/deployment-smoke-test.md` checklist.

## Phase 32: CMS Revalidation Hooks
Phase 32 added on-demand ISR revalidation routes to the public apps. The admin dashboard can securely purge edge caches in the public apps (main, eauty, ranchise) after mutations using a shared secret (REVALIDATION_SECRET). This removes the need for arbitrary time-based revalidation (e.g. evalidate = 60) on slowly changing content, ensuring the frontend reflects backend changes instantly while retaining static performance. See docs/revalidation-plan.md for full implementation details.

## Phase 33: Admin CMS Preview Center (Current)
Phase 33 implemented a secure, read-only Admin Preview Center. It allows authorized admin users to view both active and draft content across all targets (Main, Cosmetic, Beauty, Franchise) before publishing, without exposing draft data to the public apps or bypassing static edge caching.

## Phase 34: Styling Recovery for Admin, Beauty, and Franchise
Completed a Tailwind CSS v4 setup normalization across pps/admin, pps/beauty, and pps/franchise. 
- Added missing postcss.config.mjs with @tailwindcss/postcss plugin.
- Added @source "../../../packages/ui" in globals.css of all apps to ensure shared UI components are scanned and styled correctly.
- Created standalone, customized @theme definitions in globals.css for each app:
  - Admin: Dark dashboard theme.
  - Beauty: Premium elegant light rose palette.
  - Franchise: Professional business amber palette.
- Verified build and transpilation across all apps.

## Phase 35: Cross-App UI QA + Design System Sync
- Phase 35 UI QA completed. Verified responsive layout, typography, dark/light contrast, and shared component rendering across all applications.
- Tailwind v4 setup normalized ensuring all apps properly utilize @tailwindcss/postcss.
- Shared UI source scanning (@source "../../../packages/ui") verified, ensuring @vavaw/ui components receive styling properly across the monorepo.

### Phase 36: Public Contact / Lead Forms (Completed)
- Created \public.leads\ table with RLS (INSERT only for public, SELECT for admins, UPDATE for editors+).
- Implemented honeypot anti-spam protection instead of complex CAPTCHA.
- Integrated Lead capture forms in Main (\/contact\), Beauty, and Franchise apps.
- Built Admin Leads Dashboard (\/leads\) to view and manage lead statuses securely.

### Phase 37: Lead Email Notifications (Completed)
- Added \packages/notifications\ with Resend integration.
- Added email delivery with 5-second timeout and robust \	ry/catch\ blocks.
- Implemented \
oop\ and \console\ providers for safe local testing.
- Added tracking events for email notification success/failure.

### Phase 38: Monitoring & Error Reporting (Completed)
- Built @vavaw/monitoring package for safe error capture.
- Added global error boundaries to all apps.
- Integrated health check endpoints (/api/health).

