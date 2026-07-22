# Production Readiness Checklist

This document tracks the readiness state of the VAVAW monorepo for production deployment.

## Frontend Infrastructure
- [x] **Build Status:** All apps (`apps/main`, `apps/beauty`, `apps/franchise`, `apps/admin`) build successfully using Turborepo and `pnpm build`.
- [x] **SEO Status:** Metadata (Title, Description, OpenGraph, Twitter Cards) is configured using `@vavaw/brand-config`.
- [x] **Robots/Sitemap Status:** Public apps have auto-generated `robots.txt` and `sitemap.xml`. Admin app is strictly set to `noindex, nofollow` in both metadata and `robots.ts`.
- [x] **Media Asset Status:** Static placeholder media is currently used. Dynamic media (e.g., Cloudinary/AWS) is pending.

## Backend Infrastructure
- [ ] **Admin Auth Status:** ⚠️ **NOT PRODUCTION READY**. Currently using a mock UI and mock roles. Do not expose the admin domain publicly until real Supabase Auth and Next.js middleware protection are implemented.
- [ ] **Database Status:** ⚠️ **NOT PRODUCTION READY**. The `@vavaw/db` package is currently type-only. Real Supabase Postgres connection is pending.
- [ ] **Storage Status:** ⚠️ **NOT PRODUCTION READY**. Currently serving images from the static `public` folder. Object storage integration is pending.

## Quality & Monitoring
- [ ] **Analytics Status:** Pending (Google Analytics / Vercel Web Analytics integration required).
- [ ] **Security Status:** 
  - Admin app requires route protection.
  - API routes require authentication verification.
  - CORS policies need defining.
- [ ] **Performance Status:** 
  - Core web vitals baseline needed.
  - Image optimization (Next.js `<Image>`) to be reviewed across all apps.
