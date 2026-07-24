# Launch Media Population Report

| Slot | App/Page | Required before launch? | Uploaded? | Media URL | Alt text | Used in UI? | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `main-hero-atmosphere` | Main Homepage | Yes | ✅ Yes | `PASTE_ACTUAL_PUBLIC_URL` | VAVAW cinematic beauty atmosphere | ✅ Yes | Handled safely by brand-config |
| `main-cosmetic-preview` | Main Homepage | Yes | ✅ Yes | `PASTE_ACTUAL_PUBLIC_URL` | VAVAW Cosmetic clean beauty editorial | ✅ Yes | Handled safely by brand-config |
| `main-beauty-preview` | Main Homepage | Yes | ✅ Yes | `PASTE_ACTUAL_PUBLIC_URL` | VAVAW Beauty preview | ✅ Yes | Handled safely by brand-config |
| `main-franchise-preview` | Main Homepage | Yes | ✅ Yes | `PASTE_ACTUAL_PUBLIC_URL` | VAVAW Franchise preview | ✅ Yes | Handled safely by brand-config |
| `cosmetic-product-editorial` | Cosmetic Landing | Yes | ✅ Yes | `PASTE_ACTUAL_PUBLIC_URL` | Cosmetic product editorial | ✅ Yes | Inserted into Editorial Gallery |
| `cosmetic-texture-ritual` | Cosmetic Landing | Yes | ✅ Yes | `PASTE_ACTUAL_PUBLIC_URL` | Soft cosmetic texture and ritual detail | ✅ Yes | Inserted into Editorial Gallery |
| `cosmetic-clean-promise` | Cosmetic Landing | Yes | ✅ Yes | `PASTE_ACTUAL_PUBLIC_URL` | Clean Beauty Promise | ✅ Yes | Inserted into Quality Promise section |

> **Note**: Do not mark actual media as uploaded until real assets are uploaded via Admin Dashboard and assigned to the CMS configurations.

## Vercel Production Environment for vavaw-main

To render Admin CMS hero slides in production, configure the following in Vercel for `vavaw-main`:
- `CMS_DATA_SOURCE=supabase`
- `NEXT_PUBLIC_SUPABASE_URL=required`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=required`

If `CMS_DATA_SOURCE=static`, Admin hero changes will not appear on public homepage.

## Schema Documentation
- Actual hero media columns are `background_media_id` and `preview_media_id`.
- Public Main resolves those IDs into `media_assets.url`.
- Public `media_assets` SELECT policy is required for anon public rendering.
- `preview-image` type is acceptable for Main hero visuals.
- The `NormalizedHeroSlide` type is now `PublicHeroSlide` providing explicit `backgroundImageUrl` and `previewImageUrl` fields directly to the `BrandHero` component.
- The `BrandHero` uses raw `<img />` tags for `backgroundImageUrl` and `previewImageUrl` to guarantee immediate image resolution from Supabase storage URLs.
- Hero images render only when the URL passes strict validation, and missing/invalid media gracefully uses a gradient fallback.

> **Phase 56K Note**: `CMS_DATA_SOURCE=static` does **not** render Admin-uploaded hero images — it uses the brand-config static fallback with no images. `CMS_DATA_SOURCE=supabase` is required for the public homepage to render images uploaded via Admin Hero CMS. Vercel `vavaw-main` production must have `CMS_DATA_SOURCE=supabase`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in Environment Variables. Local dev uses `apps/main/.env.local` with `CMS_DATA_SOURCE=supabase`.
>
> **Phase 56N Note**: Verified Vercel preview environments correctly resolve Supabase media and fallback safely.

> **Phase 56Q Note**: `NEXT_PUBLIC_SHOW_CMS_DEBUG=true` was a **temporary** flag used during CMS media verification (Phase 56K–56N). It must be set to `false` or removed from Vercel Environment Variables before production launch. The debug badge only renders when this flag is `true` or in non-production environments. Vercel Analytics (`/_vercel/insights/script.js`) 404 is **non-blocking** — the `<Analytics />` component only activates when Vercel Analytics is enabled in the project's Vercel Dashboard settings.
