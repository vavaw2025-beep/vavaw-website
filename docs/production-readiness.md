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
| **Brand & UI** | ✅ PASSED | Premium Korean luxury aesthetic applied. Clean typography, generous spacing, mobile-first responsive. Phase 54, Phase 56, Phase 56B Launch Media attached and verified. Phase 56C Clinical Blue direction applied to Cosmetic. Phase 56D Main Hero Experience Polished. Phase 56E Hero Image Connections added. Phase 56F schema and host rules fixed. Phase 56G normalized hero image props for rendering. Phase 56H forced raw img tags for reliable Supabase URL resolution. Phase 56J removed all `PASTE_ACTUAL_PUBLIC_URL` placeholder strings from `packages/brand-config/src/index.ts`. Phase 56K verified `CMS_DATA_SOURCE=supabase` is required for image rendering; improved debug badge to show static vs supabase status. Phase 56M cleaned up prefetch CORS. Phase 56N verified Vercel preview. Phase 60F: Cosmetic lower page redesigned. Phase 60G: Cosmetic media loader (14 slots). Phase 60H: Vercel smoke test passed. Phase 62D: Cosmetic CMS end-to-end verified. Phase 63: Redesigned Admin Cosmetic Page UX Studio. Phase 63C: Cosmetic media upload and replace workflow polished. Phase 63D: Cosmetic media assets populated successfully. Phase 63E: Product cards rendering CMS media resolved. Phase 63F: Lumiglow Rosy Sheer Sunscreen cosmetic product card added. Phase 63F-2: Lumiglow Rosy Sheer Sunscreen synced to signature collection and daily ritual. |
| **Domain Prep**| ✅ PASSED | Custom domain mapping verified, DNS/SSL checklists created, Phase 52 checks completed. Phase 61 DNS Switchover initiated. |
| **Admin Docs** | ✅ PASSED | Phase 50A — Admin Feature Map added. Phase 51 — Admin Operating Guide created. |
| **Admin QA**   | ✅ PASSED | Phase 51 — Admin operating workflows verified. Phase 63B: Cosmetic Admin Studio production QA verified. |

- Hero transition route ready
- Hero media continuity implemented
- Phase 59: Main and Cosmetic Mobile QA completed.
- Phase 60: Vercel production env and debug cleanup ready.
- Phase 63: Cosmetic Page Admin UX Studio completed.
- Phase 63B: Cosmetic Admin Studio Production QA verified.
- Phase 63C: Cosmetic Media Upload and Replace UX Polish completed.
- Phase 63D: Cosmetic Media Population Final Pass completed.
- Phase 63E: Render Cosmetic Product Media on Public Page completed.
- Phase 63F: Add Missing Cosmetic Sunscreen Product completed.
- Phase 63F-2: Sync Lumiglow Sunscreen Into Missing Cosmetic Blocks Only completed.