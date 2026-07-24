# Production Readiness Dashboard & Audit

## Platform Overview
- **Monorepo Structure**: pnpm workspace + Turbopack
- **Applications**: `main` (vavaw.vn), `beauty` (beauty.vavaw.vn), `franchise` (franchise.vavaw.vn), `admin` (admin.vavaw.vn)
- **Database & Storage**: Supabase Postgres + Supabase Storage (`vavaw-media`)

---

## Production Audit Matrix

| Category | Status | Details |
| :--- | :--- | :--- |
| **Build & Typecheck** | ✅ PASSED | All 11 workspace packages and 4 Next.js applications build cleanly without errors (`pnpm build`). |
| **Admin Auth** | ✅ PASSED | Production uses `ADMIN_AUTH_MODE=supabase`. Mock mode disallowed in production. |
| **Public Security** | ✅ PASSED | Anon cannot read leads, audit logs, or admin profiles. Honeypot anti-spam enabled for leads. |
| **Signed Preview** | ✅ PASSED | HMAC-SHA256 token verification on `/api/preview`, Draft Mode activation, httpOnly cookie, `no-store`. |
| **Audit Logging** | ✅ PASSED | Append-only `public.audit_logs` table (no `UPDATE`/`DELETE` RLS policies). Privacy denylist/allowlist active. |
| **Media Support** | ✅ PASSED | Images (up to 5MB) and Videos (up to 50MB) supported with standard HTML5 `<video controls>`. |
| **Lead CSV Export** | ✅ PASSED | Owner and Admin only (`canExportLeads`). Bulk PII protected. Max 5,000 rows. |
| **Monitoring** | ✅ PASSED | Unified `@vavaw/monitoring` package supporting Console and Sentry integration. |
| **SEO & Sitemap** | ✅ PASSED | Dynamic `/sitemap.xml`, `/robots.txt`, openGraph, JSON-LD, Admin `noindex/nofollow`. |
| **Brand & UI** | ✅ PASSED | Premium Korean luxury aesthetic applied. Clean typography, generous spacing, mobile-first responsive. Phase 54, Phase 56, Phase 56B Launch Media attached and verified. Phase 56C Clinical Blue direction applied to Cosmetic. Phase 56D Main Hero Experience Polished. Phase 56E Hero Image Connections added. Phase 56F schema and host rules fixed. Phase 56G normalized hero image props for rendering. Phase 56H forced raw img tags for reliable Supabase URL resolution. Phase 56J removed all `PASTE_ACTUAL_PUBLIC_URL` placeholder strings from `packages/brand-config/src/index.ts`. Phase 56K verified `CMS_DATA_SOURCE=supabase` is required for image rendering; improved debug badge to show clear static vs supabase status. Phase 56M cleaned up external prefetch CORS issues by disabling prefetch on Next.js Links to external redirect routes (/go/beauty, /go/franchise) and that missing media safely falls back to a gradient. |
| **Domain Prep**| ✅ PASSED | Custom domain mapping verified, DNS/SSL checklists created, Phase 52 checks completed. |
| **Admin Docs** | ✅ PASSED | Phase 50A — Admin Feature Map added. Phase 51 — Admin Operating Guide created. |
| **Admin QA**   | ✅ PASSED | Phase 51 — Admin operating workflows verified. |
