# Vercel Production Deployment Guide

This guide details the deployment setup for the VAVAW Platform across Vercel.

---

## 1. Project Overview & Mapping

The VAVAW monorepo contains four distinct Next.js web applications deployed to Vercel:

| Vercel Project Name | Monorepo Root Path | Production Domain | Primary Purpose |
| :--- | :--- | :--- | :--- |
| `vavaw-main` | `apps/main` | `vavaw.vn` | Main Brand Ecosystem Portal |
| `vavaw-beauty` | `apps/beauty` | `beauty.vavaw.vn` | Beauty & Personal Care Site |
| `vavaw-franchise` | `apps/franchise` | `franchise.vavaw.vn` | Franchise Opportunity Site |
| `vavaw-admin` | `apps/admin` | `admin.vavaw.vn` | Administrative Management Dashboard |

---

## 2. General Vercel Project Settings

For **all 4 projects**, configure the following general settings in Vercel:

- **Framework Preset**: Next.js
- **Node.js Version**: 20.x or 22.x
- **Build Command**: Automatically detected (`turbo run build` or `next build`)
- **Root Directory**: Set to the corresponding app directory (e.g. `apps/main`). Enable "Include source files outside root directory".

---

## 3. Recommended Phased Rollout Order

To ensure zero downtime and maximum production reliability, follow this exact 11-step rollout sequence:

1. **Deploy Public Apps in Static Mode**: Deploy `vavaw-main`, `vavaw-beauty`, and `vavaw-franchise` with `CMS_DATA_SOURCE=static`.
2. **Deploy Admin in Supabase Auth Mode**: Deploy `vavaw-admin` with `ADMIN_AUTH_MODE=supabase` and `NEXT_PUBLIC_ADMIN_AUTH_MODE=supabase`.
3. **Apply Supabase Migrations & Storage**: Follow [supabase-production-migration-checklist.md](./supabase-production-migration-checklist.md) to apply migrations `001` to `006` and create the `vavaw-media` bucket.
4. **Verify Admin Auth & CRUD**: Log in as Owner on `admin.vavaw.vn`. Test creating/updating business, hero, SEO, and content entries.
5. **Verify Public Lead Forms**: Submit test lead submissions on all public sites; confirm rows populate in `admin.vavaw.vn/leads`.
6. **Verify Signed Preview**: Generate signed preview links from Admin and verify draft rendering on public domains.
7. **Verify Audit Logs**: Confirm actions are logged in `admin.vavaw.vn/audit`.
8. **Switch Public Apps to Supabase CMS**: One by one, update `CMS_DATA_SOURCE=supabase` on public apps after verifying database stability.
9. **Enable On-Demand Revalidation**: Configure `CMS_REVALIDATION_ENABLED=true` and `REVALIDATION_SECRET`.
10. **Enable Email Notifications**: Set `EMAIL_PROVIDER=resend` and add `RESEND_API_KEY` once verified.
11. **Enable Sentry Monitoring**: Set `NEXT_PUBLIC_MONITORING_ENABLED=true` and `NEXT_PUBLIC_MONITORING_PROVIDER=sentry`.

---

## 4. Environment Variables Reference

### Critical Security Rule
> [!CAUTION]
> **NEVER** add `NEXT_PUBLIC_` to `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SECRET_KEY`, `CMS_PREVIEW_SECRET`, `REVALIDATION_SECRET`, `RESEND_API_KEY`, or `SENTRY_AUTH_TOKEN`.
