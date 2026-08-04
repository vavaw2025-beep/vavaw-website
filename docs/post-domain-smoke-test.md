# VAVAW Post-Domain Smoke Test Checklist (Phase 61)

Execute these checks immediately following the DNS switch to the custom production domains (Phase 61). You can use the template at `docs/domain-launch-verification-report.md` to track your progress.

## 1. Public Main Portal (`vavaw.vn`)
- [ ] Verify `https://vavaw.vn` loads the homepage securely (HTTPS lock icon).
- [ ] Verify `https://www.vavaw.vn` redirects to `https://vavaw.vn`.
- [ ] Verify `/cosmetic` loads properly with the Korean luxury visual theme.
- [ ] Navigate to `/contact` and submit a test lead.
- [ ] Verify redirect `/go/cosmetic` works.
- [ ] Verify redirect `/go/beauty` works.
- [ ] Verify redirect `/go/franchise` works.
- [ ] Verify favicon loads in browser tab.
- [ ] Verify `https://vavaw.vn/sitemap.xml` loads valid XML.
- [ ] Verify `https://vavaw.vn/robots.txt` loads and allows crawling (`Allow: /`).

## 2. Beauty & Spa (`beauty.vavaw.vn`)
- [ ] Verify `https://beauty.vavaw.vn` loads securely.
- [ ] Verify elegant UI loads properly.
- [ ] Submit a test booking request via the lead form (if present).
- [ ] Verify footer renders with correct `beauty` variant.
- [ ] Verify metadata title and description are present.
- [ ] Verify favicon loads.

## 3. Franchise Hub (`franchise.vavaw.vn`)
- [ ] Verify `https://franchise.vavaw.vn` loads securely.
- [ ] Verify professional/investment-ready UI loads properly.
- [ ] Submit a test franchise application via the lead form (if present).
- [ ] Verify footer renders with correct `franchise` variant.
- [ ] Verify metadata title and description are present.
- [ ] Verify favicon loads.

## 4. Admin Dashboard (`admin.vavaw.vn`)
- [ ] Verify `https://admin.vavaw.vn/login` loads securely.
- [ ] Attempt to log in using Owner/Admin credentials via Supabase Auth.
- [ ] Dashboard loads successfully without 401/403 errors.
- [ ] Navigate to **Media**, verify images/videos load and an upload works.
- [ ] Navigate to **Leads**, verify the test leads from Main, Beauty, and Franchise appear.
- [ ] Navigate to **Audit Logs**, verify your login, media upload, and any other operations are recorded.
- [ ] Navigate to **Users**, verify the team list loads.
- [ ] Check page source or `https://admin.vavaw.vn/robots.txt` to confirm it explicitly disallows crawling (`Disallow: /`) and has `noindex, nofollow` metadata.

## Phase 60 Update
- [x] Vercel production env and debug cleanup ready.

## Phase 60H — Vercel Smoke Test (2026-08-04, automated)

### Main Homepage (`vavaw-main.vercel.app`)
- [x] HTTP 200 — page loads
- [x] 3 CMS hero slides — all active with valid Supabase image URLs
- [x] `dataSource: "supabase"`, `fallbackUsed: false`
- [x] No `PASTE_ACTUAL_PUBLIC_URL` in HTML
- [x] No empty `src=""` in HTML
- [x] CMS debug badge not visible
- [x] Sentry active — `sentry-environment=vercel-production`
- [x] Nav links correct (Cosmetic, Beauty, Franchise, Contact)
- [ ] Manual: hero auto-rotate verified in browser
- [ ] Manual: CTA redirect to `/cosmetic?from=main`
- [ ] Manual: mobile 360/390px layout

### Cosmetic Page (`/cosmetic`)
- [x] HTTP 200 — page loads
- [x] Title: `VAVAW Cosmetic - Premium Beauty Line | VAVAW`
- [x] Canonical: `https://vavaw.vn/cosmetic`
- [x] `robots: index, follow`
- [x] Hero CMS source: `supabase`
- [x] Hero `backgroundImageUrl` valid Supabase URL
- [x] `cosmeticMedia: {}` — empty, expected, gradient fallbacks active (no broken images)
- [x] No placeholder text visible
- [x] Dark logo variant correct
- [x] Footer cosmetic variant correct
- [x] CTA buttons present
- [ ] Manual: hero image visible in browser
- [ ] Manual: lower section scroll animations
- [ ] Manual: mobile 390px no horizontal scroll

### Redirects
- [x] `/go/cosmetic` → `/cosmetic?from=main` (code verified)
- [x] `/go/beauty` → external redirect (code verified, no CORS prefetch)
- [x] `/go/franchise` → external redirect (code verified)

### Blocking issues
- None found. No code changes required.

### Media upload TODO (before Phase 61 DNS)
- [ ] Upload `cosmetic-product-luminous-set` → Section 4 image (HIGH)
- [ ] Upload `cosmetic-premium-program` → Section 8 image (MEDIUM)
- [ ] Upload gallery slots if product photography available (LOW)

See full automated report: `docs/vercel-smoke-test-phase-60h.md`
