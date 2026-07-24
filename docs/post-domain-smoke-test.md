# VAVAW Post-Domain Smoke Test Checklist

Execute these checks immediately following the DNS switch to the custom production domains.

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
