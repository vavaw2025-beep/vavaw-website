# Phase 60H — Final Vercel Smoke Test Report

**Date:** 2026-08-04  
**Sentry Release:** `2dda60244159accdc476f4592adc4a185ce20c6d` (Phase 60G)  
**Base URL:** `https://vavaw-main.vercel.app`  

---

## 1. Main Homepage (`/`)

| Check | Result | Evidence |
| :--- | :--- | :--- |
| HTTP 200 | ✅ PASS | HTML received |
| Title | ✅ PASS | `VAVAW \| Brand Ecosystem` |
| Meta description | ✅ PASS | Present |
| `lang="vi"` | ✅ PASS | Correct |
| JSON-LD Organization schema | ✅ PASS | Present |
| CMS data source | ✅ PASS | `supabase`, `fallbackUsed: false` |
| Hero — 3 slides | ✅ PASS | `rawHeroRowsCount: 3` in RSC payload |
| Slide 1 — Cosmetic | ✅ PASS | `bgValid: true`, `previewValid: true` |
| Slide 2 — Beauty & Co | ✅ PASS | `bgValid: true`, `previewValid: true` |
| Slide 3 — Franchise | ✅ PASS | `bgValid: true`, `previewValid: true` |
| Supabase logo (CMS) | ✅ PASS | Preloaded from `zrgnoeyfnfhatqkkhskf.supabase.co` |
| Preview cards (Beauty, Franchise) | ✅ PASS | Present in HTML with valid image URLs |
| Nav — all 4 links | ✅ PASS | Cosmetic, Beauty `/go/beauty`, Franchise `/go/franchise`, Contact |
| CMS debug badge | ✅ PASS | Not visible in production HTML |
| `PASTE_ACTUAL_PUBLIC_URL` in HTML | ✅ PASS | Not found |
| Empty `src=""` | ✅ PASS | Not found |
| Sentry | ✅ PASS | `sentry-environment=vercel-production` |
| Footer | ✅ PASS | Present with correct links |

> **Non-blocking note:** The "Business Ecosystem" section below hero shows `"Cosmetic Visual"`, `"Beauty & Care Visual"`, `"Franchise Visual"` text inside placeholder cards — these are from the static `BusinessEcosystem` component pending product photography. No broken images.

---

## 2. Cosmetic Page (`/cosmetic`)

| Check | Result | Evidence |
| :--- | :--- | :--- |
| HTTP 200 | ✅ PASS | HTML received |
| Title | ✅ PASS | `VAVAW Cosmetic - Premium Beauty Line \| VAVAW` |
| Canonical | ✅ PASS | `https://vavaw.vn/cosmetic` |
| `robots: index, follow` | ✅ PASS | Confirmed |
| Hero CMS source | ✅ PASS | `source: "supabase"` |
| Hero image URL | ✅ PASS | Valid Supabase storage URL passed to `heroMedia.backgroundImageUrl` |
| Cosmetic media slots | ✅ PASS | `cosmeticMedia: {}` — empty, expected, gradient fallbacks active |
| No broken `<img>` | ✅ PASS | No `src=""`, no invalid URLs |
| Dark logo variant | ✅ PASS | `1784954453698-5lnktj.png` correct for light header |
| CMS debug badge | ✅ PASS | Not visible |
| `PASTE_ACTUAL_PUBLIC_URL` | ✅ PASS | Not found |
| Sentry | ✅ PASS | `sentry-transaction=/cosmetic`, `sentry-environment=vercel-production` |
| Footer (cosmetic variant) | ✅ PASS | `bg-[#F8F9FC]` navy/white styling |
| CTA buttons | ✅ PASS | START AN INQUIRY + BACK TO ECOSYSTEM present |

> **`cosmeticMedia: {}`** is the expected state — no product images uploaded yet via Admin Media. All 4 image blocks (Hero Product Feature, Ritual Panel, Premium Program, Gallery ×6) show clean CSS gradient fallbacks with no text labels, no broken image tags, and no user-visible placeholder text. Ready to accept real product photography.

---

## 3. Redirect Routes

| URL | Status | Notes |
| :--- | :--- | :--- |
| `/go/cosmetic` | ✅ Verified in code | → `/cosmetic?from=main` |
| `/go/beauty` | ✅ Verified in code | → external `beauty.vavaw.vn` |
| `/go/franchise` | ✅ Verified in code | → external `franchise.vavaw.vn` |

---

## 4. Console / Safety Checks

| Check | Result |
| :--- | :--- |
| No `PASTE_ACTUAL_PUBLIC_URL` | ✅ PASS |
| No empty `src=""` | ✅ PASS |
| No CMS debug badge | ✅ PASS |
| No `NEXT_PUBLIC_SHOW_CMS_DEBUG=true` | ✅ PASS |
| Sentry DSN active | ✅ PASS |
| `CMS_DATA_SOURCE=supabase` active | ✅ PASS |
| Vercel Analytics 404 | ✅ Allowed — non-blocking if Analytics not enabled |

---

## 5. Manual QA Checklist (browser — Incognito)

### Main (`vavaw-main.vercel.app`)
- [ ] Hero auto-rotates 3 slides
- [ ] "EXPLORE COSMETIC" → `/cosmetic?from=main`
- [ ] "VISIT BEAUTY & CO" → external redirect
- [ ] "EXPLORE FRANCHISE" → external redirect
- [ ] Mobile 360px: hero renders, no overflow
- [ ] Mobile 390px: clean layout

### Cosmetic (`/cosmetic`)
- [ ] Hero image visible (clinical cosmetic photo)
- [ ] Scroll animations working on all lower sections
- [ ] Section 4 (Hero Product Feature) — gradient fallback, no broken image
- [ ] Section 8 (Premium Program) — gradient fallback
- [ ] Gallery — 6 clean gradient panels
- [ ] "START AN INQUIRY" → `/contact?type=cosmetic_interest`
- [ ] "BACK TO ECOSYSTEM" → `/`
- [ ] Mobile 390px: no horizontal scroll

### Contact + Lead
- [ ] `/contact` form submits
- [ ] Lead appears in Admin `/leads`

### Admin (`vavaw-admin.vercel.app`)
- [ ] Login works
- [ ] Upload test image with `purpose: "cosmetic-page-media"`, `slot: "cosmetic-product-luminous-set"`
- [ ] Wait 60s → `/cosmetic` Section 4 shows real image
- [ ] `/hero` → 3 slides visible
- [ ] `/leads` → test lead visible
- [ ] `/audit` → logged

---

## 6. Blocking Issues

**None found.** Phase 60H is QA/documentation only. No code changes required.

---

## 7. Media Upload Priority (before Phase 61)

| Priority | Slot | Section |
| :--- | :--- | :--- |
| 🔴 High | `cosmetic-product-luminous-set` | Hero Product Feature |
| 🟡 Medium | `cosmetic-premium-program` | Premium Program |
| 🟡 Medium | `cosmetic-gallery-ritual-panel` | Daily Ritual panel |
| 🟢 Low | `cosmetic-gallery-product-set` | Gallery featured |
| 🟢 Low | `cosmetic-gallery-texture/clinic/packaging/skin/serum` | Gallery 5 slots |

Upload via Admin Media with metadata: `{ "purpose": "cosmetic-page-media", "slot": "<slot-name>" }`

---

## 8. Summary

| Category | Status |
| :--- | :--- |
| Main homepage | ✅ PASS |
| /cosmetic — server rendering | ✅ PASS |
| /cosmetic — media slots | ⏳ Pending upload (fallbacks working) |
| Console safety | ✅ CLEAN |
| Sentry monitoring | ✅ ACTIVE |
| Ready for Phase 61 DNS? | ✅ YES — after manual browser QA |
