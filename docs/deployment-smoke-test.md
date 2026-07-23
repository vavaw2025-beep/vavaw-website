# Deployment Smoke Test Checklist

Use this checklist immediately after deploying to the production environment to verify the integrity of the VAVAW ecosystem.

## 1. Main App (`vavaw.vn`)
- [ ] homepage loads
- [ ] hero renders
- [ ] `CMS_DATA_SOURCE=static` works
- [ ] `CMS_DATA_SOURCE=supabase` works or falls back safely
- [ ] `/cosmetic` loads
- [ ] `/go/cosmetic` redirects safely
- [ ] `/go/beauty` redirects safely
- [ ] `/go/franchise` redirects safely
- [ ] unsafe redirect is rejected

## 2. Beauty App (`beauty.vavaw.vn`)
- [ ] homepage loads
- [ ] static fallback works
- [ ] CMS mode works or falls back safely
- [ ] metadata renders

## 3. Franchise App (`franchise.vavaw.vn`)
- [ ] homepage loads
- [ ] static fallback works
- [ ] CMS mode works or falls back safely
- [ ] metadata renders

## 4. Admin App (`admin.vavaw.vn`)
- [ ] `/login` loads
- [ ] production mock warning does not appear when auth mode is supabase
- [ ] protected routes redirect to `/login` when logged out
- [ ] owner can log in
- [ ] owner can access `/business`, `/hero`, `/media`, `/seo`, `/content`, `/users`
- [ ] admin/editor/viewer permissions behave correctly
- [ ] media upload works
- [ ] user cannot disable last owner

## 5. SEO Verification
- [ ] public pages are indexable (no `noindex` inadvertently enabled)
- [ ] admin pages are `noindex`/`nofollow`
- [ ] sitemap works on public apps
- [ ] robots.txt works on public apps

## 6. Analytics Verification
- [ ] disabled by default
- [ ] no client errors on load
- [ ] console provider only logs in development (no logs in production client unless intentionally configured)

### 7. Revalidation Smoke Test (Phase 32)
Ensure that REVALIDATION_SECRET and CMS_REVALIDATION_ENABLED=true are configured.
- [ ] Make a minor edit to a Hero slide via the Admin Dashboard.
- [ ] Verify that a cms_revalidation_triggered analytics event is logged (if configured).
- [ ] Hard refresh the main app homepage (https://vavaw.vn/).
- [ ] Verify that the hero slide update is immediately visible without waiting for a revalidate timeout.
- [ ] Revert the hero slide edit.
