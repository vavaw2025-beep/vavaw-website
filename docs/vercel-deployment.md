# Vercel Deployment Guide

This repository is built using **pnpm** and **Turborepo**.

## Project Setup

Each app within the monorepo should be imported into Vercel as a **separate Vercel project**.

### Project Mapping

- `apps/main` -> `vavaw.vn`
- `apps/beauty` -> `beauty.vavaw.vn`
- `apps/franchise` -> `franchise.vavaw.vn`
- `apps/admin` -> `admin.vavaw.vn`

> **IMPORTANT:** The Admin app (`apps/admin`) is currently mock-auth only. It should **not** be publicly exposed until real auth middleware is implemented in a future phase.

### Vercel Project Settings (For Each App)

When importing a project in Vercel, ensure the following settings are applied:

- **Framework:** Next.js
- **Root Directory:** matching app folder (e.g., `apps/main`, `apps/beauty`, etc.)
- **Install Command:** `pnpm install`
- **Build Command:** `pnpm build`
- **Output Directory:** default (`.next`)
- **Node version:** 20.x (or latest supported LTS)

## Domain & Subdomain Setup

1. Configure `vavaw.vn` as the primary domain for the `apps/main` Vercel project.
2. For the secondary apps, configure subdomains:
   - Map `beauty.vavaw.vn` to the `apps/beauty` Vercel project.
   - Map `franchise.vavaw.vn` to the `apps/franchise` Vercel project.
   - Map `admin.vavaw.vn` to the `apps/admin` Vercel project (Keep restricted/protected).

## SEO Verification Checklist

- [ ] All public apps (`apps/main`, `apps/beauty`, `apps/franchise`) have valid `robots.txt` and `sitemap.xml`.
- [ ] Admin app (`apps/admin`) has `robots` set to `noindex, nofollow` in metadata and a `robots.txt` disallowing all to prevent accidental indexing.
- [ ] All public apps have proper OpenGraph and Twitter card metadata set.

## Rollback Checklist

If a deployment introduces critical bugs, follow these steps to rollback:

1. **Vercel Dashboard:** Navigate to the specific project in the Vercel dashboard.
2. **Deployments Tab:** Find the last known stable deployment.
3. **Instant Rollback:** Click the three dots next to the stable deployment and select **Promote to Production** (or **Assign Custom Domains** depending on Vercel's UI).
4. **Verify:** Check the live URLs to confirm the rollback was successful.
5. **Investigate:** Review logs of the failed deployment to identify and fix the issue locally before deploying again.
