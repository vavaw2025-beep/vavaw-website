# Main & Cosmetic Public Link Audit

**Status:** In Progress
**Scope:** `apps/main/` including `/`, `/cosmetic`, `/cosmetic/products/*`

## Approved Link Policy

### Internal Allowed Routes
- `/`
- `/cosmetic`
- `/contact`
- `/go/cosmetic` (legacy redirect)
- `/system-update`
- 8 explicit cosmetic product slugs:
  - `/cosmetic/products/luminous-revitalization-sheer-set`
  - `/cosmetic/products/cellurevive-ampoule`
  - `/cosmetic/products/regenaglow-nourish-sheer-cream`
  - `/cosmetic/products/calmiance-superior-sheer-gel`
  - `/cosmetic/products/p30-boost-facial-hydrating-toner`
  - `/cosmetic/products/gentle-activation-renew-ampoule`
  - `/cosmetic/products/p30-boost-facial-moisturizer`
  - `/cosmetic/products/lumiglow-rosy-sheer-sunscreen`

### 2. External Approvals

- `https://vavaw.vn`
- `https://beauty.vavaw.vn`
- `https://franchise.vavaw.vn`

### 3. Cross-App CTA Navigation Policy

- **Internal Routes**: Use Next.js `<Link>`.
- **Cross-app VAVAW Domains**: Use standard `<a>` anchor tags. Do not use Next `<Link>` or `router.push()` for external domains to prevent Next.js from intercepting the click and causing a blank/dark loading state hang.
- **Legacy Routes**: `/go/beauty` and `/go/franchise` are no longer approved as final CTA `href`s. They remain only as backward-compatible fallback paths.
- **Normalization**: Any un-updated CMS row returning `/go/beauty` or `/go/franchise` will be dynamically normalized to their production domain by `resolvePublicHref` at render time.

---

## Static Link Audit Table

| Page / Component | CMS / Hardcoded | Link Label / Context | Current Href | Link Type | Status | Recommended Final Href | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `UnavailableLandingPage` | Hardcoded | "Về trang chủ" | `/` | CTA | **approved** | `/` | System fallback home |
| `UnavailableLandingPage` | Hardcoded | "Liên hệ hỗ trợ" | `/contact?type=general_inquiry&source=system_update` | CTA | **approved** | `/contact?type=general_inquiry&source=system_update` | Safe contact |
| `UnavailableLandingPage` | Hardcoded | "Khám phá Cosmetic" | `/cosmetic` | CTA | **approved** | `/cosmetic` | Safe route |
| `BrandHero` | CMS `hero_slides` | Hero CTA | `heroSlide.ctaLink` | CTA | **fallback-required** | `resolvePublicHref(...)` | Wrap all CMS variables |
| `BusinessEcosystem` | CMS `business_entries` | Brand Cards | `entry.redirectPath` | CTA | **fallback-required** | `resolvePublicHref(...)` | Map internal `/go/*` links safely |
| `Header` / `SiteHeader` | Hardcoded / Config | Logo, Nav Links | `/`, `/cosmetic`, `https://beauty.vavaw.vn`, `https://franchise.vavaw.vn`, `/contact` | Nav | **approved** | (leave as is) | Only approved core nav links |
| `MainLanding: Final CTA` | CMS `content_blocks` | Primary / Secondary | `ctaContent.primaryCtaHref`, `secondaryCtaHref` | CTA | **fallback-required** | `resolvePublicHref(...)` | Fallback if incomplete |
| `CosmeticLanding: FeaturedCollection` | CMS `content_blocks` | Collection CTA | `featCta` | CTA | **fallback-required** | `resolvePublicHref(...)` | |
| `CosmeticLanding: ClinicalFormulaLab` | CMS `content_blocks` | Product Cards | `getProductLandingHref(...)` | Product | **fallback-required** | `resolvePublicHref(...)` | Ensure dynamic slugs match the 8 approved |
| `CosmeticLanding: PremiumProgram` | CMS `content_blocks` | Premium CTA | `premiumProgram.ctaHref` | CTA | **fallback-required** | `resolvePublicHref(...)` | |
| `CosmeticLanding: Final CTA` | CMS `content_blocks` | Final CTAs | `finalCta.ctaHref` | CTA | **fallback-required** | `resolvePublicHref(...)` | |
| `ProductLandingPage` (General) | CMS `content_blocks` | Breadcrumb | `/cosmetic` | Nav | **approved** | `/cosmetic` | |
| `ProductLandingPage` (General) | CMS `content_blocks` | Hero / Ritual / Spa Bridge CTAs | `content.ctaHref`, `content.spaBridge.ctaHref` | CTA | **fallback-required** | `resolvePublicHref(...)` | Wrap all |
| `SiteFooter` | Hardcoded Config | Facebook, Instagram, Booking, Maps | External | External | **fallback-required** | `/system-update` | All external socials/booking unapproved! |
| `SiteFooter` | Hardcoded Config | Terms, Privacy | Legal | Legal | **fallback-required** | `/system-update` | Pages not built |

---

## User Review Workflow

1. **Review**: Check the audit table and current `APPROVED_PUBLIC_LINKS` policy.
2. **Approve**: If you mark a link as approved, it will be added to the `APPROVED_PUBLIC_LINKS` constant or its final CMS URL will be configured.
3. **Fallback Enforced**: Any link that is **not approved**, is empty, or points to `#` will be forcefully routed to `/system-update?reason=coming-soon`.
4. **No Destructive Updates**: CMS data is NOT overwritten. We resolve the link safely at render time and attach `data-original-href` so intent is not lost.

> **CRITICAL RULE**: "CTA chưa hoàn thành không được để href trống hoặc #. CTA chưa sẵn sàng phải trỏ về /system-update?reason=coming-soon&from=..."
