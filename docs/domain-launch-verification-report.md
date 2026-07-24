# Domain Launch Verification Report (Phase 55)

This report tracks the live validation of the VAVAW custom domains after the DNS switchover and Vercel assignment. 

> **Important**: This must be executed manually by the administrator in a live browser (preferably using Incognito mode) once the DNS has fully propagated.

## 1. Main Domain (`vavaw.vn`)
| Domain / Page | Expected Result | Actual Result | Issue Found | Fix Required | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `https://vavaw.vn` | Homepage loads, no broken favicons, no console errors. | | | | ⬜ Pending |
| `https://www.vavaw.vn` | Redirects to `https://vavaw.vn` or loads correctly. | | | | ⬜ Pending |
| `https://vavaw.vn/cosmetic` | Loads Cosmetic page with soft ivory styling. | | | | ⬜ Pending |
| `https://vavaw.vn/contact` | Form loads, submits successfully to Admin DB. | | | | ⬜ Pending |
| `https://vavaw.vn/sitemap.xml` | Returns valid XML with production URLs. | | | | ⬜ Pending |
| `https://vavaw.vn/robots.txt` | Returns `User-agent: * Allow: /`. | | | | ⬜ Pending |

## 2. Live Redirect Test
| URL | Expected Destination | Actual Result | Issue Found | Fix Required | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `https://vavaw.vn/go/cosmetic` | `https://vavaw.vn/cosmetic` | | | | ⬜ Pending |
| `https://vavaw.vn/go/beauty` | `https://beauty.vavaw.vn` | | | | ⬜ Pending |
| `https://vavaw.vn/go/franchise` | `https://franchise.vavaw.vn` | | | | ⬜ Pending |

## 3. Beauty & Franchise Domains
| Domain / Page | Expected Result | Actual Result | Issue Found | Fix Required | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `https://beauty.vavaw.vn` | Page loads, correct favicon, canonical URL is correct. | | | | ⬜ Pending |
| `https://franchise.vavaw.vn` | Page loads, correct favicon, canonical URL is correct. | | | | ⬜ Pending |

## 4. Admin Domain (`admin.vavaw.vn`)
| Domain / Flow | Expected Result | Actual Result | Issue Found | Fix Required | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `https://admin.vavaw.vn/login` | Login page loads securely. | | | | ⬜ Pending |
| Login via Supabase | Owner logs in successfully, session persists. | | | | ⬜ Pending |
| Media Upload | Uploading new media asset succeeds without 400 error. | | | | ⬜ Pending |
| Leads View | `/contact` submissions appear correctly. | | | | ⬜ Pending |
| Audit Logs | Actions are recorded properly. | | | | ⬜ Pending |
| `https://admin.vavaw.vn/robots.txt` | Returns `Disallow: /`. | | | | ⬜ Pending |

---
**Verification Sign-off:**
- [ ] Vercel domains are mapped and SSL certificates issued.
- [ ] Environment variables (e.g. `NEXT_PUBLIC_SITE_URL`) are active in production.
- [ ] Supabase Auth URL Configuration updated with `https://admin.vavaw.vn/**`.
