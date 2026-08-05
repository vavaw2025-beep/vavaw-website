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

## Cosmetic Page Media Slots (Phase 60G)

Upload via Admin Media with:
```json
{ "purpose": "cosmetic-page-media", "slot": "<slot-name>" }
```

Recommended image size: **1400×1960px** (portrait 3:4) for product slots, **1600×1200px** (landscape 4:3) for editorial/gallery.

| Slot name | Used in | Description | Recommended size |
| :--- | :--- | :--- | :--- |
| `cosmetic-product-luminous-set` | Section 4 — Hero Product Feature (left panel) | Luminous Revitalization Sheer Set full editorial shot | 1400×1960 portrait |
| `cosmetic-product-regenaglow-cream` | Section 5 product card (future) | Regenaglow Nourish Sheer Cream | 800×800 square |
| `cosmetic-product-calmiance-gel` | Section 5 product card (future) | Calmiance Superior Sheer Gel | 800×800 square |
| `cosmetic-product-renew-ampoule` | Section 5 product card (future) | Gentle Activation Renew Ampoule | 800×800 square |
| `cosmetic-product-p30-moisturizer` | Section 5 product card (future) | P30 Boost Facial Moisturizer | 800×800 square |
| `cosmetic-product-p30-toner` | Section 5 product card (future) | P30 Boost Facial Hydrating Toner | 800×800 square |
| `cosmetic-gallery-ritual-panel` | Section 6 — Daily Ritual right panel | Product set ritual shot | 1200×1200 square |
| `cosmetic-premium-program` | Section 8 — Premium Program left panel | Spa/clinic treatment editorial | 1600×1200 landscape |
| `cosmetic-gallery-product-set` | Gallery featured (tall) | Full product set overview | 800×1200 portrait |
| `cosmetic-gallery-texture` | Gallery slot 2 | Formula/texture close-up | 800×800 square |
| `cosmetic-gallery-clinic` | Gallery slot 3 | Clinical treatment scene | 800×800 square |
| `cosmetic-gallery-packaging` | Gallery slot 4 | Premium packaging editorial | 800×800 square |
| `cosmetic-gallery-skin` | Gallery slot 5 | Model / luminous skin close-up | 800×800 square |
| `cosmetic-gallery-serum` | Gallery slot 6 | Serum / ampoule drop shot | 800×800 square |

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

> **Phase 60E Note**: Cosmetic hero image rendering confirmed working in Vercel production. Root cause was missing `CMS_DATA_SOURCE=supabase` env var in Vercel. Vercel Analytics `<Analytics />` component removed from layout to eliminate console 404 error.

> **Phase 60F Note**: `/cosmetic` lower page editorial layout fully redesigned. 9 new sections added based on VAVAW brochure product content: Brand Philosophy / RAW Skincare System, Signature Collection Overview, Hero Product Feature (Luminous Revitalization Sheer Set), Product Editorial Cards (5 products), Daily Clinical Ritual (5-step), Clinical Ingredients (8 actives), Premium Program, Editorial Gallery, Final CTA. No CMS changes. No broken images. No placeholder text exposed to visitors. Gallery section uses clean CSS gradient panels as placeholders until real product photography is uploaded via Admin.

> **Phase 62D Note**: Cosmetic CMS end-to-end verified. Admin /cosmetic-page successfully reads and updates `content_blocks` (9 blocks) and maps media uploads to the 14 named `cosmetic-page-media` slots via `media_assets` metadata.
>
> **Phase 63 Note**: Cosmetic Page Admin UX Studio completed. Built a tabbed Vietnamese administrative dashboard with specialized product/ingredient/ritual editors. Enhanced Media Slots Manager to assign existing images via a library picker, upload new assets, or remove assignments by archiving metadata without deleting files. Updated public media loader to check and ignore archived slot files.
>
> **Phase 63B Note**: Cosmetic Admin Studio Production QA completed. Verified all tabs, editors (products, ingredients repeater, ritual steps repeater), and Media Slot Manager slot unassignment/reassignment. Confirmed safe gradient fallback on unassignment and correct rendering on reassignment.
>
> **Phase 63C Note**: Cosmetic Media Upload and Replace UX Polish completed. Designed slot-contextual upload page mode, displaying slot display name, recommended size, current thumbnail (with replace warnings), local preview panel showing selected filename, size, and mime-type, alongside high-visibility success options (return redirects or open live page).
>
> **Phase 63D Note**: Cosmetic Media Population Final Pass completed. Verified that `cosmetic-product-luminous-set`, `cosmetic-premium-program`, and `cosmetic-gallery-ritual-panel` are successfully uploaded and assigned. Public `/cosmetic` page loads them properly with fallback gradients remaining only for missing optional slots. Verified unassignment and reassignment, and confirmed files remain intact in the Media Library.
>
> **Phase 63E Note**: Render Cosmetic Product Media on Public Page completed. Wired the public `/cosmetic` product cards to read and display images uploaded to the respective product slot keys. Fixed the admin preview media count logic (which was comparing the slot object to slot id string) to correctly query active media counts in the system.
>
> **Phase 63F Note**: Add Missing Cosmetic Sunscreen Product completed. Added `LUMIGLOW ROSY SHEER SUNSCREEN SPF50+/PA+++` to the public `/cosmetic` page showcase and Admin products tab list. Added a new media slot `cosmetic-product-lumiglow-sunscreen` for uploading its packshot. Created seed migration SQL `006_add_lumiglow_sunscreen_product.sql` to non-destructively append the sunscreen product to the cards block.