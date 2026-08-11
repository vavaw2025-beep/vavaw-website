# Phase 75A: Cosmetic Final Production QA and Launch Checklist

**Goal:** Perform a final production QA audit for the entire VAVAW Cosmetic experience before launch.

## 1. Public Cosmetic Overview QA ✅
**Route:** `/cosmetic`
- [x] Page loads successfully without errors.
- [x] Hero image/video loads or fallback renders safely.
- [x] No empty `src` warnings or `/PASTE` URLs found in codebase logic.
- [x] No visible CMS debug overlay (guarded strictly by `NEXT_PUBLIC_SHOW_CMS_DEBUG=true`).
- [x] No horizontal overflow on mobile viewports.
- [x] Final CTA appears above the footer and integrates smoothly.
- [x] All 8 main sections render correctly: Brand Philosophy, Signature Collection, Luminous Set, Clinical Formula, Ingredient Intelligence, Skin Ritual Finder, Professional Spa Program, Final CTA, and Footer.

## 2. Product Landing Route QA ✅
**Routes:**
1. `/cosmetic/products/luminous-revitalization-sheer-set`
2. `/cosmetic/products/cellurevive-ampoule`
3. `/cosmetic/products/regenaglow-nourish-sheer-cream`
4. `/cosmetic/products/calmiance-superior-sheer-gel`
5. `/cosmetic/products/p30-boost-facial-hydrating-toner`
6. `/cosmetic/products/gentle-activation-renew-ampoule`
7. `/cosmetic/products/p30-boost-facial-moisturizer`
8. `/cosmetic/products/lumiglow-rosy-sheer-sunscreen`

**Verifications:**
- [x] Pages load successfully using the reusable `ProductLandingPage` template.
- [x] One H1 element per page.
- [x] Breadcrumbs back to `/cosmetic` are active and valid.
- [x] JSON-LD is correctly rendered and includes `WebPage`, `BreadcrumbList`, `Product`, and `Brand`.
- [x] JSON-LD safely omits `offers`, `price`, `aggregateRating`, and `review`.
- [x] Canonical URLs strictly use `https://vavaw.vn` and do not leak `vercel.app` or `localhost`.
- [x] No empty `src` or `/PASTE` values in structured data images.

## 3. Internal Linking QA ✅
**Checks:**
- [x] Luminous Set "Xem chi tiết" links properly to `/cosmetic/products/luminous-revitalization-sheer-set`.
- [x] Clinical Formula Lab routes to specific product URLs accurately (REGENAGLOW, Calmiance, Renew Ampoule, P30 Toner, P30 Moisturizer, Lumiglow).
- [x] CELLUREVIVE links strictly direct to `/cosmetic/products/cellurevive-ampoule`.

## 4. CTA and Lead Query QA ✅
**Checks:**
Verified that `href` strings include precise query parameters for accurate tracking and mapping:
- [x] Final Cosmetic CTA: `/contact?type=cosmetic_interest&source=final_cta`
- [x] Luminous Set: `/contact?type=cosmetic_interest&product=luminous_set&source=product_landing`
- [x] CELLUREVIVE: `/contact?type=cosmetic_interest&product=cellurevive_ampoule&source=product_landing`
- [x] REGENAGLOW: `/contact?type=cosmetic_interest&product=regenaglow_cream&source=product_landing`
- [x] Calmiance: `/contact?type=cosmetic_interest&product=calmiance_gel&source=product_landing`
- [x] P30 Toner: `/contact?type=cosmetic_interest&product=p30_toner&source=product_landing`
- [x] Renew Ampoule: `/contact?type=cosmetic_interest&product=renew_ampoule&source=product_landing`
- [x] P30 Moisturizer: `/contact?type=cosmetic_interest&product=p30_moisturizer&source=product_landing`
- [x] Lumiglow: `/contact?type=cosmetic_interest&product=lumiglow_sunscreen&source=product_landing`
- [x] Skin Ritual Finder preserves core `type=cosmetic_interest`.

## 5. Admin Cosmetic Page QA ✅
**Route:** `apps/admin/app/cosmetic-page`
- [x] Admin routes require auth and have strict `robots: noindex, nofollow` metadata.
- [x] Cosmetic Page Admin Studio loads safely.
- [x] Product landing blocks are isolated to the "Landing sản phẩm" tab.
- [x] "Landing sản phẩm" displays all 8 cards accurately.
- [x] Blocks do not heavily skew the media metrics tracking.

## 6. CMS Save/Revalidation QA ✅
- [x] Revalidation calls accurately target product paths for DB saves.
- [x] Updates seamlessly reflect on the UI upon cache invalidation.

## 7. Media QA ✅
- [x] Fallbacks successfully load where media slots are missing.
- [x] No `empty src` bugs.
- [x] Active media metrics successfully read.

## 8. SEO QA ✅
- [x] Unique metadata per product route.
- [x] `sitemap.ts` includes `/`, `/cosmetic`, `/contact`, and the 8 product paths securely mapped to `https://vavaw.vn`.
- [x] `robots.ts` in Main app allows public crawling (`allow: /`).
- [x] `robots.ts` in Admin app completely disallows crawling (`allow` removed, `sitemap` removed).
- [x] `metadata.icons` configured correctly to `favicon.ico` without placeholder commits.

## 9. Repo Search Cleanup ✅
**Grep Search completed across repo:**
- [x] `PASTE_`: Exists only securely within URL fallback guards returning `false` or omitting images. No public leak.
- [x] `localhost` / `vercel.app`: Found in local `targetUrl` routing for previews or `health` API. Not present in Canonical or SEO blocks.

## 10. Build Verification ✅
- [x] `pnpm build` verified 100% successful across all 4 packages (Main, Beauty, Franchise, Admin).

## Conclusion
**STATUS: PASS ✅** 
The entire Cosmetic module and product landing ecosystem are completely ready for production deployment. No outstanding blocking bugs or SEO leaks remain.
