# VAVAW Brand System

This document outlines the foundation of the visual identity for the VAVAW multi-brand ecosystem.

## 1. Logo & Monogram Strategy

### Wordmark
- **Format**: `VAVAW` (always uppercase).
- **Typography**: Sans-serif, geometric, or clean modern font.
- **Letter-spacing (Tracking)**: Wide tracking (e.g., `0.25em` or `tracking-[0.25em]`).
- **Usage**: Used in headers, footers, and primary brand placements.

### Favicon & Monogram
- **Format**: `V` or `VA`.
- **Usage**: Use simple, recognizable monograms for favicons (`icon.svg`, `apple-icon.png`). Do **not** use the full "VAVAW" text for tiny favicons as it becomes unreadable.

## 2. Typography Hierarchy

The typographic rhythm across all apps focuses on readability and premium aesthetic:

- **Navigation & Small Caps**: Uppercase sans-serif with wide letter-spacing (`tracking-widest` or `tracking-[0.15em]`). Use for nav links, small metadata, and utility labels.
- **Body Text**: Clean sans-serif (e.g., Inter, system-ui). Relaxed line height (`leading-relaxed`).
- **Editorial Headings**: Use an elegant serif font (or a very clean geometric sans) for primary section headings, especially in the Cosmetic and Beauty apps, to convey a premium, editorial feel.
- **Structure**: Enforce strict semantic structure with exactly one `<h1>` per page.

## 3. Interaction & CTA Rules

### Buttons
- **Style**: Uppercase text.
- **Letter-spacing**: Wide (`tracking-widest`).
- **Sizing**: Generous height, typically `44px` to `52px` to ensure large, accessible click targets.
- **Padding**: Substantial horizontal padding (e.g., `px-8 py-4`).
- **Hover States**: Subtle contrast shifts (e.g., slight background color change or text color change). No bouncy or aggressive animations.

### Motion
- **Philosophy**: "Less is more."
- **Execution**: Use subtle fades or opacity transitions (`transition-opacity duration-500`, `transition-colors duration-300`). Avoid heavy transforms or spring animations that distract from the content.

## 4. Spacing & Rhythm

- **Sections**: Use generous vertical padding between sections (e.g., `py-20` to `py-32`) to allow content to breathe and feel luxurious.
- **Containers**: Constrain content width (e.g., `max-w-7xl`, `max-w-4xl` for text) to maintain readability on ultra-wide screens.
- **Mobile**: Ensure adequate padding on mobile (`px-6` or `px-8`) so text never touches the screen edge.

## 5. Ecosystem Palettes

Each application in the VAVAW ecosystem shares the same core layout components (like `SiteFooter`) but employs its own distinct color palette.

### Main App (`/`)
- **Vibe**: Cinematic, authoritative, premium tech.
- **Palette**: Deep Black, Ivory, Silver.
- **Usage**: Dark backgrounds with high-contrast, slightly muted text (Silver/Gray) that brightens on hover.

### Cosmetic Page (`/cosmetic`)
- **Vibe**: Clean Korean cosmetic, pure, minimalist.
- **Palette**: Ivory (`#fdfcfb`), Soft Beige, Taupe (`#8b837b`), Dark Charcoal (`#332f2b`).
- **Usage**: Very light backgrounds with soft text colors.

### Beauty App (`beauty.vavaw.vn`)
- **Vibe**: Warm, inviting, luxurious spa/care.
- **Palette**: Warm Ivory (`#fffaf5`), Blush Rose (`#b78c85`), Espresso (`#3d2b1f`).
- **Usage**: Creamy backgrounds with warm, deep brown typography.

### Franchise App (`franchise.vavaw.vn`)
- **Vibe**: Professional, investment-ready, bold.
- **Palette**: Black, Ivory, Champagne Gold (`#f6e2b3`), Amber (`#c69c6d`).
- **Usage**: Dark mode base with gold/amber accents for a high-end business feel.

## 6. Shared Layout Structure

- **Header**: Consistent structure across apps.
  - *Left*: VAVAW wordmark.
  - *Right*: Navigation links specific to the app/context.
- **Footer**: Managed centrally via `@vavaw/ui/site-footer`.
  - Uses the `variant` prop to adapt its colors to the host application (`main`, `cosmetic`, `beauty`, `franchise`).
  - Contains default cross-ecosystem links (Cosmetic, Beauty, Franchise, Contact).

## 7. Accessibility Foundation

- **Contrast**: Ensure text colors meet WCAG AA contrast ratios against their backgrounds.
- **Focus States**: Buttons and links must have visible focus rings for keyboard navigation.
- **Targets**: Interactive elements must be at least 44x44px.
- **Semantics**: Use `<header>`, `<footer>`, `<main>`, `<nav>`, and sequential heading tags (`h1`-`h6`).
