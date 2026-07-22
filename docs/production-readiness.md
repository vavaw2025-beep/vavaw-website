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

## Quality & Monitoring
- [ ] **Analytics Status:** Pending (Google Analytics / Vercel Web Analytics integration required).
- [ ] **Security Status:** 
  - Admin app requires route protection.
  - API routes require authentication verification.
  - CORS policies need defining.
- [ ] **Performance Status:** 
  - Core web vitals baseline needed.
  - Image optimization (Next.js `<Image>`) to be reviewed across all apps.
