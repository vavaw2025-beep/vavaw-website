# Cross-App UI QA Checklist (Phase 35)

## Overview
This document tracks the visual QA and UI polish pass conducted across all apps in the VAVAW ecosystem after the Tailwind v4 styling recovery.

## Apps Checked

### apps/main
- [x] Homepage (/) - Cinematic hero intact, spacing correct.
- [x] Cosmetic Page (/cosmetic) - Content blocks render correctly, animations smooth.
- [x] Redirects (/go/[slug]) - Functional, no visual regressions.

### apps/admin
- [x] Login (/login) - Form inputs legible in dark theme, mock warning visible.
- [x] Dashboard (/) - Sidebar active states correct.
- [x] Business (/business) - Table readability good, badges styled.
- [x] Hero (/hero) - Image previews and forms aligned.
- [x] Media (/media) - Upload grids and copy buttons distinct.
- [x] SEO (/seo) - Form inputs spacing consistent.
- [x] Content (/content) - JSON editor fallback legible.
- [x] Users (/users) - Table contrast sufficient.
- [x] Preview Center (/preview) - Iframe/panels render accurately.
- [x] Settings (/settings) - Status cards clear.

### apps/beauty
- [x] Homepage (/) - Premium beauty palette applied. Soft rose/burgundy theme consistent. CTA buttons clear.

### apps/franchise
- [x] Homepage (/) - Professional business palette applied. Amber accents consistent. Hero layout aligned.

## Shared UI (@vavaw/ui)
- [x] Verified Button, Container do not hardcode app-specific colors.
- [x] Tailwind v4 @source setup correctly parses packages/ui classes.

## Accessibility Baseline
- [x] Buttons have readable text contrast.
- [x] Forms have discernible focus states.
- [x] Mobile tap targets are adequately spaced.

## Known Limitations & Future Polish
- Full WCAG contrast audit pending.
- Screen reader ARIA labels need a dedicated pass in a future phase.
