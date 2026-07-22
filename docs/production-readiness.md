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

## Quality & Monitoring
- [ ] **Analytics Status:** Pending (Google Analytics / Vercel Web Analytics integration required).
- [ ] **Security Status:** 
  - Admin app requires route protection.
  - API routes require authentication verification.
  - CORS policies need defining.
- [ ] **Performance Status:** 
  - Core web vitals baseline needed.
  - Image optimization (Next.js `<Image>`) to be reviewed across all apps.
