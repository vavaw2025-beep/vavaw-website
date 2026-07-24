# Main & Cosmetic Final Content Plan

This document outlines the final production-ready content structure, brand direction, and media placeholder strategies for the VAVAW Main portal and the internal Cosmetic landing page (Phase 54).

## 1. Main Homepage (`vavaw.vn`)

### Structure & Content
- **Brand Hero Carousel**: Displays cinematic, premium messaging for each branch of the ecosystem (Cosmetic, Beauty, Franchise). 
  - **H1 SEO Strategy**: Only one `H1` is active per slide, providing clear SEO hierarchy.
  - **Copy**: Refined to feel less like a SaaS product and more like a luxury lifestyle brand.
- **Business Ecosystem Section**: A new section located below the hero. Uses minimalist cards to define the three pillars of VAVAW.
  - **Cosmetic**: "Clinical Korean cosmetic ritual."
  - **Beauty & Co**: "Sanctuary for skin and self."
  - **Franchise**: "Build with the VAVAW ecosystem."
- **Footer**: Uses the `main` variant (slate/black tones).

### Media Slots Needed
- **Hero Atmosphere Images**: Cinematic, dark-overlay backgrounds for the slider.
- **Preview Cards**: Three distinct images representing Cosmetic, Beauty, and Franchise (Recommended size: 1600x2000, 4:5). 
- *Current State (Phase 56D)*: Handled via elegant gradient placeholders and premium abstract designs if real assets are missing, avoiding broken UI. Mobile layout optimized for stacking.

## 2. Cosmetic Page (`vavaw.vn/cosmetic`)

### Structure & Content
- **Hero**: Serene, clinical beauty atmosphere. Background uses white/cool grey if images fail.
- **Brand Story**: "Clinical Korean Cosmetic" - Explains the philosophy behind the cosmetic line without making medical claims.
- **Product Highlights**: Three core pillars (Skincare Essentials, Modern Daily Ritual, Signature Cosmetic Line). 
- **Clean Formula Promise**: A numbered list of commitments to quality and sustainability.
- **Editorial Gallery**: A 4-column grid for premium product shots and texture photography.
- **Inquiry CTA**: Clean section directing to the `/contact` form (pre-filled with `cosmetic_interest`).
- **Footer**: Uses the `cosmetic` variant (blue/white/cool grey tones).

### Media Slots Needed
- **Cosmetic Hero Visual**: Clinical, cool blue/white aesthetic.
- **Editorial Gallery Grid**: 4 distinct, high-quality product/texture shots.
- *Current State*: Handled via white/cool grey placeholders with subtle tracking text (e.g. "Signature Ritual"). 

## 3. SEO & Accessibility Notes
- Both pages use dynamic `generateMetadata` fetching from Supabase (`seo_settings`) with a fallback to `@vavaw/brand-config`.
- Canonical URLs are strict.
- Forms are fully accessible (proper labels, honeypots).
- Focus states are handled gracefully by browser defaults over contrast-compliant backgrounds.

## 4. Remaining Asset Gaps
To complete the ultimate visual experience, the client needs to upload the following to the Supabase `vavaw-media` bucket and assign them in the CMS:
1. `cosmetic-hero.jpg`
2. `beauty-hero.jpg`
3. `franchise-hero.jpg`
4. 4x Cosmetic Editorial Gallery shots.
