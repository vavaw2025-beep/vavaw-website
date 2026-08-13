# Production Domain SEO Audit & Optimization Report

**Date**: 2026-08-13  
**Status**: PASSED & DEPLOYMENT-READY  
**Scope**: `apps/main`, `apps/beauty`, `apps/franchise`, `apps/admin`

---

## 1. Final Production Domain Map

| Project | Deployed Vercel Domain | Production Custom Domain | Canonical Strategy | Indexing Status |
|---|---|---|---|---|
| `vavaw-main` | `vavaw-main.vercel.app` | `https://vavaw.vn` (`www.vavaw.vn`) | Apex `https://vavaw.vn` | **INDEXABLE** |
| `vavaw-beauty` | `vavaw-beauty.vercel.app` | `https://beauty.vavaw.vn` | `https://beauty.vavaw.vn` | **INDEXABLE** |
| `vavaw-franchise` | `vavaw-franchise.vercel.app` | `https://franchise.vavaw.vn` | `https://franchise.vavaw.vn` | **INDEXABLE** |
| `vavaw-admin` | `vavaw-admin.vercel.app` | `https://admin.vavaw.vn` | `https://admin.vavaw.vn` | **NOINDEX / NOFOLLOW** |

---

## 2. Hostname Redirects & Noindex Header Protection

1. **`www.vavaw.vn` $\rightarrow$ `vavaw.vn` Apex Redirect**:
   - Implemented via `apps/main/middleware.ts` (301 Permanent Redirect) + Vercel Domain forwarding.
2. **`*.vercel.app` Preview Protection**:
   - `middleware.ts` in `apps/main`, `apps/beauty`, and `apps/franchise` automatically attaches `X-Robots-Tag: noindex, nofollow` to any request served via `*.vercel.app` hostnames.
3. **Admin Portal Safety**:
   - `apps/admin/middleware.ts` enforces `X-Robots-Tag: noindex, nofollow` on all responses, and `apps/admin/app/robots.ts` restricts crawlers via `Disallow: /`.

---

## 3. Sitemap & Robots Configuration

### Main App (`https://vavaw.vn`)
- **Sitemap**: `https://vavaw.vn/sitemap.xml`
- **Active Routes**:
  - `https://vavaw.vn/`
  - `https://vavaw.vn/cosmetic`
  - `https://vavaw.vn/contact`
  - `https://vavaw.vn/cosmetic/products/luminous-revitalization-sheer-set`
  - `https://vavaw.vn/cosmetic/products/cellurevive-ampoule`
  - `https://vavaw.vn/cosmetic/products/regenaglow-nourish-sheer-cream`
  - `https://vavaw.vn/cosmetic/products/calmiance-superior-sheer-gel`
  - `https://vavaw.vn/cosmetic/products/p30-boost-facial-hydrating-toner`
  - `https://vavaw.vn/cosmetic/products/gentle-activation-renew-ampoule`
  - `https://vavaw.vn/cosmetic/products/p30-boost-facial-moisturizer`
  - `https://vavaw.vn/cosmetic/products/lumiglow-rosy-sheer-sunscreen`
- **Exclusions**: `/system-update`, `not-found`, `admin` routes, and non-canonical URLs are strictly excluded.

### Subdomains
- **Beauty**: `https://beauty.vavaw.vn/sitemap.xml` (Contains `https://beauty.vavaw.vn`)
- **Franchise**: `https://franchise.vavaw.vn/sitemap.xml` (Contains `https://franchise.vavaw.vn`)
- **Admin**: No sitemap exposed.

---

## 4. Structured Data (JSON-LD) Status

- **Organization Schema**: Rendered on root layouts for `https://vavaw.vn`, `https://beauty.vavaw.vn`, and `https://franchise.vavaw.vn`.
- **Product Schema**: Clean, compliant `ProductJsonLd` rendered on all 8 cosmetic product pages, referencing absolute canonical URLs under `https://vavaw.vn` without unverified dummy ratings or missing image URLs.

---

## 5. Manual Post-Launch Actions (Google Search Console)

1. **Add Properties in Google Search Console (GSC)**:
   - Add Domain Property or URL Prefix Properties:
     - `https://vavaw.vn`
     - `https://beauty.vavaw.vn`
     - `https://franchise.vavaw.vn`
2. **Submit Sitemaps**:
   - Submit `https://vavaw.vn/sitemap.xml`
   - Submit `https://beauty.vavaw.vn/sitemap.xml`
   - Submit `https://franchise.vavaw.vn/sitemap.xml`
   - *Do NOT submit admin URLs.*
3. **URL Inspection**:
   - Run GSC URL Inspection on `https://vavaw.vn/` and `https://vavaw.vn/cosmetic/products/luminous-revitalization-sheer-set` to request indexing.

---

## 6. Verification Curl Commands

```bash
# 1. Main Apex Domain Indexability & Sitemap
curl -I https://vavaw.vn
curl -I https://vavaw.vn/sitemap.xml
curl -I https://vavaw.vn/robots.txt

# 2. WWW Redirect Check
curl -I https://www.vavaw.vn

# 3. Preview Domain Noindex Check
curl -I https://vavaw-main.vercel.app

# 4. Beauty Subdomain
curl -I https://beauty.vavaw.vn
curl -I https://beauty.vavaw.vn/sitemap.xml

# 5. Franchise Subdomain
curl -I https://franchise.vavaw.vn
curl -I https://franchise.vavaw.vn/sitemap.xml

# 6. Admin Disallow & Noindex Check
curl -I https://admin.vavaw.vn
curl -I https://admin.vavaw.vn/robots.txt
```
