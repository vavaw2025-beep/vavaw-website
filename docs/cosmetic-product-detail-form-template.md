# Cosmetic Product Detail Form Template

## Overview
The `ProductDetailForm` is a reusable UI component designed to render legal, compliance, and detailed usage information for VAVAW cosmetic products. It was initially introduced for the Luminous Set landing page but is architected to be reusable across all 7 single product landing pages.

## How to Reuse

### 1. Types & Data
The payload uses the `productDetailForm` object inside `ProductLandingContent`.

```typescript
productDetailForm?: {
  eyebrow?: string;
  title?: string;
  description?: string;
  offlineTitle?: string;
  offlineDescription?: string;
  offlineMediaSlot?: string;
  info?: Array<{ label?: string; value?: string; }>;
  ingredientGroups?: Array<{ title?: string; subtitle?: string; ingredients?: string; }>;
  cautions?: string[];
  storage?: string;
  qualityGuarantee?: string;
}
```

### 2. Integration
Import and render the component in any of the single product pages (e.g. `apps/main/app/cosmetic/products/cellurevive-ampoule/CellureviveLandingPage.tsx`).

```tsx
import { ProductDetailForm } from '../_components/ProductDetailForm';

// Inside render:
{content.productDetailForm && (
  <ProductDetailForm productDetailForm={content.productDetailForm} cosmeticMedia={cosmeticMedia} />
)}
```

### 3. Admin UI
The Admin CMS (`CosmeticPageManager.tsx`) currently only shows the Product Detail Form editor for the `cosmetic-product-landing-luminous-set` block type. When extending to single products, remove or expand the condition:

```tsx
// Current:
{editingBlock.block_type === 'cosmetic-product-landing-luminous-set' && ( ... )}

// Future:
{(editingBlock.block_type === 'cosmetic-product-landing-luminous-set' || editingBlock.block_type.startsWith('cosmetic-product-landing-')) && ( ... )}
```

## Compliance & Legal Guidelines
- **Ingredients:** Do NOT invent or hallucinate full legal INCI lists. If the exact INCI is not provided by the owner, use a generic placeholder like: `Aqua, Glycerin, [Key Ingredient]... Please refer to the product packaging for the complete ingredient list.`
- **Cautions:** Stick to standard cosmetic warnings (e.g. "Chỉ dùng ngoài da", "Tránh tiếp xúc mắt"). Do not use medical/treatment claims.
- **Offline Media Slot:** If used on single products, ensure the specific page has a valid slot mapping (e.g. reusing the luminous offline slot, or creating a new generic `cosmetic-offline-experience-image` slot).
