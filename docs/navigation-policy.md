# Navigation Policy & Guardrails

This document outlines the navigation policy across VAVAW applications to prevent client-side routing hydration hangs, stale React Server Components (RSC) states, and dark overlay freezes.

## 1. CMS-Heavy Routes (Document Navigation)
Routes that depend heavily on CMS data must use **document navigation** (`<a href>` or `window.location.href`) instead of SPA transitions (`router.push` or Next.js `<Link>`). This bypasses stale RSC payloads and ensures that server-rendered HTML is immediately presented.

**Affected Routes:**
- `/`
- `/cosmetic`
- `/cosmetic/products/*`
- `/system-update*`

## 2. Lightweight Internal Routes (Next Link)
Simple, static, or non-CMS-heavy internal routes may safely use SPA transitions via Next `<Link>` to provide a seamless transition experience.

**Affected Routes:**
- `/contact`
- `/contact?...`

## 3. External Domains
External domains must **not** use `router.push`. Navigation to external sites or cross-subdomain apps must always use a full document navigation.

## 4. Fallback Links (Beauty / Franchise)
The Beauty and Franchise domains are currently under development. Any navigation pointing to these domains must trigger the system fallback page (`/system-update`). 
- `https://beauty.vavaw.vn` -> `/system-update`
- `https://franchise.vavaw.vn` -> `/system-update`
- `/go/beauty` and `/go/franchise` are backward-compatible routes only and should not be used as final CTA targets.

## 5. Route Transition Overlay
If the global route transition dark overlay is active, it must:
- **Never** trigger for document navigation
- **Never** trigger for `/system-update` or fallback links
- **Never** trigger for external URLs

## 6. Static Audit
To prevent the reintroduction of SPA routing bugs, search the codebase periodically for these risky patterns:
- `grep -r 'router.push("http' .`
- `grep -r "router.push('http" .`
- `grep -r 'router.push("https' .`
- `grep -r "router.push('/cosmetic/products" .`
- `grep -r 'window.location' .`
- `grep -r 'href="#"' .`
- `grep -r 'href=""' .`
