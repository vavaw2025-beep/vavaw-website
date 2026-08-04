# Phase 61 — Custom Domain DNS Switchover Guide

**Health check (2026-08-04):** `{ ok: true, app: "main", version: "fea1443" }`  
**Status before DNS:** All automated smoke tests PASS. Ready for switchover.

---

## STEP 0 — Pre-Launch Checklist (verify before touching DNS)

Run these checks yourself in a browser (Incognito mode):

| # | Check | Expected | Done? |
| :-- | :-- | :-- | :-- |
| 1 | `vavaw-main.vercel.app` loads | HTTP 200, 3 hero slides | ☐ |
| 2 | `vavaw-main.vercel.app/cosmetic` loads | Hero image visible | ☐ |
| 3 | `vavaw-admin.vercel.app` login works | Supabase login, dashboard loads | ☐ |
| 4 | `NEXT_PUBLIC_SHOW_CMS_DEBUG` | Not visible on public pages | ☐ |
| 5 | `CMS_DATA_SOURCE=supabase` | Confirm in Vercel → vavaw-main → Settings → Environment Variables | ☐ |
| 6 | All 4 Vercel projects show "Ready" | Vercel Dashboard | ☐ |
| 7 | Cosmetic lower sections | Gradient fallbacks clean (no broken images) | ☐ |

> **Minimum acceptable:** Items 1–6 must all pass. Item 7 is acceptable as gradient fallback.

---

## STEP 1 — Add Domains to Vercel Projects

Go to **Vercel Dashboard** → each project → **Settings → Domains → Add**.

### 1A. Project: `vavaw-main`
Add these domains:
```
vavaw.vn
www.vavaw.vn
```

### 1B. Project: `vavaw-beauty`
Add:
```
beauty.vavaw.vn
```

### 1C. Project: `vavaw-franchise`
Add:
```
franchise.vavaw.vn
```

### 1D. Project: `vavaw-admin`
Add:
```
admin.vavaw.vn
```

> After adding each domain, Vercel will display the **required DNS records**. Copy them exactly.

---

## STEP 2 — Configure DNS Records at Your DNS Provider

Log in to your DNS provider (where `vavaw.vn` is registered — likely Tên Miền Việt Nam, Matbao, or Cloudflare).

### Root domain: `vavaw.vn`
Vercel will give you one of these options:

**Option A — A Record (most common):**
```
Type:  A
Name:  @  (or blank for root)
Value: 76.76.21.21
TTL:   3600 (or Auto)
```

**Option B — ALIAS/ANAME (if your provider supports it):**
```
Type:  ALIAS (or ANAME)
Name:  @
Value: cname.vercel-dns.com
TTL:   3600
```

### Subdomain: `www.vavaw.vn`
```
Type:  CNAME
Name:  www
Value: cname.vercel-dns.com
TTL:   3600
```

### Subdomain: `beauty.vavaw.vn`
```
Type:  CNAME
Name:  beauty
Value: cname.vercel-dns.com
TTL:   3600
```

### Subdomain: `franchise.vavaw.vn`
```
Type:  CNAME
Name:  franchise
Value: cname.vercel-dns.com
TTL:   3600
```

### Subdomain: `admin.vavaw.vn`
```
Type:  CNAME
Name:  admin
Value: cname.vercel-dns.com
TTL:   3600
```

> ⚠️ **Use the exact values Vercel shows you** — the CNAME target may differ per project or region. The values above are the standard Vercel DNS values but always confirm in Vercel Dashboard.

> ⚠️ **Do NOT change other existing DNS records** (MX, TXT, SPF, etc.) unless Vercel explicitly asks you to.

---

## STEP 3 — Wait for DNS Propagation

- DNS propagation: typically **5–60 minutes**, sometimes up to **24 hours**
- Vercel SSL certificate: automatically issued via Let's Encrypt once DNS propagates
- In Vercel Dashboard, the domain status will change from ⚠️ `Pending` → ✅ `Valid`

**Check propagation:**
```
https://dnschecker.org/#A/vavaw.vn
https://dnschecker.org/#CNAME/beauty.vavaw.vn
```

---

## STEP 4 — Update Supabase Auth Redirect URLs

Go to **Supabase Dashboard → Authentication → URL Configuration**.

**Add to "Redirect URLs":**
```
https://admin.vavaw.vn
https://admin.vavaw.vn/**
```

**Site URL** (if not already set):
```
https://admin.vavaw.vn
```

> This is required for the Admin login to work correctly on the custom domain.

---

## STEP 5 — Verify Vercel Environment Variables

For each project, confirm these env vars in **Vercel → Settings → Environment Variables**:

### `vavaw-main`
| Variable | Value | Required |
| :-- | :-- | :-- |
| `CMS_DATA_SOURCE` | `supabase` | ✅ Must be set |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://zrgnoeyfnfhatqkkhskf.supabase.co` | ✅ Must be set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (anon key) | ✅ Must be set |
| `NEXT_PUBLIC_SHOW_CMS_DEBUG` | not set / `false` | ✅ Must NOT be `true` |
| `NEXT_PUBLIC_SITE_URL` | `https://vavaw.vn` | Recommended |

### `vavaw-admin`
| Variable | Value |
| :-- | :-- |
| `NEXT_PUBLIC_SUPABASE_URL` | (same as above) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (same as above) |
| `SUPABASE_SERVICE_ROLE_KEY` | (service role key — secret) |

---

## STEP 6 — Post-Domain Live Smoke Test

Once SSL shows ✅ Valid in Vercel, open a browser (Incognito) and test:

### Main (`vavaw.vn`)
- [ ] `https://vavaw.vn` — loads, HTTPS lock icon
- [ ] `https://www.vavaw.vn` — loads or redirects to `vavaw.vn`
- [ ] `https://vavaw.vn/cosmetic` — cosmetic page loads with hero image
- [ ] `https://vavaw.vn/contact` — contact form visible
- [ ] `https://vavaw.vn/go/cosmetic` — redirects to `/cosmetic`
- [ ] `https://vavaw.vn/go/beauty` — redirects to `https://beauty.vavaw.vn`
- [ ] `https://vavaw.vn/go/franchise` — redirects to `https://franchise.vavaw.vn`
- [ ] `https://vavaw.vn/sitemap.xml` — valid XML, URLs use `vavaw.vn`
- [ ] `https://vavaw.vn/robots.txt` — `Allow: /`
- [ ] Hero 3 slides auto-rotate

### Beauty (`beauty.vavaw.vn`)
- [ ] `https://beauty.vavaw.vn` — loads, HTTPS
- [ ] Title tag correct
- [ ] Footer correct
- [ ] Lead form visible

### Franchise (`franchise.vavaw.vn`)
- [ ] `https://franchise.vavaw.vn` — loads, HTTPS
- [ ] Title tag correct
- [ ] Lead form visible

### Admin (`admin.vavaw.vn`)
- [ ] `https://admin.vavaw.vn/login` — login page loads
- [ ] Login with Supabase credentials works → dashboard
- [ ] `/hero` — 3 slides visible
- [ ] `/media` — upload test image → succeeds
- [ ] `/leads` — test leads visible
- [ ] `/audit` — login recorded
- [ ] `https://admin.vavaw.vn/robots.txt` — `Disallow: /`

### Contact Lead Test
- [ ] Submit contact form at `https://vavaw.vn/contact`
- [ ] Lead appears in Admin `/leads`

---

## STEP 7 — Rollback Procedure (if needed)

If any domain has a critical issue:
1. Go to **Vercel → Project → Settings → Domains**
2. Remove the affected custom domain
3. The `.vercel.app` URL immediately becomes the active fallback
4. Fix the issue, re-add the domain

DNS rollback (if needed):
- Delete or disable the CNAME/A record at your DNS provider
- `vavaw-main.vercel.app` remains accessible at all times

---

## Summary

| Domain | Vercel Project | DNS Type | Status |
| :-- | :-- | :-- | :-- |
| `vavaw.vn` | `vavaw-main` | A record `76.76.21.21` | ⬜ Pending |
| `www.vavaw.vn` | `vavaw-main` | CNAME `cname.vercel-dns.com` | ⬜ Pending |
| `beauty.vavaw.vn` | `vavaw-beauty` | CNAME `cname.vercel-dns.com` | ⬜ Pending |
| `franchise.vavaw.vn` | `vavaw-franchise` | CNAME `cname.vercel-dns.com` | ⬜ Pending |
| `admin.vavaw.vn` | `vavaw-admin` | CNAME `cname.vercel-dns.com` | ⬜ Pending |

> After DNS propagates and SSL is valid for all 5 domains → update `docs/domain-launch-verification-report.md` with actual results and fill in the post-domain smoke test results.
