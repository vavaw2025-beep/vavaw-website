# Production Launch Checklist

This document is the master checklist to follow when deploying the VAVAW monorepo to production.

## A. Vercel Projects
Ensure the following projects are created in Vercel, pointing to the same GitHub repository:
- [ ] **main app**: Framework preset `Next.js`, root directory `apps/main`
- [ ] **beauty app**: Framework preset `Next.js`, root directory `apps/beauty`
- [ ] **franchise app**: Framework preset `Next.js`, root directory `apps/franchise`
- [ ] **admin app**: Framework preset `Next.js`, root directory `apps/admin`

## B. Domains
Ensure Vercel domains are assigned correctly:
- [ ] `vavaw.vn` assigned to **main app**
- [ ] `beauty.vavaw.vn` assigned to **beauty app**
- [ ] `franchise.vavaw.vn` assigned to **franchise app**
- [ ] `admin.vavaw.vn` assigned to **admin app**

## C. Environment Variables
Configure the following in Vercel Project Settings -> Environment Variables for **all projects**:
- [ ] `NEXT_PUBLIC_SITE_URL=https://vavaw.vn` (Use appropriate domain per app)
- [ ] `NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]`
- [ ] `CMS_DATA_SOURCE=supabase` (Public apps default to static; set to supabase to enable live CMS)
- [ ] `NEXT_PUBLIC_ANALYTICS_ENABLED=true`
- [ ] `NEXT_PUBLIC_ANALYTICS_PROVIDER=vercel` (or chosen provider)

Configure specifically for **admin app**:
- [ ] `ADMIN_AUTH_MODE=supabase`
- [ ] `NEXT_PUBLIC_ADMIN_AUTH_MODE=supabase`
- [ ] `SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]` (Do NOT use NEXT_PUBLIC_ prefix!)

## D. Supabase Validation
- [ ] **Migrations**: All migrations applied (`001`, `002`, `003`).
- [ ] **Seeds**: No static seeds run accidentally on production.
- [ ] **RLS**: Row Level Security is ACTIVE on all tables.
- [ ] **Storage**: Bucket `vavaw-media` is created and public. Storage policies applied.
- [ ] **Admin Owner**: First owner account manually created in Supabase Auth, and corresponding UUID added to `admin_profiles` with `role = 'owner'`.

## E. Security Rules Confirmed
- [ ] Admin app is completely `noindex` (robots.txt and meta tags).
- [ ] Admin `middleware.ts` protection is active.
- [ ] Safe redirects in `apps/main` validate internal/trusted domains only.
- [ ] Service role key is safely hidden from client payload.
- [ ] Analytics privacy rules enforced (No PII).

## F. Smoke Tests
- [ ] **Homepage**: `vavaw.vn` loads, CMS data reflects correctly.
- [ ] **Cosmetic**: `/cosmetic` content blocks render correctly.
- [ ] **Beauty**: `beauty.vavaw.vn` loads static fallback perfectly.
- [ ] **Franchise**: `franchise.vavaw.vn` loads static fallback perfectly.
- [ ] **Admin Login**: `admin.vavaw.vn/login` restricts invalid credentials.
- [ ] **Admin CRUD**: Dashboard loads, CRUD forms save to Supabase successfully.
- [ ] **Media Upload**: Image uploads to `vavaw-media` succeed and URL resolves.
- [ ] **SEO**: Source code on homepage shows Supabase SEO titles.
- [ ] **Redirects**: Navigating to a `/go/[slug]` safely redirects to the expected URL.
